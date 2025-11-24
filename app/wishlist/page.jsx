'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlist } from '../context/WishlistContext';
import { PRODUCT_CATALOG } from '../components/ProductCatalog';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  // Get wishlisted products from catalog
  const wishlistedProducts = useMemo(() => {
    return PRODUCT_CATALOG.filter((product) => wishlist.includes(product.id));
  }, [wishlist]);

  return (
    <>
      <div className="min-h-screen bg-white pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              MY WISHLIST
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 tracking-wide">
              {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>

          {/* Wishlist Content */}
          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {wishlistedProducts.map((product) => (
                <div key={product.id} className="group relative">
                  <Link href={`/product/${product.slug}`}>
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] bg-gray-100 mb-4 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Remove from Wishlist Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(product.id);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white z-10"
                        aria-label="Remove from wishlist"
                      >
                        <svg
                          className="w-4 h-4 text-gray-700 hover:text-brand"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <h3 className="text-xs sm:text-sm font-medium tracking-wide text-gray-900 uppercase">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600">
                        ₹ {product.price.toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wide">
                        {product.category}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 sm:py-24">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  YOUR WISHLIST IS EMPTY
                </h2>
                <p className="text-sm text-gray-600 mb-8 tracking-wide">
                  Start adding items you love to your wishlist
                </p>
                <Link
                  href="/new-in"
                  className="inline-block px-6 py-3 bg-brand text-white text-xs sm:text-sm tracking-wider hover:bg-brand/90 transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

