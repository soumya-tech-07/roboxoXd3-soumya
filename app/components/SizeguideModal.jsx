"use client";

import { useEffect } from "react";
import Image from "next/image";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90";

export default function SizeGuideModal({
  isOpen,
  onClose,
  productName = "FADED GREY JOGGERS",
  productImage = FALLBACK_IMAGE,
}) {
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm supports-[backdrop-filter]:bg-black/45 px-2 sm:px-4 py-4 sm:py-8 overflow-y-auto">
      {/* Modal */}
      <div className="relative w-full max-w-6xl bg-white/95 text-gray-900 shadow-2xl rounded-lg border border-gray-100 animate-in fade-in zoom-in duration-200 my-auto max-h-[95vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 sm:right-6 sm:top-6 text-gray-500 hover:text-black text-xl sm:text-2xl transition-colors z-10 bg-white/80 backdrop-blur-sm rounded-full w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center"
          aria-label="Close size guide"
        >
          ×
        </button>

        {/* Title */}
        <div className="pt-8 sm:pt-10 pb-4 sm:pb-5 px-4 sm:px-0 text-center border-b border-gray-200 bg-gradient-to-r from-brand/5 to-transparent rounded-t-lg">
          <p className="text-[10px] tracking-[0.4em] text-brand mb-2">
            SIZE GUIDE
          </p>
          <h2 className="text-sm sm:text-base md:text-lg tracking-[0.2em] font-semibold text-gray-900 px-2">
            {productName?.toUpperCase() ?? "SIZE DETAILS"}
          </h2>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="relative h-[280px] sm:h-[340px] md:h-[420px] lg:h-[520px] bg-gradient-to-br from-gray-100 via-white to-gray-100 overflow-hidden rounded-b-none md:rounded-bl-lg md:rounded-br-none">
            <Image
              src={productImage || FALLBACK_IMAGE}
              alt={productName || "Product preview"}
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Size info */}
          <div className="px-4 sm:px-6 py-4 sm:py-6 md:px-8 md:py-8 overflow-y-auto bg-white rounded-b-lg md:rounded-br-lg space-y-4 sm:space-y-6">
            {/* Measurements table title */}
            <p className="text-xs md:text-sm text-center text-gray-600">
              (GARMENTS MEASUREMENTS IN{" "}
              <span className="font-semibold">INCHES</span>)
            </p>

            {/* Table */}
            <div className="w-full overflow-x-auto">
              <div className="min-w-[480px] border border-gray-200 rounded-lg shadow-sm overflow-hidden text-[10px] md:text-xs text-gray-900">
                <div className="flex">
                  <div className="bg-brand text-white font-semibold px-3 py-3 w-20 flex items-center justify-center text-[11px] uppercase">
                    SIZE
                  </div>
                  {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                    <div
                      key={size}
                      className="border-l border-gray-100 px-2 md:px-3 py-3 w-14 md:w-16 text-center font-semibold bg-white"
                    >
                      {size}
                    </div>
                  ))}
                </div>

                <div className="flex border-t border-gray-200">
                  <div className="bg-gray-900 text-white font-semibold px-3 py-3 w-20 flex items-center justify-center uppercase">
                    WAIST
                  </div>
                  {["28 - 30", "30 - 32", "32 - 34", "34 - 36", "36 - 38", "38 - 40"].map(
                    (val, idx) => (
                      <div
                        key={idx}
                        className="border-l border-gray-100 px-2 md:px-3 py-3 w-14 md:w-16 text-center bg-white"
                      >
                        <span className="whitespace-nowrap">{val}</span>
                      </div>
                    )
                  )}
                </div>

                <div className="flex border-t border-gray-200">
                  <div className="bg-gray-900 text-white font-semibold px-3 py-3 w-20 flex items-center justify-center uppercase">
                    LENGTH
                  </div>
                  {["40", "40.5", "41", "41.5", "42", "42.5"].map((val, idx) => (
                    <div
                      key={idx}
                      className="border-l border-gray-100 px-2 md:px-3 py-3 w-14 md:w-16 text-center bg-white"
                    >
                      {val}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tip text */}
            <p className="text-[10px] md:text-xs text-gray-700 bg-brand/5 border border-brand/20 rounded-md py-3 px-4">
              <span className="font-semibold">TIP:</span> If you don&apos;t find
              your exact size, go for the next size.
            </p>

            {/* How to measure */}
            <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
              <div className="flex-1">
                <h3 className="text-sm md:text-base font-semibold tracking-wide mb-4 text-center md:text-left text-gray-900">
                  HOW TO MEASURE:
                </h3>

                <p className="text-[11px] md:text-xs mb-2 text-gray-700">
                  <span className="font-semibold">WAIST:</span> Measure around
                  your natural waistline, where your waistband usually sits
                </p>
                <p className="text-[11px] md:text-xs mb-2 text-gray-700">
                  <span className="font-semibold">LENGTH:</span> Measure from
                  the top of the waistband down to the desired hem length.
                </p>
                <p className="text-[11px] md:text-xs italic text-gray-700">
                  SIMPLE, RIGHT? NOW YOU&apos;RE READY TO OWN YOUR PERFECT FIT!
                </p>
              </div>

              {/* Illustration */}
              <div className="mt-6 md:mt-0 md:w-32 lg:w-40 flex justify-center">
                <div className="relative w-24 h-32 md:w-28 md:h-36">
                  <Image
                    src="https://placehold.co/200x300/ffffff/777777?text=Illustration"
                    alt="Measurement illustration"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}