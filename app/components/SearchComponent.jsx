"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from '@/lib/supabase';
import { useAuth } from '../context/AuthContext';

const supabase = createClient();

export default function SearchComponent({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [dbProducts, setDbProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const { loading: authLoading } = useAuth();

  // Fetch all active products from Supabase - WAIT for auth to initialize first
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
          .eq('is_active', true);

        if (error) {
          console.error('Error fetching products for search:', error);
          setDbProducts([]);
          setError(error?.message || 'Failed to load products');
        } else {
          setDbProducts(data || []);
        }
      } catch (err) {
        console.error('Error fetching products for search:', err);
        setDbProducts([]);
        setError(err?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authLoading]);

  // Map Supabase products to match ProductCatalog format
  const products = useMemo(() => {
    // IMPORTANT: Do NOT fall back to static catalog (can show stale prices).
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
        category: p.category || 'APPAREL',
        description: p.description || '',
        tags: p.tags || [],
        gallery: images,
        image: images[0] || '',
        hoverImage: images[1] || images[0] || '',
      };
    });
  }, [dbProducts]);

  // Popular search terms with images - extracted from products
  const popularTerms = useMemo(() => {
    const termsWithImages = [];
    const addedTerms = new Set(); // Track added terms to prevent duplicates
    
    // Get categories with representative product images
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    categories.slice(0, 4).forEach(category => {
      if (!addedTerms.has(category.toLowerCase())) {
        const firstProduct = products.find(p => p.category === category && p.image);
        if (firstProduct) {
          termsWithImages.push({
            id: `category-${category}`,
            term: category,
            image: firstProduct.image,
            type: 'category'
          });
          addedTerms.add(category.toLowerCase());
        }
      }
    });
    
    // Get popular product names with their images
    const popularProducts = products
      .filter(p => (p.tags?.includes('latest-drop') || p.tags?.includes('core-collection')) && p.image);
    
    popularProducts.forEach(product => {
      const termLower = product.name.toLowerCase();
      if (!addedTerms.has(termLower)) {
        termsWithImages.push({
          id: `product-${product.id}`,
          term: termLower,
          image: product.image,
          type: 'product'
        });
        addedTerms.add(termLower);
      }
    });
    
    return termsWithImages.slice(0, 8);
  }, [products]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = (product.category || '').toLowerCase().includes(query);
      const descriptionMatch = product.description?.toLowerCase().includes(query);
      const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(query));
      
      return nameMatch || categoryMatch || descriptionMatch || tagMatch;
    });
  }, [searchQuery, products]);

  // Top suggestions based on search - show similar products
  const topSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    const suggestions = new Set();
    
    // Get category suggestions
    filteredProducts.forEach(product => {
      if (product.category) suggestions.add(product.category);
    });
    
    // Get name suggestions (first word matches)
    filteredProducts.slice(0, 3).forEach(product => {
      const firstWord = product.name.split(' ')[0];
      if (firstWord) suggestions.add(firstWord.toLowerCase());
    });
    
    return Array.from(suggestions).slice(0, 4);
  }, [searchQuery, filteredProducts]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle search submission
  const handleSearch = (term) => {
    const searchTerm = typeof term === 'string' ? term : term.term || term;
    if (searchTerm.trim() && !recentSearches.includes(searchTerm.trim())) {
      setRecentSearches([searchTerm.trim(), ...recentSearches]);
    }
    setSearchQuery(searchTerm);
  };

  // Remove recent search
  const removeRecentSearch = (term) => {
    setRecentSearches(recentSearches.filter((item) => item !== term));
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Search Modal - Top Half Only */}
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 h-3/5 bg-white z-50 overflow-y-auto border-b border-gray-200 shadow-lg animate-in slide-in-from-top-4 fade-in duration-500 ease-out">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="max-w-[1920px] mx-auto px-6 py-3 flex items-center justify-center relative">
              {/* Logo - Left Side */}
              <Link href="/" className="absolute left-6 shrink-0 animate-in fade-in slide-in-from-left-4 duration-500 delay-100" onClick={onClose}>
                <div className="relative h-16 sm:h-20 w-auto transition-transform duration-300 hover:scale-105">
                  <Image
                    src="/images/retro.png"
                    alt="Retro Louve"
                    width={150}
                    height={40}
                    className="h-full w-auto object-contain"
                    priority
                  />
                </div>
              </Link>

              {/* Search Input - Centered */}
              <div className="w-full max-w-2xl relative animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch(searchQuery);
                      }
                    }}
                    placeholder="Search"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 border border-transparent focus:border-brand/20 transition-all duration-300 focus:scale-[1.02] focus:shadow-md"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer transition-all duration-300 hover:scale-110 animate-in fade-in zoom-in duration-200"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>

              {/* Cancel Button - Right Side */}
              <button
                onClick={onClose}
                className="absolute right-6 text-xs font-medium text-brand hover:text-brand/70 transition-all duration-300 cursor-pointer tracking-wider uppercase animate-in fade-in slide-in-from-right-4 duration-500 delay-100 hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-[1920px] mx-auto px-6 py-4">
            {error && (
              <div className="mb-4 text-center">
                <p className="text-xs text-red-600">
                  Search products couldn’t be loaded. Please reload.
                </p>
              </div>
            )}
            {!searchQuery ? (
              // Initial State - Popular & Recent Searches - Centered
              <div className="max-w-4xl mx-auto animate-in fade-in duration-500 delay-300">
                {/* Popular Search Terms */}
                <div className="mb-6">
                  <h3 className="text-gray-500 text-[10px] tracking-wider mb-3 uppercase text-center animate-in fade-in slide-in-from-bottom-2 duration-500 delay-400">
                    Popular Search Terms
                  </h3>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {popularTerms.map((item, index) => (
                      <button
                        key={item.id || `term-${index}`}
                        onClick={() => handleSearch(item.term)}
                        className="flex flex-col text-black items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-brand hover:text-white rounded-lg text-xs transition-all duration-300 cursor-pointer tracking-wide group animate-in fade-in slide-in-from-bottom-4 zoom-in-95 duration-500"
                        style={{
                          animationDelay: `${400 + index * 50}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        {/* Thumbnail Image */}
                        <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300 group-hover:border-white transition-all duration-300 group-hover:shadow-lg group-hover:shadow-brand/20">
                          <Image
                            src={item.image}
                            alt={item.term}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="64px"
                          />
                        </div>
                        {/* Term Text */}
                        <span className="text-center max-w-[100px] line-clamp-2 transition-all duration-300 group-hover:scale-105">
                          {item.term}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-700">
                    <h3 className="text-gray-500 text-[10px] tracking-wider mb-3 uppercase text-center">
                      Recent searches
                    </h3>
                    <div className="space-y-2 max-w-3xl mx-auto">
                      {recentSearches.map((term, index) => {
                        // Find product image for recent search term
                        const matchingProduct = products.find(
                          p => 
                            p.name.toLowerCase() === term.toLowerCase() ||
                            p.category.toLowerCase() === term.toLowerCase() ||
                            p.name.toLowerCase().includes(term.toLowerCase())
                        );
                        const searchImage = matchingProduct?.image || null;
                        
                        return (
                          <div
                            key={term}
                            className="flex items-center justify-between py-2 px-3 border-b border-gray-200 hover:bg-gray-50 rounded transition-all duration-300 animate-in fade-in slide-in-from-left-4 hover:shadow-sm"
                            style={{
                              animationDelay: `${700 + index * 100}ms`,
                              animationFillMode: 'both'
                            }}
                          >
                            <button
                              onClick={() => handleSearch(term)}
                              className="flex items-center gap-3 flex-1 text-left group"
                            >
                              {searchImage && (
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                                  <Image
                                    src={searchImage}
                                    alt={term}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                    sizes="40px"
                                  />
                                </div>
                              )}
                              <span className="text-sm text-gray-900 hover:text-brand transition-all duration-300 cursor-pointer tracking-wide group-hover:translate-x-1">
                                {term}
                              </span>
                            </button>
                            <button
                              onClick={() => removeRecentSearch(term)}
                              className="text-gray-400 hover:text-brand transition-all duration-300 cursor-pointer ml-2 hover:scale-110 hover:rotate-90"
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Search Results State
              <div className="flex gap-6 animate-in fade-in duration-500">
                {/* Left Sidebar - Suggestions */}
                <div className="w-56 shrink-0 animate-in fade-in slide-in-from-left-4 duration-500 delay-200">
                  <h3 className="text-gray-500 text-[10px] tracking-wider mb-3 uppercase">
                    Top Suggestions
                  </h3>
                  <div className="space-y-2">
                    {topSuggestions.map((suggestion, index) => {
                      // Find product image for suggestion
                      const matchingProduct = products.find(
                        p => 
                          p.category.toLowerCase() === suggestion.toLowerCase() ||
                          p.name.toLowerCase().includes(suggestion.toLowerCase())
                      );
                      const suggestionImage = matchingProduct?.image || null;
                      
                      return (
                        <button
                          key={suggestion}
                          onClick={() => handleSearch(suggestion)}
                          className="flex items-center gap-2 w-full text-left text-sm text-gray-900 hover:text-brand transition-all duration-300 py-2 px-2 rounded hover:bg-gray-50 cursor-pointer tracking-wide group animate-in fade-in slide-in-from-left-2"
                          style={{
                            animationDelay: `${200 + index * 50}ms`,
                            animationFillMode: 'both'
                          }}
                        >
                          {suggestionImage && (
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-gray-300 shrink-0 group-hover:border-brand transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm">
                              <Image
                                src={suggestionImage}
                                alt={suggestion}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                sizes="32px"
                              />
                            </div>
                          )}
                          <span className="line-clamp-1 transition-all duration-300 group-hover:translate-x-1">{suggestion}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side - Product Grid */}
                <div className="flex-1 animate-in fade-in slide-in-from-right-4 duration-500 delay-300">
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <p className="text-gray-500 text-sm">Loading products...</p>
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                      {filteredProducts.map((product, index) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="group animate-in fade-in slide-in-from-bottom-2 zoom-in-95"
                          onClick={onClose}
                          style={{
                            animationDelay: `${300 + index * 30}ms`,
                            animationFillMode: 'both'
                          }}
                        >
                          <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden relative transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gray-200">
                            {product.image ? (
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="transition-all duration-300 group-hover:translate-y-[-2px]">
                            <h4 className="font-medium text-sm text-gray-900 mb-1 group-hover:text-brand transition-colors duration-300 tracking-wide line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-gray-600 text-[10px] mb-1.5 tracking-wide uppercase transition-colors duration-300 group-hover:text-gray-800">
                              {product.category}
                            </p>
                            <p className="font-medium text-sm text-brand transition-all duration-300 group-hover:scale-105">
                              MRP : ₹ {product.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8 animate-in fade-in zoom-in duration-500">
                      <p className="text-gray-500 text-sm">
                        No products found matching &quot;{searchQuery}&quot;
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
