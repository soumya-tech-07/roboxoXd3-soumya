"use client";

import { useEffect, useState } from "react";

export default function SizeGuideModal({
  isOpen,
  onClose,
  productName = "FADED GREY JOGGERS",
}) {
  const [showCustomizeForm, setShowCustomizeForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    favouriteSection: "Woman",
    height: "",
    heightUnit: "CM",
    weight: "",
    weightUnit: "KG",
    age: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage or send to API
    localStorage.setItem("userSizePreferences", JSON.stringify(formData));
    console.log("Size preferences saved:", formData);
    alert("Your size preferences have been saved!");
    setShowCustomizeForm(false);
    onClose();
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
            <div className="pt-8 pb-4 px-4 sm:px-6 text-center border-b border-gray-200 bg-gradient-to-b from-brand/5 via-brand/3 to-transparent">
              <p className="text-[10px] tracking-[0.4em] text-brand mb-2 font-medium">
                SIZE GUIDE
              </p>
              <h2 className="text-sm sm:text-base tracking-[0.15em] font-semibold text-gray-900 px-2">
                {productName?.toUpperCase() ?? "SIZE DETAILS"}
              </h2>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 space-y-4">
              {/* Measurements table title */}
              <p className="text-[10px] md:text-xs text-center text-gray-600 font-medium">
                (GARMENTS MEASUREMENTS IN{" "}
                <span className="font-semibold text-brand">INCHES</span>)
              </p>

              {/* Table */}
              <div className="w-full overflow-x-auto">
                <div className="w-full border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden text-xs md:text-sm text-gray-900">
                  {/* Header Row */}
                  <div className="flex">
                    <div className="bg-brand text-white font-bold px-4 md:px-6 py-4 md:py-5 min-w-[100px] md:min-w-[120px] flex items-center justify-center text-xs md:text-sm uppercase tracking-wide">
                      SIZE
                    </div>
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <div
                        key={size}
                        className="flex-1 border-l border-gray-200 px-3 md:px-4 py-4 md:py-5 text-center font-bold bg-gray-50 text-gray-900 min-w-[70px]"
                      >
                        {size}
                      </div>
                    ))}
                  </div>

                  {/* Waist Row */}
                  <div className="flex border-t-2 border-gray-200">
                    <div className="bg-gray-800 text-white font-bold px-4 md:px-6 py-4 md:py-5 min-w-[100px] md:min-w-[120px] flex items-center justify-center text-xs md:text-sm uppercase tracking-wide">
                      WAIST
                    </div>
                    {[
                      "28 - 30",
                      "30 - 32",
                      "32 - 34",
                      "34 - 36",
                      "36 - 38",
                      "38 - 40",
                    ].map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 border-l border-gray-200 px-3 md:px-4 py-4 md:py-5 text-center bg-white hover:bg-gray-50 transition-colors min-w-[70px]"
                      >
                        <span className="font-medium text-xs md:text-sm">{val}</span>
                      </div>
                    ))}
                  </div>

                  {/* Length Row */}
                  <div className="flex border-t-2 border-gray-200">
                    <div className="bg-gray-800 text-white font-bold px-4 md:px-6 py-4 md:py-5 min-w-[100px] md:min-w-[120px] flex items-center justify-center text-xs md:text-sm uppercase tracking-wide">
                      LENGTH
                    </div>
                    {["40", "40.5", "41", "41.5", "42", "42.5"].map(
                      (val, idx) => (
                        <div
                          key={idx}
                          className="flex-1 border-l border-gray-200 px-3 md:px-4 py-4 md:py-5 text-center bg-white hover:bg-gray-50 transition-colors min-w-[70px]"
                        >
                          <span className="font-medium text-xs md:text-sm">{val}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Tip text */}
              <div className="bg-gradient-to-r from-brand/10 via-brand/5 to-brand/10 border-l-4 border-brand rounded-lg py-2.5 px-4 shadow-sm">
                <p className="text-[10px] md:text-xs text-gray-800">
                  <span className="font-bold text-brand">TIP:</span> If you don&apos;t
                  find your exact size, go for the next size.
                </p>
              </div>

              {/* How to measure */}
              <div className="space-y-3">
                <h3 className="text-xs md:text-sm font-bold tracking-wide text-gray-900 uppercase text-center">
                  HOW TO MEASURE:
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Lower Body - Waist */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] md:text-xs font-bold text-brand mb-0.5">
                          LOWER BODY - WAIST
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-700">
                          Measure around your natural waistline, where your waistband usually sits
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lower Body - Length */}
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-brand/10 rounded-lg">
                        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] md:text-xs font-bold text-brand mb-0.5">
                          LOWER BODY - LENGTH
                        </p>
                        <p className="text-[10px] md:text-xs text-gray-700">
                          Measure from the top of the waistband down to the desired hem length
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customize Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCustomizeForm(true)}
                  className="bg-brand text-white px-6 py-2.5 rounded-lg hover:bg-brand/90 active:scale-95 transition-all text-xs font-semibold tracking-wide shadow-md hover:shadow-lg cursor-pointer"
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
                  className="flex-1 bg-brand text-white px-6 py-3.5 rounded-lg hover:bg-brand/90 active:scale-95 transition-all text-sm font-semibold tracking-wide shadow-md hover:shadow-lg cursor-pointer"
                >
                  SAVE PREFERENCES
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}