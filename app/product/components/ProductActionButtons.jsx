'use client';

export default function ProductActionButtons({
  isWishlisted,
  onWishlistToggle,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <>
      {/* Combined Add to Cart and Wishlist Button */}
      <div className="flex rounded-lg overflow-hidden mb-4 border border-gray-300">
        {/* Wishlist Button (Left Side) */}
        <button
          type="button"
          onClick={onWishlistToggle}
          className={`shrink-0 w-16 sm:w-20 py-4 transition-colors flex items-center justify-center cursor-pointer rounded-l-lg ${
            isWishlisted
              ? 'bg-[#FFE8D9] text-red-600 hover:bg-[#FFD9C4]'
              : 'bg-[#FFF5F0] text-red-600 hover:bg-[#FFE8D9]'
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
          className="flex-1 py-4 bg-black text-white text-sm sm:text-base font-semibold tracking-wide hover:bg-gray-800 transition-colors cursor-pointer rounded-r-lg"
        >
          ADD TO CART
        </button>
      </div>

      {/* Buy Now Button */}
      <button
        type="button"
        onClick={onBuyNow}
        className="w-full py-4 bg-white border-2 border-black text-black text-sm sm:text-base font-semibold tracking-wide hover:bg-black hover:text-white transition-colors cursor-pointer"
      >
        BUY NOW
      </button>
    </>
  );
}

