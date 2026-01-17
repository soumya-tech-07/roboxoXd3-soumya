'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useAuthModal } from '../context/AuthModalContext';
import { supabase } from '@/lib/supabase';
import ProductCard from '../components/ProductCard';

export default function WishlistPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { openLogin } = useAuthModal();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect to home and open login modal if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
      // Small delay to ensure navigation completes, then open login modal
      setTimeout(() => {
        openLogin();
      }, 100);
    }
  }, [isAuthenticated, authLoading, router, openLogin]);

  // Fetch wishlist products from Supabase
  useEffect(() => {
    // Don't fetch if not authenticated
    if (!isAuthenticated || !user) {
      setWishlistProducts([]);
      setLoading(false);
      return;
    }

    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setWishlistProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist)
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching wishlist products:', error);
          // If 401 error, redirect to login
          if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
            router.push('/');
            return;
          }
          setWishlistProducts([]);
        } else {
          // Transform to match ProductCard format
          const transformed = (data || []).map((p) => {
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
              category: p.category,
              gallery: images,
              image: images[0] || 'https://placehold.co/800x1200/e5d4e8/666666?text=Image',
              hoverImage: images[1] || images[0] || 'https://placehold.co/800x1200/e5d4e8/666666?text=Image',
              tags: p.tags,
            };
          });
          setWishlistProducts(transformed);
        }
      } catch (err) {
        console.error('Error fetching wishlist products:', err);
        setWishlistProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, [wishlist, isAuthenticated, user, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
              MY WISHLIST
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 tracking-wide">
              {wishlistProducts.length} {wishlistProducts.length === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>

          {/* Wishlist Content */}
          {loading ? (
            <div className="min-h-[600px] sm:min-h-[700px]">
              {/* Skeleton Loading Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-gray-300 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  aspectRatio="aspect-[3/4]"
                  showHoverImage={false}
                  onRemove={removeFromWishlist}
                  textColor="text-black"
                  priceColor="text-gray-600"
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16 sm:py-24">
              <div className="max-w-md mx-auto">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                  YOUR WISHLIST IS EMPTY
                </h2>
                <p className="text-sm text-gray-600 mb-8 tracking-wide">
                  Start adding items you love to your wishlist
                </p>
                <Link
                  href="/new-in"
                  className="inline-block px-6 py-3 bg-brand text-white text-xs sm:text-sm tracking-wider hover:bg-brand/90 transition-colors"
                >
                  SHOP NOW
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

