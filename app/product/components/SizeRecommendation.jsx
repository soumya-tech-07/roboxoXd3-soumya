'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from '../../context/AuthContext';

const supabase = createClient();

export default function SizeRecommendation({ productCategory, availableSizes, onSizeGuideOpen }) {
  const { user } = useAuth();
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || !productCategory) {
      setRecommendation(null);
      return;
    }

    const fetchRecommendation = async () => {
      try {
        setLoading(true);

        // Fetch user's body measurements
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('body_measurements')
          .eq('user_id', user.id)
          .single();

        if (profileError || !profile?.body_measurements) {
          setRecommendation(null);
          return;
        }

        const userMeasurements = profile.body_measurements;
        
        // Check if user has any measurements saved
        if (!userMeasurements || Object.keys(userMeasurements).length === 0) {
          setRecommendation(null);
          return;
        }

        // Fetch size chart for the product category
        const { data: sizeChart, error: chartError } = await supabase
          .from('size_charts')
          .select('measurements')
          .eq('category', productCategory)
          .single();

        if (chartError || !sizeChart?.measurements) {
          setRecommendation(null);
          return;
        }

        const chartMeasurements = sizeChart.measurements;

        // Find the best matching size
        const bestSize = findBestSize(userMeasurements, chartMeasurements, availableSizes);

        if (bestSize) {
          setRecommendation(bestSize);
        } else {
          setRecommendation(null);
        }
      } catch (error) {
        console.error('Error fetching size recommendation:', error);
        setRecommendation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [user, productCategory, availableSizes]);

  // Algorithm to find best matching size
  const findBestSize = (userMeasurements, chartMeasurements, availableSizes) => {
    if (!Array.isArray(chartMeasurements) || chartMeasurements.length === 0) {
      return null;
    }

    // Calculate match score for each size
    const sizeScores = chartMeasurements.map((sizeData) => {
      const size = sizeData.size;
      let totalDifference = 0;
      let matchedFields = 0;

      // Compare each measurement the user has entered
      Object.keys(userMeasurements).forEach((key) => {
        const userValue = parseFloat(userMeasurements[key]);
        const chartValue = parseFloat(sizeData[key.toLowerCase()]);

        if (!isNaN(userValue) && !isNaN(chartValue) && userValue > 0) {
          // Calculate absolute difference
          const difference = Math.abs(userValue - chartValue);
          totalDifference += difference;
          matchedFields++;
        }
      });

      // If no fields matched, return null
      if (matchedFields === 0) {
        return { size, score: Infinity };
      }

      // Average difference (lower is better)
      const averageDifference = totalDifference / matchedFields;
      
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

  // Don't render anything if no recommendation or still loading
  if (!recommendation || loading) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
