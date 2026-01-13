"use client";

import { useEffect, useMemo, useState } from "react";
import Link from 'next/link';
import {
  getProductsByIds,
  latestDropProductIds,
} from './ProductCatalog';
import { supabase } from '@/lib/supabase';
import ProductCard from './ProductCard';

export default function LatestDrop() {
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase (use DB first, fallback to static)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', latestDropProductIds)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching latest drop products:', error);
          setDbProducts([]);
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
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const products = useMemo(() => {
    // If DB products available, map them; otherwise fallback to static catalog
    if (dbProducts?.length) {
      return dbProducts.map((p) => {
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
    }
    // fallback to static
    return getProductsByIds(latestDropProductIds).map((p) => {
      const gallery = Array.isArray(p.gallery) ? p.gallery.filter(Boolean) : [];
      return {
        ...p,
        gallery,
        image: gallery[0] || p.image,
        hoverImage: gallery[1] || p.hoverImage || gallery[0] || p.image,
      };
    });
  }, [dbProducts]);


  return (
    <section 
      className="bg-gray-100 py-8 sm:py-12 md:py-16 relative overflow-hidden"
      style={{
        backgroundImage: `url('/images/men.jpeg')`,        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-0"></div>
      {/* Reduced white overlay for more impact */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-brand mb-4 sm:mb-6 text-lg">WINTER ARC</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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