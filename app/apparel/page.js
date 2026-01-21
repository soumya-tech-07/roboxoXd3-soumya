'use client';

import { useEffect, useMemo, useState } from 'react';
import NavbarWithCustomGif from '../components/NavbarWithCustomGif';
import FilterBar from '../components/FilterBar';
import ProductGrid from '../components/ProductGrid';
import { createClient } from '@/lib/supabase';
import { ensurePublicImageUrl } from '@/lib/image-helpers';
import { useAuth } from '../context/AuthContext';

const supabase = createClient();

export default function ApparelPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loading: authLoading } = useAuth();

  const [sortBy, setSortBy] = useState('FEATURED');
  const [selectedCategory, setSelectedCategory] = useState('VIEW ALL');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);

  // Load active products from Supabase - WAIT for auth to initialize first
  useEffect(() => {
    // CRITICAL: Don't fetch until auth is initialized to avoid race conditions
    if (authLoading) {
      return;
    }

    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true);

        if (!mounted) return;

        if (error) {
          console.error('Error loading products:', error);
          setAllProducts([]);
          setError(error?.message || 'Failed to load products');
          return;
        }

        const mapped = (data || []).map((p) => {
          const gallery = Array.isArray(p.gallery)
            ? p.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
            : [];
          const mainImages = [p.image_url, p.hover_image_url].filter(Boolean);
          const images = gallery.length ? gallery : mainImages;
          const primary = ensurePublicImageUrl(images[0] || null);
          const hover = ensurePublicImageUrl(images[1] || images[0] || null);

          return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: Number(p.price || 0),
            category: p.category || 'APPAREL',
            size: Array.isArray(p.sizes) && p.sizes.length ? p.sizes : ['S', 'M', 'L', 'XL'],
            availability: p.availability || 'IN STOCK',
            stock: p.stock ?? 0,
            description: p.description || '',
            tags: p.tags || [],
            image: primary,
            hoverImage: hover,
            gallery: images.map((u) => ensurePublicImageUrl(u)),
          };
        });

        setAllProducts(mapped);
      } catch (e) {
        console.error('Error loading products:', e);
        if (mounted) {
          setAllProducts([]);
          setError(e?.message || 'Failed to load products');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [authLoading]);

  // Products with size and availability - assign default values for products missing them
  const productsWithFilters = useMemo(() => {
    return allProducts.map((product) => ({
      ...product,
      size: product.size || ['S', 'M', 'L', 'XL'],
      availability: product.availability || 'IN STOCK',
    }));
  }, [allProducts]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let products = [...productsWithFilters];
    
    // Filter by category
    if (selectedCategory !== 'VIEW ALL') {
      products = products.filter(product => product.category === selectedCategory);
    }
    
    // Filter by size
    if (selectedSize) {
      products = products.filter(product => 
        product.size && product.size.includes(selectedSize)
      );
    }
    
    // Filter by availability
    if (selectedAvailability) {
      products = products.filter(product => 
        product.availability === selectedAvailability
      );
    }
    
    // Sort products
    switch (sortBy) {
      case 'PRICE_LOW_HIGH':
        return products.sort((a, b) => a.price - b.price);
      case 'PRICE_HIGH_LOW':
        return products.sort((a, b) => b.price - a.price);
      case 'NEWEST':
        return products.sort((a, b) => b.id - a.id);
      case 'FEATURED':
      default:
        return products;
    }
  }, [productsWithFilters, sortBy, selectedCategory, selectedSize, selectedAvailability]);

  const handleSortChange = (sortValue) => {
    setSortBy(sortValue);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAvailabilityChange = (availability) => {
    setSelectedAvailability(availability);
  };

  return (
    <>
      <NavbarWithCustomGif />
      <div className="pt-24 pb-12">
        <div className="">
          <FilterBar
            totalProducts={filteredAndSortedProducts.length}
            onSortChange={handleSortChange}
            onCategoryChange={handleCategoryChange}
            onSizeChange={handleSizeChange}
            onAvailabilityChange={handleAvailabilityChange}
          />
          {loading ? (
            <div className="px-4 sm:px-8 py-10 text-center text-sm text-gray-500">
              Loading products…
            </div>
          ) : error ? (
            <div className="px-4 sm:px-8 py-10 text-center text-sm text-gray-500">
              Products couldn’t be loaded. Please reload.
            </div>
          ) : (
          <ProductGrid products={filteredAndSortedProducts} />
          )}
        </div>
      </div>
    </>
  );
}

