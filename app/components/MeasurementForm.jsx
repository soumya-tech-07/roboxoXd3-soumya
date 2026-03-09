"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const supabase = createClient();

export default function MeasurementForm({
  productCategory = null,
  showSizeChart = false,
  onSave = null,
  submitButtonText = "SAVE PREFERENCES",
  loadAllCharts = false, // NEW: Load all size charts
}) {
  const [sizeCharts, setSizeCharts] = useState([]); // Changed to array for multiple charts
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bodyMeasurementUnit, setBodyMeasurementUnit] = useState("IN"); // NEW: Unit for body measurements
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    favouriteSection: "Woman",
    height: "",
    heightUnit: "CM",
    weight: "",
    weightUnit: "KG",
    age: "",
    bodyMeasurements: {},
  });

  // Extract measurement keys from ALL size charts to generate dynamic fields
  const measurementFields = useMemo(() => {
    if (!sizeCharts || sizeCharts.length === 0) {
      return [];
    }

    const keys = new Set();
    sizeCharts.forEach((chart) => {
      if (chart.measurements && Array.isArray(chart.measurements)) {
        chart.measurements.forEach((item) => {
          Object.keys(item).forEach((key) => {
            if (key !== 'size') {
              keys.add(key);
            }
          });
        });
      }
    });

    return Array.from(keys).map(key => ({
      key: key.toLowerCase(),
      label: key.toUpperCase()
    }));
  }, [sizeCharts]);

  // Load size charts - either all or specific category
  const loadSizeCharts = useCallback(async () => {
    try {
      setLoading(true);

      if (loadAllCharts) {
        // Load ALL size charts for comprehensive measurement form
        const { data, error } = await supabase
          .from('size_charts')
          .select('*')
          .order('category', { ascending: true });

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading size charts:', error);
        } else if (data) {
          setSizeCharts(data);
        }
      } else if (productCategory) {
        // Load specific category
        let chartCategory = productCategory;

        // Handle category mapping
        if (productCategory === 'SWEATPANTS') {
          chartCategory = 'SWEATPANTS';
        } else if (productCategory === 'PANTS') {
          chartCategory = 'PANTS';
        }

        const { data, error } = await supabase
          .from('size_charts')
          .select('*')
          .eq('category', chartCategory)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading size chart:', error);
        } else if (data) {
          setSizeCharts([data]); // Wrap in array for consistent handling
        }
      }
    } catch (error) {
      console.error('Error loading size charts:', error);
    } finally {
      setLoading(false);
    }
  }, [productCategory, loadAllCharts]);

  // Load user profile data
  const loadUserProfile = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading user profile:', error);
      } else if (data) {
        // Populate form with existing profile data
        setFormData({
          name: data.name || "",
          favouriteSection: data.favourite_section || "Woman",
          height: data.height ? String(data.height) : "",
          heightUnit: data.height_unit || "CM",
          weight: data.weight ? String(data.weight) : "",
          weightUnit: data.weight_unit || "KG",
          age: data.age ? String(data.age) : "",
          bodyMeasurements: data.body_measurements || {},
        });
        // Set unit if it exists, otherwise standard default "CM" (or keep state default)
        if (data.body_measurements_unit) {
          setBodyMeasurementUnit(data.body_measurements_unit);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, [user]);

  // Load data on mount
  useEffect(() => {
    if (loadAllCharts || (productCategory && showSizeChart)) {
      loadSizeCharts();
    }
  }, [productCategory, showSizeChart, loadAllCharts, loadSizeCharts]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user, loadUserProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Check if this is a binary measurement field
    if (name.startsWith('measurement_')) {
      const measurementKey = name.replace('measurement_', '');
      setFormData((prev) => ({
        ...prev,
        bodyMeasurements: {
          ...prev.bodyMeasurements,
          [measurementKey]: value
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showError("Please log in to save your preferences.");
      return;
    }

    try {
      setSaving(true);

      // Prepare data for Supabase
      const profileData = {
        user_id: user.id,
        name: formData.name,
        favourite_section: formData.favouriteSection,
        height: formData.height ? parseFloat(formData.height) : null,
        height_unit: formData.heightUnit,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        weight_unit: formData.weightUnit,
        age: formData.age ? parseInt(formData.age) : null,
        body_measurements: formData.bodyMeasurements,
        body_measurements_unit: bodyMeasurementUnit, // Save the unit
      };

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      let error;
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', user.id);
        error = updateError;
      } else {
        // Insert new profile
        const { error: insertError } = await supabase
          .from('user_profiles')
          .insert(profileData);
        error = insertError;
      }

      if (error) {
        console.error('Error saving user profile:', error);
        showError("Failed to save your preferences. Please try again.");
        return;
      }

      // Success
      showSuccess("Your size preferences have been saved!");
      if (onSave) {
        onSave(profileData);
      }
    } catch (err) {
      console.error('Error saving user profile:', err);
      showError("Failed to save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Size Charts Section */}
      {showSizeChart && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-lg font-medium text-gray-900 tracking-wide uppercase mb-1" style={{ letterSpacing: '-0.02em' }}>
              SIZE GUIDES
            </h2>
            <p className="text-xs text-gray-600 text-right pr-2">
              All measurements in inches
            </p>
          </div>

          {/* Display all size charts */}
          {loading ? (
            <div className="w-full border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-600">Loading size charts...</p>
            </div>
          ) : sizeCharts && sizeCharts.length > 0 ? (
            <div className="space-y-6">
              {sizeCharts.map((chart, index) => (
                <div key={chart.id || index} className="space-y-4">
                  {/* Chart Title */}
                  <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide border-b border-gray-200 pb-2">
                    {chart.name || chart.category}
                  </h3>

                  {/* Chart Table */}
                  {chart.measurements && (
                    <SizeChartTable measurements={chart.measurements} />
                  )}

                  {/* Measurement Diagram */}
                  {chart.image_url && (
                    <div className="flex justify-center items-center">
                      <div className="relative w-40 max-w-40">
                        <Image
                          src={chart.image_url}
                          alt={`${chart.name} measurement diagram`}
                          width={600}
                          height={800}
                          className="w-full h-auto object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full border border-gray-200 rounded-lg p-8 text-center">
              <p className="text-sm text-gray-600">No size charts available.</p>
            </div>
          )}
        </div>
      )}

      {/* Measurement Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-xs tracking-widest text-gray-900 mb-3 font-medium">
            NAME
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2.5 text-base text-gray-900 transition-colors bg-transparent placeholder:text-gray-500"
            style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
            placeholder="Enter your name"
          />
        </div>

        {/* Favourite Section */}
        <div>
          <label className="block text-xs tracking-widest text-gray-900 mb-3 font-medium">
            FAVOURITE SECTION
          </label>
          <select
            name="favouriteSection"
            value={formData.favouriteSection}
            onChange={handleInputChange}
            className="w-full border-b border-gray-300 focus:border-black outline-none py-2.5 text-base text-gray-900 transition-colors bg-transparent appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.5rem center",
              backgroundSize: "1.5rem",
              paddingRight: "2.5rem",
              transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)',
              transitionDuration: '200ms'
            }}
          >
            <option value="Woman">Woman</option>
            <option value="Man">Man</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Height */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs tracking-widest text-gray-900 font-medium">
              HEIGHT
            </label>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, heightUnit: "CM" }))
                }
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${formData.heightUnit === "CM"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
              >
                CM
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, heightUnit: "IN" }))
                }
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${formData.heightUnit === "IN"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
              >
                IN
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              className="input-no-spinner w-full border-b border-gray-300 focus:border-black outline-none py-2.5 text-base text-gray-900 transition-colors text-center bg-transparent placeholder:text-gray-500"
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
              placeholder="0.0"
            />
            <span className="absolute right-0 bottom-2.5 text-sm text-gray-700 font-medium">
              {formData.heightUnit}
            </span>
          </div>
          {formData.height && (
            <p className="text-center text-sm text-gray-900 font-medium mt-2">
              {formData.height} {formData.heightUnit}
            </p>
          )}
        </div>

        {/* Weight */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs tracking-widest text-gray-900 font-medium">
              WEIGHT
            </label>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, weightUnit: "KG" }))
                }
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${formData.weightUnit === "KG"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
              >
                KG
              </button>
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, weightUnit: "LBS" }))
                }
                className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${formData.weightUnit === "LBS"
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                  }`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
              >
                LBS
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              required
              min="0"
              step="0.1"
              className="input-no-spinner w-full border-b border-gray-300 focus:border-black outline-none py-2.5 text-base text-gray-900 transition-colors text-center bg-transparent placeholder:text-gray-500"
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
              placeholder="0.0"
            />
            <span className="absolute right-0 bottom-2.5 text-sm text-gray-700 font-medium">
              {formData.weightUnit}
            </span>
          </div>
          {formData.weight && (
            <p className="text-center text-sm text-gray-900 font-medium mt-2">
              {formData.weight} {formData.weightUnit}
            </p>
          )}
        </div>

        {/* Age */}
        <div>
          <label className="block text-xs tracking-widest text-gray-900 mb-1.5 font-medium">
            AGE <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          <p className="text-[10px] text-gray-700 mb-3" style={{ lineHeight: '1.6' }}>
            Age influences the distribution of your weight. Knowing your
            age enables us to recommend the correct size for you.
          </p>
          <div className="relative">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              min="0"
              max="120"
              className="input-no-spinner w-full border-b border-gray-300 focus:border-black outline-none py-2 text-base text-gray-900 transition-colors text-center bg-transparent placeholder:text-gray-500"
              style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
              placeholder="0"
            />
            <span className="absolute right-0 bottom-2 text-sm text-gray-700 font-medium">
              YEARS
            </span>
          </div>
          {formData.age && (
            <p className="text-center text-xs text-gray-900 font-medium mt-1.5">
              {formData.age} YEARS
            </p>
          )}
        </div>

        {/* Body Measurements Section - DYNAMIC */}
        {measurementFields.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs tracking-widest text-gray-900 font-medium">
                  BODY MEASUREMENTS
                </h3>
                <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setBodyMeasurementUnit("CM")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${bodyMeasurementUnit === "CM"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
                  >
                    CM
                  </button>
                  <button
                    type="button"
                    onClick={() => setBodyMeasurementUnit("IN")}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${bodyMeasurementUnit === "IN"
                        ? "bg-white text-black shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                      }`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
                  >
                    IN
                  </button>
                </div>
              </div>
              <p className="text-[10px] text-gray-700" style={{ lineHeight: '1.6' }}>
                Enter your body measurements in {bodyMeasurementUnit === "CM" ? "centimeters" : "inches"} (as shown in the size chart above)
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {measurementFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs tracking-widest text-gray-900 mb-2 font-medium">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name={`measurement_${field.key}`}
                      value={formData.bodyMeasurements[field.key] || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="input-no-spinner w-full border-b border-gray-300 focus:border-black outline-none py-2 text-base text-gray-900 transition-colors text-center bg-transparent placeholder:text-gray-500"
                      style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
                      placeholder="0.0"
                    />
                    <span className="absolute right-0 bottom-2 text-sm text-gray-700 font-medium">
                      {bodyMeasurementUnit}
                    </span>
                  </div>
                  {formData.bodyMeasurements[field.key] && (
                    <p className="text-center text-xs text-gray-900 font-medium mt-1">
                      {formData.bodyMeasurements[field.key]} {bodyMeasurementUnit === "CM" ? "cm" : "inches"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-black text-white px-6 py-3.5 rounded-lg hover:bg-gray-800 active:scale-95 transition-all text-sm font-medium tracking-wide shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0.0, 0, 1)', transitionDuration: '200ms' }}
          >
            {saving ? "SAVING..." : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}

// Size Chart Table Component
function SizeChartTable({ measurements }) {
  if (!measurements || !Array.isArray(measurements) || measurements.length === 0) {
    return (
      <div className="w-full border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-sm text-gray-600">No size data available.</p>
      </div>
    );
  }

  // Get all unique measurement keys
  const measurementKeys = new Set();
  measurements.forEach((item) => {
    Object.keys(item).forEach((key) => {
      if (key !== 'size') {
        measurementKeys.add(key.toUpperCase());
      }
    });
  });

  const measurementKeysArray = Array.from(measurementKeys);
  const sizes = measurements.map((item) => item.size);

  return (
    <div className="w-full border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full border-collapse">
        {/* Header Row */}
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="border-r border-gray-200 p-3 text-center text-sm font-medium text-gray-900">
              SIZE
            </th>
            {sizes.map((size) => (
              <th
                key={size}
                className="border-r border-gray-200 last:border-r-0 p-3 text-center text-sm font-medium text-gray-900"
              >
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Measurement Rows */}
          {measurementKeysArray.map((key) => (
            <tr key={key} className="border-b border-gray-200 last:border-b-0">
              <td className="border-r border-gray-200 p-3 text-center text-sm font-medium text-gray-900 bg-white">
                {key}
              </td>
              {sizes.map((size) => {
                const item = measurements.find((m) => m.size === size);
                const value = item ? item[key.toLowerCase()] || '-' : '-';
                return (
                  <td
                    key={size}
                    className="border-r border-gray-200 last:border-r-0 p-3 text-center text-sm text-gray-700 bg-white"
                  >
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
