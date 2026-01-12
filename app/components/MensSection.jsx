'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCT_CATALOG } from './ProductCatalog';

export default function MensSection() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  // Filter products by mens tag
  const mensProducts = PRODUCT_CATALOG.filter((product) => 
    product.tags?.includes('mens')
  ).slice(0, 8);

  return (
    <section 
      id="mens-section" 
      className="bg-white py-8 sm:py-12 md:py-16 scroll-mt-20 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/mens.jpeg')`,        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient overlay for depth and readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40 z-0"></div>
      {/* Reduced white overlay for more visible background */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-brand mb-4 sm:mb-6 text-lg">SHOP MENS</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mensProducts.map((product) => (
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
                <h3 className="text-xs font-medium tracking-wide uppercase">
                  {product.name}
                </h3>
                <p className="text-xs ">RS. {product.price.toLocaleString('en-IN')}</p>
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

