"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from '@/lib/supabase';
import ProductCard from './ProductCard';

export default function MensSection() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  // CRITICAL: Hydration safety check - prevents stale server UI from flashing
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch mens products from Supabase (use DB first, fallback to static)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .contains('tags', ['mens'])
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) {
          console.error('Error fetching mens products:', error);
          setDbProducts([]);
          setError(error?.message || 'Failed to load products');
        } else {
          setDbProducts(data || []);
        }
      } catch (err) {
        console.error('Error fetching mens products:', err);
        setDbProducts([]);
        setError(err?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const mensProducts = useMemo(() => {
    // IMPORTANT: Do NOT fall back to static catalog.
    // Static fallback can show stale prices/UI when Supabase fetch fails.
    return (dbProducts || []).map((p) => {
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
        gallery: images,
        image: images[0],
        hoverImage: images[1] || images[0],
      };
    });
  }, [dbProducts]);


  // CRITICAL: Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  if (loading && mensProducts.length === 0) {
    return (
      <section className="bg-white py-8 sm:py-12 md:py-16 scroll-mt-20 relative overflow-hidden min-h-[600px] sm:min-h-[700px]">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-brand mb-4 sm:mb-6 text-lg">FOR MEN&apos;S</h1>
          {/* Skeleton Loading Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-3/4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && mensProducts.length === 0) {
    return (
      <section className="bg-white py-8 sm:py-12 md:py-16 scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-brand mb-4 sm:mb-6 text-lg">FOR MEN&apos;S</h1>
          <p className="text-white/80 text-sm">
            Products couldn’t be loaded. Please reload.
          </p>
        </div>
      </section>
    );
  }

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
        <h1 className="text-brand mb-4 sm:mb-6 text-lg">FOR MEN&apos;S</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mensProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              aspectRatio="aspect-3/4"
              showHoverImage={true}
            />
          ))}
        </div>

        {/* Discover More Button */}
        {/* <div className="flex justify-center mt-8 sm:mt-12">
          <Link href="/new-in">
            <button className="px-4 sm:px-6 py-2 text-brand border-2 border-brand text-xs sm:text-sm tracking-wider font-medium hover:bg-brand cursor-pointer hover:text-white transition-colors duration-300">
              DISCOVER MORE
            </button>
          </Link>
        </div> */}
      </div>
    </section>
  );
}

