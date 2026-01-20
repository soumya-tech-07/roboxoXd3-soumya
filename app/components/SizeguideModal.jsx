"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

const supabase = createClient();

export default function SizeGuideModal({
  isOpen,
  onClose,
  productName = "FADED GREY JOGGERS",
  productCategory = null,
}) {
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [sizeChart, setSizeChart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const [formData, setFormData] = useState({
    name: "",
    favouriteSection: "Woman",
    height: "",
    heightUnit: "CM",
    weight: "",
    weightUnit: "KG",
    age: "",
  });

  // Define loadSizeChart function before useEffect
  const loadSizeChart = useCallback(async () => {
    if (!productCategory) return;

    try {
      setLoading(true);
      // Map product category to size chart category
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
        setSizeChart(data);
      }
    } catch (error) {
      console.error('Error loading size chart:', error);
    } finally {
      setLoading(false);
    }
  }, [productCategory]);

  // Define loadUserProfile function before useEffect
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
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }, [user]);

  // Load size chart based on product category
  useEffect(() => {
    if (isOpen && productCategory) {
      loadSizeChart();
    }
  }, [isOpen, productCategory, loadSizeChart]);

  // Load user profile data when modal opens and user is logged in
  useEffect(() => {
    if (isOpen && user && !authLoading) {
      loadUserProfile();
    } else if (isOpen && !user && !authLoading) {
      // Reset form if user logs out
      setFormData({
        name: "",
        favouriteSection: "Woman",
        height: "",
        heightUnit: "CM",
        weight: "",
        weightUnit: "KG",
        age: "",
      });
    }
  }, [isOpen, user, authLoading, loadUserProfile]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomizeClick = () => {
    // Check if user is logged in
    if (!user) {
      // Open login modal and close size guide modal
      onClose();
      openLogin();
      return;
    }
    // User is logged in, show the customize form
    setShowCustomizeForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please log in to save your preferences.");
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
        alert("Failed to save your preferences. Please try again.");
        return;
      }

      // Success
      alert("Your size preferences have been saved!");
      setShowCustomizeForm(false);
      onClose();
    } catch (err) {
      console.error('Error saving user profile:', err);
      alert("Failed to save your preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setShowCustomizeForm(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2 sm:px-4 py-4 sm:py-8 overflow-y-auto">
      {/* Modal */}
      <div className="relative w-full max-w-4xl bg-white text-gray-900 shadow-2xl rounded-lg border border-gray-200 animate-in fade-in zoom-in duration-200 my-auto">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all z-10 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center cursor-pointer"
          aria-label="Close size guide"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {!showCustomizeForm ? (
          <>
            {/* Title */}
            <div className="pt-8 pb-6 px-4 sm:px-6 text-center">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-wide uppercase">
                SIZE GUIDE
              </h1>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 md:px-8 pb-6 space-y-6">
              {/* Unit indicator */}
              <p className="text-xs text-gray-600 text-right pr-2">
                In inches
              </p>

              {/* Dynamic Size Chart Table */}
              {loading ? (
                <div className="w-full border border-gray-900 p-8 text-center">
                  <p className="text-sm text-gray-600">Loading size chart...</p>
                </div>
              ) : sizeChart && sizeChart.measurements ? (
                <SizeChartTable measurements={sizeChart.measurements} />
              ) : (
                <div className="w-full border border-gray-900 p-8 text-center">
                  <p className="text-sm text-gray-600">Size chart not available for this category.</p>
                </div>
              )}

              {/* Tip text */}
              <p className="text-sm text-gray-900 text-center">
                If you&apos;re confused about your size, go one size up!
              </p>

              {/* How to measure */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 uppercase text-center">
                  How to measure:
                </h3>

                {/* Measurement Diagram */}
                {sizeChart?.image_url && (
                  <div className="flex justify-center items-center">
                    <div className="relative w-40 max-w-40">
                      <Image
                        src={sizeChart.image_url}
                        alt={`${sizeChart.name} measurement diagram`}
                        width={600}
                        height={800}
                        className="w-full h-auto object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Customize Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleCustomizeClick}
                  className="bg-brand text-white px-8 py-3 rounded-lg hover:bg-red-700 active:scale-95 transition-all text-sm font-semibold tracking-wide uppercase cursor-pointer"
                >
                  CUSTOMIZE YOUR SIZE
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Customize Form */}
            <div className="pt-8 pb-4 px-4 sm:px-6 text-center border-b border-gray-200 bg-gradient-to-b from-brand/5 via-brand/3 to-transparent">
              <p className="text-[10px] tracking-[0.4em] text-brand mb-2 font-medium">
                CUSTOMIZE
              </p>
              <h2 className="text-sm sm:text-base tracking-[0.15em] font-semibold text-gray-900">
                BASIC INFORMATION
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="px-6 sm:px-8 md:px-12 py-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs tracking-widest text-gray-700 mb-3 font-semibold">
                  NAME
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border-b-2 border-gray-300 focus:border-brand outline-none py-2.5 text-base transition-colors bg-transparent placeholder:text-gray-400"
                  placeholder="Enter your name"
                />
              </div>

              {/* Favourite Section */}
              <div>
                <label className="block text-xs tracking-widest text-gray-700 mb-3 font-semibold">
                  FAVOURITE SECTION
                </label>
                <select
                  name="favouriteSection"
                  value={formData.favouriteSection}
                  onChange={handleInputChange}
                  className="w-full border-b-2 border-gray-300 focus:border-brand outline-none py-2.5 text-base transition-colors bg-transparent appearance-none cursor-pointer text-gray-900"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23999'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.5rem center",
                    backgroundSize: "1.5rem",
                    paddingRight: "2.5rem",
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
                  <label className="text-xs tracking-widest text-gray-700 font-semibold">
                    HEIGHT
                  </label>
                  <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, heightUnit: "CM" }))
                      }
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        formData.heightUnit === "CM"
                          ? "bg-white text-brand shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      CM
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, heightUnit: "IN" }))
                      }
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        formData.heightUnit === "IN"
                          ? "bg-white text-brand shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
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
                    className="w-full border-b-2 border-gray-300 focus:border-brand outline-none py-2.5 text-base transition-colors text-center bg-transparent"
                    placeholder="0.0"
                  />
                  <span className="absolute right-0 bottom-2.5 text-sm text-gray-500 font-medium">
                    {formData.heightUnit}
                  </span>
                </div>
                {formData.height && (
                  <p className="text-center text-sm text-brand font-medium mt-2">
                    {formData.height} {formData.heightUnit}
                  </p>
                )}
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs tracking-widest text-gray-700 font-semibold">
                    WEIGHT
                  </label>
                  <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, weightUnit: "KG" }))
                      }
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        formData.weightUnit === "KG"
                          ? "bg-white text-brand shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      KG
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, weightUnit: "LBS" }))
                      }
                      className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                        formData.weightUnit === "LBS"
                          ? "bg-white text-brand shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
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
                    className="w-full border-b-2 border-gray-300 focus:border-brand outline-none py-2.5 text-base transition-colors text-center bg-transparent"
                    placeholder="0.0"
                  />
                  <span className="absolute right-0 bottom-2.5 text-sm text-gray-500 font-medium">
                    {formData.weightUnit}
                  </span>
                </div>
                {formData.weight && (
                  <p className="text-center text-sm text-brand font-medium mt-2">
                    {formData.weight} {formData.weightUnit}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs tracking-widest text-gray-700 mb-1.5 font-semibold">
                  AGE <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <p className="text-[10px] text-gray-600 mb-3 leading-relaxed">
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
                    className="w-full border-b-2 border-gray-300 focus:border-brand outline-none py-2 text-base transition-colors text-center bg-transparent"
                    placeholder="0"
                  />
                  <span className="absolute right-0 bottom-2 text-sm text-gray-500 font-medium">
                    YEARS
                  </span>
                </div>
                {formData.age && (
                  <p className="text-center text-xs text-brand font-medium mt-1.5">
                    {formData.age} YEARS
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowCustomizeForm(false)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition-all text-sm font-semibold tracking-wide cursor-pointer"
                >
                  BACK
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-brand text-white px-6 py-3.5 rounded-lg hover:bg-brand/90 active:scale-95 transition-all text-sm font-semibold tracking-wide shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "SAVING..." : "SAVE PREFERENCES"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// Size Chart Table Component
function SizeChartTable({ measurements }) {
  if (!measurements || !Array.isArray(measurements) || measurements.length === 0) {
    return (
      <div className="w-full border border-gray-900 p-8 text-center">
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
    <div className="w-full border border-gray-900 overflow-x-auto">
      <table className="w-full border-collapse">
        {/* Header Row */}
        <thead>
          <tr className="border-b border-gray-900">
            <th className="border-r border-gray-900 p-3 text-center text-sm font-medium bg-white">
              SIZE
            </th>
            {sizes.map((size) => (
              <th
                key={size}
                className="border-r border-gray-900 last:border-r-0 p-3 text-center text-sm font-medium bg-white"
              >
                {size}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Measurement Rows */}
          {measurementKeysArray.map((key) => (
            <tr key={key} className="border-b border-gray-900 last:border-b-0">
              <td className="border-r border-gray-900 p-3 text-center text-sm bg-white">
                {key}
              </td>
              {sizes.map((size) => {
                const item = measurements.find((m) => m.size === size);
                const value = item ? item[key.toLowerCase()] || '-' : '-';
                return (
                  <td
                    key={size}
                    className="border-r border-gray-900 last:border-r-0 p-3 text-center text-sm bg-white"
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



