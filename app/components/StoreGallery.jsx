'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function StoreGallery() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const videoRefs = useRef([]);

  const stores = [
    {
      id: 1,
      name: 'MUMBAI STORE',
      address: '123 Fashion Street, Bandra West, Mumbai 400050',
      phone: '+91 22 1234 5678',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=1200&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    },
    {
      id: 2,
      name: 'DELHI STORE',
      address: '456 Connaught Place, New Delhi 110001',
      phone: '+91 11 2345 6789',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=1200&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    },
    {
      id: 3,
      name: 'BANGALORE STORE',
      address: '789 MG Road, Bangalore 560001',
      phone: '+91 80 3456 7890',
      image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&h=1200&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    },
    {
      id: 4,
      name: 'HYDERABAD STORE',
      address: '321 Banjara Hills, Hyderabad 500034',
      phone: '+91 40 4567 8901',
      image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=1200&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
    {
      id: 5,
      name: 'CHENNAI STORE',
      address: '654 T Nagar, Chennai 600017',
      phone: '+91 44 5678 9012',
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=1200&fit=crop',
      video: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    },
  ];

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    if (videoRefs.current[index]) {
      videoRefs.current[index].play();
    }
  };

  const handleMouseLeave = (index) => {
    setHoveredIndex(null);
    if (videoRefs.current[index]) {
      videoRefs.current[index].pause();
      videoRefs.current[index].currentTime = 0;
    }
  };

  return (
    <section className="bg-gray-50 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Scrollable Gallery */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 sm:gap-6 pb-8">
            {stores.map((store, index) => (
              <div
                key={store.id}
                className="relative shrink-0 w-[280px] h-[400px] sm:w-[400px] sm:h-[550px] md:w-[500px] md:h-[700px] group cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave(index)}
              >
                {/* Image */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <Image
                    src={store.image}
                    alt={`Store ${store.id}`}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Video */}
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
                    hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                  loop
                  muted
                  playsInline
                >
                  <source src={store.video} type="video/mp4" />
                </video>

                {/* Hover Text Overlay - Centered */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center p-6 transition-all duration-500 ease-in-out ${
                    hoveredIndex === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="text-center">
                    <h3 className="text-white text-xs font-semibold tracking-wide drop-shadow-lg mb-2">
                      {store.name}
                    </h3>
                    <p className="text-white text-[10px] tracking-wide drop-shadow-lg mb-1">
                      {store.address}
                    </p>
                    <p className="text-white text-[10px] tracking-wide drop-shadow-lg">
                      {store.phone}
                    </p>
                  </div>
                </div>

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-8 sm:mt-12 max-w-3xl">
          <p className="text-[10px] sm:text-xs tracking-wide text-brand mb-4">
            FEEL THE LUXURY OF PREMIUM STREETWEAR WITH RETRO LOUVE - BEST UNISEX CLOTHING BRAND IN INDIA
          </p>
          <button className="text-[10px] sm:text-xs tracking-wide text-brand hover:text-brand/70 transition-colors underline underline-offset-4">
            READ MORE...
          </button>
        </div>
      </div>
    </section>
  );
}