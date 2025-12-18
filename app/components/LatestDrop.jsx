'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  getProductsByIds,
  latestDropProductIds,
} from './ProductCatalog';

export default function LatestDrop() {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const products = getProductsByIds(latestDropProductIds);

  return (
    <section 
      className="bg-gray-100 py-8 sm:py-12 md:py-16 relative overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea8f6b96?w=1920&h=1080&fit=crop&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-0"></div>
      {/* Reduced white overlay for more impact */}
      <div className="absolute inset-0 bg-white/50 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-brand mb-4 sm:mb-6 text-lg">LATEST DROP</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group"
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image Container */}
              <div className="relative aspect-4/5 overflow-hidden bg-white mb-4">
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