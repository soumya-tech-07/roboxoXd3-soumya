'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCT_CATALOG } from './ProductCatalog';

export default function WomensSection() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  // Filter products by womens tag
  const womensProducts = PRODUCT_CATALOG.filter((product) => 
    product.tags?.includes('womens')
  ).slice(0, 8);

  return (
    <section 
      id="womens-section" 
      className=" py-8 sm:py-12 md:py-16 scroll-mt-20 relative"
      style={{
        backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="textile" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse"%3E%3Ccircle cx="25" cy="25" r="1" fill="%23e5e7eb" opacity="0.4"/%3E%3Ccircle cx="10" cy="10" r="0.5" fill="%23e5e7eb" opacity="0.3"/%3E%3Ccircle cx="40" cy="15" r="0.5" fill="%23e5e7eb" opacity="0.3"/%3E%3Ccircle cx="15" cy="40" r="0.5" fill="%23e5e7eb" opacity="0.3"/%3E%3Ccircle cx="45" cy="45" r="0.5" fill="%23e5e7eb" opacity="0.3"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23textile)"/%3E%3C/svg%3E')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-brand mb-4 sm:mb-6 text-lg">SHOP WOMENS</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {womensProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-3/4 overflow-hidden bg-white mb-4">
                {/* Default Image */}
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  className={`object-cover transition-opacity duration-500 ${
                    hoveredProduct === product.id ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                
                {/* Hover Image */}
                <Image
                  src={product.hoverImage}
                  alt={`${product.name} - Back`}
                  fill
                  unoptimized
                  className={`object-cover transition-opacity duration-500 ${
                    hoveredProduct === product.id ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h3 className="text-xs font-medium tracking-wide uppercase text-gray-900">
                  {product.name}
                </h3>
                <p className="text-xs text-gray-600">RS. {product.price.toLocaleString('en-IN')}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Discover More Button */}
        <div className="flex justify-center mt-8 sm:mt-12">
          <Link href="/new-in">
            <button className="px-4 sm:px-6 py-2 text-brand border-2 border-brand text-xs sm:text-sm tracking-wider font-medium hover:bg-brand cursor-pointer hover:text-white transition-colors duration-300">
              DISCOVER MORE
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

