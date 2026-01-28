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

        // Fetch user's body measurements
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('body_measurements, body_measurements_unit') // Fetch unit too
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

        // Fetch size chart for the product category
        const { data: sizeChart, error: chartError } = await supabase
          .from('size_charts')
          .select('*')
          .eq('category', productCategory)
          .single();

        if (chartError || !sizeChart?.measurements) {
          console.log('SizeRecommendation: Size chart error or empty', { chartError, sizeChart });
          setStatus('error');
          return;
        }

        const chartMeasurements = sizeChart.measurements;
        console.log('SizeRecommendation: Chart measurements found:', chartMeasurements);

        // Find the best matching size
        const bestSize = findBestSize(userMeasurements, userUnit, chartMeasurements, availableSizes);
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
  const findBestSize = (userMeasurements, userUnit, chartMeasurements, availableSizes) => {
    if (!Array.isArray(chartMeasurements) || chartMeasurements.length === 0) {
      return null;
    }

    // Determine conversion factor (User Unit -> Chart Unit)
    // Assuming Chart is ALWAYS in INCHES for now (based on codebase context)
    // If user is CM, convert to Inches (divide by 2.54)
    // If user is IN, keep as is
    const convertToChartUnit = (value) => {
      if (userUnit === 'CM') {
        return value / 2.54;
      }
      return value;
    };

    // Helper for case-insensitive lookup
    const getValueCaseInsensitive = (obj, key) => {
      const foundKey = Object.keys(obj).find(k => k.toLowerCase() === key.toLowerCase());
      return foundKey ? obj[foundKey] : undefined;
    };

    // Helper to parse chart values which might be ranges "28-30" or strings "30 in"
    const parseChartValue = (value) => {
      if (typeof value === 'number') return value;
      if (!value) return NaN;

      const str = String(value);
      // Extract all numbers
      const matches = str.match(/(\d+(\.\d+)?)/g);

      if (!matches) return NaN;

      if (matches.length >= 2) {
        // It's a range, take the average
        const min = parseFloat(matches[0]);
        const max = parseFloat(matches[1]);
        return (min + max) / 2;
      }

      return parseFloat(matches[0]);
    };

    // Calculate match score for each size
    const sizeScores = chartMeasurements.map((sizeData) => {
      const size = sizeData.size;
      let totalDifference = 0;
      let matchedFields = 0;

      // Compare each measurement the user has entered
      Object.keys(userMeasurements).forEach((key) => {
        const rawUserValue = parseFloat(userMeasurements[key]);
        const chartValueRaw = getValueCaseInsensitive(sizeData, key);
        const chartValue = parseChartValue(chartValueRaw);

        console.log(`SizeRecommendation: Comparing Size ${size} - Key: ${key}`, {
          userValue: rawUserValue,
          chartValue: chartValue,
          userKey: key,
          chartValueRaw
        });

        if (!isNaN(rawUserValue) && !isNaN(chartValue) && rawUserValue > 0) {
          // CONVERT user value to match chart unit (Inches)
          const userValue = convertToChartUnit(rawUserValue);

          // Calculate absolute difference
          const difference = Math.abs(userValue - chartValue);
          totalDifference += difference;
          matchedFields++;
        }
      });

      // If no fields matched, return null
      if (matchedFields === 0) {
        console.log(`SizeRecommendation: No matched fields for Size ${size}`);
        return { size, score: Infinity };
      }

      // Average difference (lower is better)
      const averageDifference = totalDifference / matchedFields;
      console.log(`SizeRecommendation: Size ${size} Score: ${averageDifference}`);

      return { size, score: averageDifference };
    });

    // Filter out sizes not available in the product
    const validSizes = sizeScores.filter(
      (s) => s.score !== Infinity && availableSizes.includes(s.size)
    );

    if (validSizes.length === 0) {
      return null;
    }

    // Find the size with the lowest score (best match)
    const bestMatch = validSizes.reduce((best, current) =>
      current.score < best.score ? current : best
    );

    // Only recommend if the match is reasonable (within 3 inches average difference)
    if (bestMatch.score <= 3) {
      return bestMatch.size;
    }

    return null;
  };

  // Render logic
  if (!user || status === 'idle' || status === 'error') {
    return null;
  }

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
