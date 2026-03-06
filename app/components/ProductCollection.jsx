"use client";

import { useEffect, useMemo, useState } from "react";
import {
  coreCollectionProductIds,
} from './productIds';
import { createPublicClient } from '@/lib/supabase/public';
import ProductCard from './ProductCard';

export default function ProductCollection() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const supabase = createPublicClient();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', coreCollectionProductIds)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching core collection products:', error);
          setDbProducts([]);
          setError(error?.message || 'Failed to load products');
        } else {
          // Preserve order of coreCollectionProductIds
          const ordered = coreCollectionProductIds
            .map((id) => data.find((p) => p.id === id))
            .filter(Boolean);
          setDbProducts(ordered);
        }
      } catch (err) {
        console.error('Error fetching core collection products:', err);
        setDbProducts([]);
        setError(err?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
      <section className="py-8 sm:py-12 md:py-16 relative">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-brand mb-4 sm:mb-6 text-lg">MORE FROM RETRO LOUVE</h1>
          <p className="text-white/80 text-sm">Loading products…</p>
        </div>
      </section>
    );
  }

  if (error && products.length === 0) {
    return (
      <section className="py-8 sm:py-12 md:py-16 relative">
        <div className="absolute inset-0 bg-black/40 z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-brand mb-4 sm:mb-6 text-lg">MORE FROM RETRO LOUVE</h1>
          <p className="text-white/80 text-sm">
            Products couldn’t be loaded. Please reload.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      className=" py-8 sm:py-12 md:py-16 relative"
      style={{
        backgroundImage: `url('data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="lines" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"%3E%3Cline x1="0" y1="0" x2="40" y2="40" stroke="%23d1d5db" stroke-width="0.5" opacity="0.25"/%3E%3Cline x1="40" y1="0" x2="0" y2="40" stroke="%23d1d5db" stroke-width="0.5" opacity="0.25"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23lines)"/%3E%3C/svg%3E')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-brand mb-4 sm:mb-6 text-lg">MORE FROM RETRO LOUVE</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
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
