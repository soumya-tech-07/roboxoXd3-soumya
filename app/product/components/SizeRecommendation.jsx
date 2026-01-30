'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../../context/AuthContext';

const supabase = createClient();

export default function SizeRecommendation({ productCategory, availableSizes, onSizeGuideOpen }) {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'no_match', 'missing_data', 'error'

  useEffect(() => {
    // If not logged in, we don't show anything (or we could show a "Log in for size" prompt)
    if (!user) {
      setStatus('idle');
      return;
    }

    if (!productCategory) {
      setStatus('error');
      return;
    }

    const fetchRecommendation = async () => {
      try {
        setStatus('loading');
        console.log('SizeRecommendation: Starting fetch for', { productCategory, user: user?.id });

        // 1. Fetch user's body measurements
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('body_measurements, body_measurements_unit')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile?.body_measurements) {
          console.log('SizeRecommendation: No profile/measurements found', { profileError, profile });
          setStatus('missing_data');
          return;
        }

        const userMeasurements = profile.body_measurements;
        const userUnit = profile.body_measurements_unit || 'CM'; // Default to CM if not set
        console.log('SizeRecommendation: User measurements:', { userMeasurements, userUnit });

        // Check if user has any measurements saved
        if (!userMeasurements || Object.keys(userMeasurements).length === 0) {
          console.log('SizeRecommendation: Measurements object empty');
          setStatus('missing_data');
          return;
        }

        // 2. Fetch TOLERANCE RANGES (New logic)
        // Normalize category keys to match DB (e.g. SWEATPANTS -> Pants)
        let searchCategory = productCategory;
        const catUpper = String(productCategory).toUpperCase();

        if (catUpper.includes('SWEATPANT') || catUpper.includes('PANT') || catUpper.includes('GLOW IN THE DARK')) {
          searchCategory = 'Pants';
        }
        else if (catUpper.includes('SHIRT') || catUpper.includes('TEE') || catUpper.includes('TOP')) {
          // Distinguish women's tops if possible, otherwise default to Shirt
          // For now mapping generic "Shirt"
          searchCategory = 'Shirt';
        }
        else if (catUpper.includes('JACKET')) {
          if (catUpper.includes('FUR')) searchCategory = 'Fur Jacket';
          else searchCategory = 'Varsity Jacket';
        }

        console.log(`SizeRecommendation: Normalized '${productCategory}' -> '${searchCategory}'`);

        const { data: toleranceData, error: toleranceError } = await supabase
          .from('size_tolerance_ranges')
          .select('tolerances')
          .eq('category', searchCategory)
          .single();

        if (toleranceError || !toleranceData?.tolerances) {
          console.log('SizeRecommendation: Tolerance data missing for category', productCategory);
          // Fallback: If no tolerance data exists, we can't recommend safely.
          setStatus('error');
          return;
        }

        // The tolerances are already a clean array: [{ size: 'S', key: 'chest', min: 30, max: 36 }, ...]
        const toleranceChart = toleranceData.tolerances;
        console.log('SizeRecommendation: Tolerance Chart found:', toleranceChart);

        // Find the best matching size
        const bestSize = findBestSize(userMeasurements, userUnit, toleranceChart, availableSizes);
        console.log('SizeRecommendation: Calculated best size:', bestSize);

        if (bestSize) {
          setRecommendation(bestSize);
          setStatus('success');
        } else {
          setRecommendation(null);
          setStatus('no_match');
        }
      } catch (error) {
        console.error('Error fetching size recommendation:', error);
        setStatus('error');
      }
    };

    fetchRecommendation();
  }, [user, productCategory, availableSizes]);

  // Algorithm to find best matching size
  const findBestSize = (userMeasurements, userUnit, toleranceChart, availableSizes) => {
    if (!Array.isArray(toleranceChart) || toleranceChart.length === 0) {
      return null;
    }

    // Determine conversion factor (User Unit -> Chart Unit)
    // Assuming Tolerances are ALWAYS in INCHES based on provided data
    const convertToChartUnit = (value) => {
      if (userUnit === 'CM') {
        return value / 2.54;
      }
      return value;
    };

    // Helper for case-insensitive measurement lookup
    // (e.g., matching User's "Chest" to Tolerance Key "chest")
    const getUserValueForKey = (measurements, targetKey) => {
      const foundKey = Object.keys(measurements).find(k => k.toLowerCase() === targetKey.toLowerCase());
      return foundKey ? measurements[foundKey] : undefined;
    };

    // Group tolerances by Size to score them
    // toleranceChart is flat: [{size: S, ...}, {size: S, ...}, {size: M, ...}]
    // We want to verify if a User matches ALL criteria for a specific Size.

    // Get unique sizes from tolerance chart that are also available in product
    const sizesToCheck = [...new Set(toleranceChart.map(t => t.size))].filter(s => availableSizes.includes(s));

    const validSizes = [];

    sizesToCheck.forEach(size => {
      // Get all rules for this size (e.g. S might have Chest 30-36 AND Waist 28-30)
      const rules = toleranceChart.filter(t => t.size === size);

      let isMatch = true;
      let totalDistance = 0;
      let matchedRulesCount = 0;
      let maxBoundary = 0;

      for (const rule of rules) {
        const userValueRaw = getUserValueForKey(userMeasurements, rule.key);

        // If user hasn't provided this measurement, we skip this rule (lenient match)
        // OR strict match? Let's stick to lenient: if provided, must fit.
        if (userValueRaw === undefined) continue;

        const val = parseFloat(userValueRaw);
        if (isNaN(val)) continue;

        // Convert to Inches
        const valInches = convertToChartUnit(val);

        console.log(`Checking Size ${size} Rule [${rule.key}]: ${rule.min}-${rule.max} vs User: ${valInches.toFixed(2)}`);

        // STRICT RANGE CHECK
        if (valInches >= rule.min && valInches <= rule.max) {
          // In range!
          totalDistance += 0;
        } else {
          // Out of range
          // Calculate distance to nearest boundary
          const dMin = Math.abs(valInches - rule.min);
          const dMax = Math.abs(valInches - rule.max);
          totalDistance += Math.min(dMin, dMax);
          isMatch = false;
        }

        if (rule.max > maxBoundary) maxBoundary = rule.max;
        matchedRulesCount++;
      }

      // If we checked at least one rule and it passed ALL range checks
      if (matchedRulesCount > 0) {
        validSizes.push({
          size,
          isPerfect: isMatch,
          score: isMatch ? 0 : (totalDistance / matchedRulesCount), // Average distance
          magnitude: maxBoundary
        });
      }
    });

    if (validSizes.length === 0) return null;

    // Sort:
    // 1. Score (0 is perfect)
    // 2. Magnitude (Larger is better if scores match)
    validSizes.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return b.magnitude - a.magnitude;
    });

    const best = validSizes[0];
    console.log('Best match found:', best);

    // If perfect match (Score 0) -> Recommend
    // If not perfect, but close (<= 3), recommend as fallback
    if (best.score <= 3) {
      return best.size;
    }

    return null;
  };

  // Render logic
  if (!user) return null;

  if (status === 'error') {
    return (
      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">
        Unable to load size chart for category: {productCategory}
      </div>
    );
  }

  if (status === 'idle') return null;

  // Common container classes
  const containerClasses = "mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg";

  if (status === 'loading') {
    return (
      <div className={containerClasses}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border-2 border-brand border-t-transparent animate-spin"></div>
          <p className="text-sm text-gray-600">Calculating best fit...</p>
        </div>
      </div>
    );
  }

  if (status === 'missing_data') {
    return (
      <div className={containerClasses}>
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-900">
              Add your measurements to get a size recommendation.
            </p>
            <button
              type="button"
              onClick={onSizeGuideOpen}
              className="text-xs text-brand font-medium hover:underline mt-1 cursor-pointer"
            >
              Add measurements
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'no_match') {
    return (
      <div className={containerClasses}>
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-900">
              We couldn&apos;t find a perfect size match based on your current inputs.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Please check your <span className="font-semibold">units (CM vs IN)</span> and values.
            </p>
            <button
              type="button"
              onClick={onSizeGuideOpen}
              className="text-xs text-brand font-medium hover:underline mt-1 cursor-pointer"
            >
              Update measurements
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Success case
  return (
    <div className={containerClasses}>
      <div className="flex items-start gap-2">
        <svg
          className="w-5 h-5 text-brand flex-shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm text-gray-900">
            <span className="font-semibold">Size {recommendation}</span> is recommended based on your measurements.
          </p>
          <button
            type="button"
            onClick={onSizeGuideOpen}
            className="text-xs text-gray-600 hover:text-brand underline mt-1 inline-block cursor-pointer"
          >
            Update your measurements
          </button>
        </div>
      </div>
    </div>
  );
}
