'use client';

export default function ProductActionButtons({
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onBuyNow,
  disabled = false,
}) {
  return (
    <>
      {/* Combined Add to Cart and Wishlist Button */}
      <div className="flex rounded-lg overflow-hidden mb-4 border border-gray-300">
        {/* Wishlist Button (Left Side) */}
        <button
          type="button"
          onClick={onWishlistToggle}
          disabled={disabled}
          className={`shrink-0 w-16 sm:w-20 py-4 transition-colors flex items-center justify-center rounded-l-lg ${
            disabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isWishlisted
              ? 'bg-[#FFE8D9] text-red-600 hover:bg-[#FFD9C4] cursor-pointer'
              : 'bg-[#FFF5F0] text-red-600 hover:bg-[#FFE8D9] cursor-pointer'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

        {/* Add to Cart Button (Right Side) */}
        <button
          type="button"
          onClick={onAddToCart}
          disabled={disabled}
          className={`flex-1 py-4 text-sm sm:text-base font-semibold tracking-wide transition-colors rounded-r-lg ${
            disabled
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800 cursor-pointer'
          }`}
        >
          ADD TO CART
        </button>
      </div>

      {/* Buy Now Button */}
      <button
        type="button"
        onClick={onBuyNow}
        disabled={disabled}
        className={`w-full py-4 border-2 text-sm sm:text-base font-semibold tracking-wide transition-colors ${
          disabled
            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
            : 'bg-white border-black text-black hover:bg-black hover:text-white cursor-pointer'
        }`}
      >
        BUY NOW
      </button>
    </>
  );
}

