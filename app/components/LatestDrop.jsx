"use client";

import { useEffect, useMemo, useState } from "react";
import {
  latestDropProductIds,
} from './productIds';
import { createClient } from '@/lib/supabase';
import ProductCard from './ProductCard';
import { useAuth } from '../context/AuthContext';

const supabase = createClient();

export default function LatestDrop() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);
  const { loading: authLoading } = useAuth();

  // CRITICAL: Hydration safety check - prevents stale server UI from flashing
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch products from Supabase - WAIT for auth to initialize first
  useEffect(() => {
    // CRITICAL: Don't fetch until auth is initialized to avoid race conditions
    if (authLoading) {
      console.log('LatestDrop: Waiting for auth...');
      return;
    }

    const fetchProducts = async () => {
      console.log('LatestDrop: Starting fetch...');
      try {
        setLoading(true);
        setError(null);
        console.log('LatestDrop: Querying IDs:', latestDropProductIds);

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', latestDropProductIds)
          .eq('is_active', true);

        console.log('LatestDrop: Supabase response:', { dataLength: data?.length, error });

        if (error) {
          console.error('Error fetching latest drop products:', error);
          setDbProducts([]);
          setError(error?.message || 'Failed to load products');
        } else {
          // Preserve order of latestDropProductIds
          const ordered = latestDropProductIds
            .map((id) => data.find((p) => p.id === id))
            .filter(Boolean);
          setDbProducts(ordered);
        }
      } catch (err) {
        console.error('Error fetching latest drop products:', err);
        setDbProducts([]);
        setError(err?.message || 'Failed to load products');
      } finally {
        console.log('LatestDrop: Finished loading');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authLoading]);

  const products = useMemo(() => {
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

  if (loading && products.length === 0) {
    return (
      <section className="bg-gray-100 py-8 sm:py-12 md:py-16 relative overflow-hidden min-h-[600px] sm:min-h-[700px]">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-brand mb-4 sm:mb-6 text-lg sm:text-xl" style={{ fontFamily: 'Gliker, sans-serif' }}>THE WINTER ARC DROP</h1>
          {/* Skeleton Loading Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-4/5 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="bg-gray-100 py-8 sm:py-12 md:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-brand mb-4 sm:mb-6 text-lg sm:text-xl" style={{ fontFamily: 'Gliker, sans-serif' }}>THE WINTER ARC DROP</h1>
          <p className="text-white/80 text-sm">
            Products couldn’t be loaded. Please reload.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="winter-arc-section"
      className="bg-gray-100 py-8 sm:py-12 md:py-16 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/men.jpeg')`, backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-0"></div>
      {/* Reduced white overlay for more impact */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-brand mb-4 sm:mb-6 text-lg sm:text-xl" style={{ fontFamily: 'Gliker, sans-serif' }}>THE WINTER ARC DROP</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              aspectRatio="aspect-4/5"
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
// push to github and deploy to vercel