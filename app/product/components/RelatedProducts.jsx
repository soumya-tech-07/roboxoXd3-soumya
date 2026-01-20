'use client';

import { useMemo, useRef, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import ProductCard from '../../components/ProductCard';
import { useAuth } from '../../context/AuthContext';

const supabase = createClient();

export default function RelatedProducts({ currentProductId, category }) {
  const scrollContainerRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: authLoading } = useAuth();

  // Fetch all products from Supabase - WAIT for auth to initialize first
  useEffect(() => {
    // CRITICAL: Don't fetch until auth is initialized to avoid race conditions
    if (authLoading) {
      return;
    }

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching products:', error);
          setDbProducts([]);
          setError(error?.message || 'Failed to load products');
        } else {
          setDbProducts(data || []);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setDbProducts([]);
        setError(err?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authLoading]);

  // Get all products, excluding current product if provided
  const allProducts = useMemo(() => {
    // IMPORTANT: No static fallback (can show stale prices).
    const products = (dbProducts || []).map((p) => {
      const gallery = Array.isArray(p.gallery)
        ? p.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
        : [];
      const mainImages = [p.image_url, p.hover_image_url].filter(Boolean);
      const images = gallery.length ? gallery : mainImages;
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price || 0),
        category: p.category || 'APPAREL',
        tags: p.tags,
        gallery: images,
        image: images[0],
        hoverImage: images[1] || images[0],
      };
    });

    // Exclude current product if provided
    if (currentProductId) {
      return products.filter((product) => product.id !== currentProductId);
    }
    
    return products;
  }, [currentProductId, dbProducts]);

  if (loading) {
    return null;
  }

  if (error || allProducts.length === 0) {
    return null;
  }

  // Scroll functions
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth',
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth',
      });
    }
  };

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (scrollContainerRef.current) {
      if (distance > minSwipeDistance) {
        // Swipe left - scroll right
        scrollRight();
      } else if (distance < -minSwipeDistance) {
        // Swipe right - scroll left
        scrollLeft();
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section className="mt-16 sm:mt-20 lg:mt-24 border-t border-gray-200 pt-12 sm:pt-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6 sm:mb-8 tracking-wide">
          ALL PRODUCTS
        </h2>

        {/* Scrollable Container with Arrows */}
        <div className="relative">
          {/* Left Arrow - Desktop Only */}
          <button
            onClick={scrollLeft}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 hover:border-black transition-all duration-300 rounded-full shadow-lg cursor-pointer"
            aria-label="Scroll left"
            type="button"
          >
            <svg
              className="w-5 h-5 text-black pointer-events-none"
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

          {/* Right Arrow - Desktop Only */}
          <button
            onClick={scrollRight}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white border border-gray-300 hover:border-black transition-all duration-300 rounded-full shadow-lg cursor-pointer"
            aria-label="Scroll right"
            type="button"
          >
            <svg
              className="w-5 h-5 text-black pointer-events-none"
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
          </button>

          {/* Scrollable Products Container */}
          <div
            ref={scrollContainerRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="flex gap-4 sm:gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4 lg:px-12"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {allProducts.map((product) => (
              <div key={product.id} className="shrink-0 w-[180px] sm:w-[220px] lg:w-[240px]">
                <ProductCard
                  product={product}
                  aspectRatio="aspect-3/4"
                  showHoverImage={false}
                  showNewBadge={false}
                  textColor="text-gray-900"
                  priceColor="text-gray-900"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

