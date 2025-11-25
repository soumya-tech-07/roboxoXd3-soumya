"use client";

import Image from "next/image";
import Link from "next/link";

export default function SplitHeroSection() {
  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Left Side - Men's Section */}
      <Link
        href="/new-in"
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden cursor-pointer"
      >
        {/* Background Image */}
        <Image
          src="/images/men.png"
          alt="Shop Mens"
          fill
          className="object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider mb-4 md:mb-6">
            SHOP MENS
          </h2>
          <div className="px-6 md:px-8 py-2 md:py-3 border-2 border-white text-white text-xs md:text-sm tracking-wider font-medium hover:bg-white hover:text-brand transition-all duration-300">
            EXPLORE
          </div>
        </div>
      </Link>

      {/* Right Side - Women's Section */}
      <Link
        href="/new-in"
        className="relative w-full md:w-1/2 h-1/2 md:h-full group overflow-hidden cursor-pointer"
      >
        {/* Background Image */}
        <Image
          src="/images/women.png"
          alt="Shop Womens"
          fill
          className="object-cover scale-105 transition-transform duration-700 group-hover:scale-110"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 md:pb-16 lg:pb-20">
          <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider mb-4 md:mb-6">
            SHOP WOMENS
          </h2>
          <div className="px-6 md:px-8 py-2 md:py-3 border-2 border-white text-white text-xs md:text-sm tracking-wider font-medium hover:bg-white hover:text-brand transition-all duration-300">
            EXPLORE
          </div>
        </div>
      </Link>
    </div>
  );
}