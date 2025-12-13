'use client';

export default function BlogNavigation({
  currentPage,
  totalPages,
  cta,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
}) {
  return (
    <div className="mt-16 sm:mt-20 max-w-7xl mx-auto bg-[#f5f3f0] border-t border-gray-300 px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-6 sm:py-8">
      <div className="flex items-center justify-between gap-6">
        {/* Left: CTA Button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-3 sm:gap-4 group disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:scale-110 transition-all duration-300 shrink-0">
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black group-hover:text-white transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
          <span className="text-sm sm:text-base font-semibold text-black max-w-xs sm:max-w-md lg:max-w-lg">
            {cta}
          </span>
        </button>

        {/* Right: Navigation Controls */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {canGoPrev && (
            <button
              onClick={onPrev}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-black text-black flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          <div className="text-sm sm:text-base font-mono font-semibold text-black px-3 py-1 bg-white rounded border border-gray-300">
            {currentPage + 1} / {totalPages}
          </div>
        </div>
      </div>

      {/* Website URL */}
      <div className="text-xs sm:text-sm font-semibold mt-4 text-gray-700">
        RETROLOUVE.COM
      </div>
    </div>
  );
}

