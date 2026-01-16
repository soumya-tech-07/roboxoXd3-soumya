'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ensurePublicImageUrl } from '@/lib/image-helpers';

/**
 * Reusable Product Card Component
 * 
 * @param {Object} product - Product object with id, name, slug, price, image, hoverImage, gallery
 * @param {string} aspectRatio - Tailwind aspect ratio class (default: 'aspect-3/4')
 * @param {string} textColor - Text color class (default: 'text-gray-900')
 * @param {string} priceColor - Price color class (default: 'text-gray-600')
 * @param {boolean} showHoverImage - Whether to show hover image effect (default: true)
 * @param {boolean} showNewBadge - Whether to show "NEW" badge if product has 'latest-drop' tag (default: false)
 * @param {Function} onRemove - Optional remove handler (for wishlist)
 * @param {string} className - Additional classes for the card container
 * @param {string} imageClassName - Additional classes for the image container
 */
export default function ProductCard({
  product,
  aspectRatio = 'aspect-3/4',
  textColor = 'text-white',
  priceColor = 'text-white',
  showHoverImage = true,
  showNewBadge = false,
  onRemove,
  className = '',
  imageClassName = '',
}) {
  const [hovered, setHovered] = useState(false);

  // Get primary and hover images from product
  const getPrimaryImage = () => {
    if (product?.gallery && Array.isArray(product.gallery) && product.gallery.length > 0) {
      return ensurePublicImageUrl(product.gallery[0]);
    }
    return ensurePublicImageUrl(product?.image || product?.image_url);
  };

  const getHoverImage = () => {
    if (product?.gallery && Array.isArray(product.gallery) && product.gallery.length > 1) {
      return ensurePublicImageUrl(product.gallery[1]);
    }
    return ensurePublicImageUrl(product?.hoverImage || product?.hover_image_url || getPrimaryImage());
  };

  const primaryImage = getPrimaryImage();
  const hoverImage = getHoverImage();
  const hasHoverImage = showHoverImage && hoverImage !== primaryImage;

  return (
    <div className={`group relative ${className}`}>
      <Link
        href={`/product/${product.slug || product.id}`}
        className="block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <div className={`relative ${aspectRatio} overflow-hidden bg-white mb-4 ${imageClassName}`}>
          {/* Default Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            unoptimized={primaryImage.startsWith('https://')}
            className={`object-cover transition-opacity duration-500 ${
              hasHoverImage && hovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          {/* Hover Image */}
          {hasHoverImage && (
            <Image
              src={hoverImage}
              alt={`${product.name} - Back`}
              fill
              unoptimized={hoverImage.startsWith('https://')}
              className={`object-cover transition-opacity duration-500 ${
                hovered ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}

          {/* NEW Badge */}
          {showNewBadge && product.tags?.includes('latest-drop') && (
            <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 text-[10px] font-semibold tracking-wider text-black">
              NEW
            </div>
          )}

          {/* Remove Button (for wishlist) */}
          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove(product.id);
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
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <h3 className={`text-sm font-medium tracking-wide uppercase ${textColor}`}>
            {product.name}
          </h3>
          <p className={`text-xs ${priceColor}`}>
            RS. {product.price?.toLocaleString('en-IN')}
          </p>
          {product.category && (
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">
              {product.category}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}

