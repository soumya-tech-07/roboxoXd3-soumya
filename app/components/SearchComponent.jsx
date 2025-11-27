"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCT_CATALOG } from "./ProductCatalog";

export default function SearchComponent({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);

  // Popular search terms - extracted from product catalog
  const popularTerms = useMemo(() => {
    const categories = [...new Set(PRODUCT_CATALOG.map(p => p.category))];
    const popularNames = PRODUCT_CATALOG
      .filter(p => p.tags?.includes('latest-drop') || p.tags?.includes('core-collection'))
      .slice(0, 5)
      .map(p => p.name.toLowerCase());
    return [...categories.slice(0, 4), ...popularNames].slice(0, 8);
  }, []);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase().trim();
    return PRODUCT_CATALOG.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const categoryMatch = product.category.toLowerCase().includes(query);
      const descriptionMatch = product.description?.toLowerCase().includes(query);
      const tagMatch = product.tags?.some(tag => tag.toLowerCase().includes(query));
      
      return nameMatch || categoryMatch || descriptionMatch || tagMatch;
    });
  }, [searchQuery]);

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
    if (term.trim() && !recentSearches.includes(term.trim())) {
      setRecentSearches([term.trim(), ...recentSearches]);
    }
    setSearchQuery(term);
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
          className="fixed inset-0 bg-black/20 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Search Modal - Top Half Only */}
      {isOpen && (
        <div className="fixed top-0 left-0 right-0 h-3/5 bg-white z-50 overflow-y-auto border-b border-gray-200 shadow-lg">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
            <div className="max-w-[1920px] mx-auto px-6 py-3 flex items-center justify-center relative">
              {/* Logo - Left Side */}
              <Link href="/" className="absolute left-6 shrink-0" onClick={onClose}>
                <div className="relative h-16 sm:h-20 w-auto">
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
              <div className="w-full max-w-2xl relative">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
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
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-100 rounded-full text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/30 border border-transparent focus:border-brand/20 transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
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
                className="absolute right-6 text-xs font-medium text-brand hover:text-brand/70 transition-colors cursor-pointer tracking-wider uppercase"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-[1920px] mx-auto px-6 py-4">
            {!searchQuery ? (
              // Initial State - Popular & Recent Searches - Centered
              <div className="max-w-4xl mx-auto">
                {/* Popular Search Terms */}
                <div className="mb-6">
                  <h3 className="text-gray-500 text-[10px] tracking-wider mb-3 uppercase text-center">
                    Popular Search Terms
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularTerms.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearch(term)}
                        className="px-4 py-2 bg-gray-100 text-gray-900 hover:bg-brand hover:text-white rounded-full text-xs transition-all duration-300 cursor-pointer tracking-wide"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-gray-500 text-[10px] tracking-wider mb-3 uppercase text-center">
                      Recent searches
                    </h3>
                    <div className="space-y-1 max-w-3xl mx-auto">
                      {recentSearches.map((term) => (
                        <div
                          key={term}
                          className="flex items-center justify-between py-2 border-b border-gray-200"
                        >
                          <button
                            onClick={() => handleSearch(term)}
                            className="text-sm text-gray-900 hover:text-brand transition-colors cursor-pointer tracking-wide"
                          >
                            {term}
                          </button>
                          <button
                            onClick={() => removeRecentSearch(term)}
                            className="text-gray-400 hover:text-brand transition-colors cursor-pointer"
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
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Search Results State
              <div className="flex gap-6">
                {/* Left Sidebar - Suggestions */}
                <div className="w-56 shrink-0">
                  <h3 className="text-gray-500 text-[10px] tracking-wider mb-3 uppercase">
                    Top Suggestions
                  </h3>
                  <div className="space-y-1.5">
                    {topSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => handleSearch(suggestion)}
                        className="block text-left text-sm text-gray-900 hover:text-brand transition-colors py-1 cursor-pointer tracking-wide"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Side - Product Grid */}
                <div className="flex-1">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          className="group"
                          onClick={onClose}
                        >
                          <div className="aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden relative">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm text-gray-900 mb-1 group-hover:text-brand transition-colors tracking-wide line-clamp-2">
                              {product.name}
                            </h4>
                            <p className="text-gray-600 text-[10px] mb-1.5 tracking-wide uppercase">
                              {product.category}
                            </p>
                            <p className="font-medium text-sm text-brand">
                              MRP : ₹ {product.price.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-8">
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