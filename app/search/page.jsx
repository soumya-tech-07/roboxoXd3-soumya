"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCT_CATALOG } from "../components/ProductCatalog";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();

  const categories = ["ALL", "T-SHIRTS", "JACKETS", "SHIRTS", "POLOS", "JEANS", "PANTS", "SHORTS", "CARGOS", "JERSEY", "HOODIES", "SWEATSHIRTS"];

  // Filter products based on search query and category
  const filteredProducts = useMemo(() => {
    let products = PRODUCT_CATALOG;

    // Filter by category
    if (selectedCategory !== "ALL") {
      products = products.filter((product) => product.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.tags?.some((tag) => tag.toLowerCase().includes(query)) ||
          product.slug?.toLowerCase().includes(query)
      );
    }

    return products;
  }, [searchQuery, selectedCategory]);

  // Suggested products (show when no search query and ALL category)
  const suggestedProducts = useMemo(() => {
    if (searchQuery.trim() || selectedCategory !== "ALL") return filteredProducts;
    // Show latest drop and core collection products as suggestions when no filter is active
    return PRODUCT_CATALOG.filter(
      (product) =>
        product.tags?.includes("latest-drop") || product.tags?.includes("core-collection")
    ).slice(0, 10);
  }, [searchQuery, selectedCategory, filteredProducts]);

  return (
    <div className="min-h-screen bg-white pt-32 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Category Tabs */}
        <div className="flex items-center space-x-8 mt-5 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`text-xs cursor-pointer tracking-wider transition-colors ${
                selectedCategory === category
                  ? "text-black font-semibold border-b-2 border-black pb-1"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="max-w-md mx-auto mb-20">
          <input
            type="text"
            placeholder="WHAT ARE YOU LOOKING FOR?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-center text-black text-xs tracking-widest border-b border-gray-300 focus:border-black outline-none py-3 placeholder:text-gray-400"
          />
        </div>

        {/* Results Section */}
        <div>
          <h2 className="text-xs tracking-wider text-gray-600 mb-8">
            {searchQuery.trim()
              ? `SEARCH RESULTS (${filteredProducts.length})`
              : selectedCategory !== "ALL"
              ? `${selectedCategory} (${filteredProducts.length})`
              : "YOU MAY BE INTERESTED IN"}
          </h2>

          {/* Product Grid */}
          {(filteredProducts.length > 0 || (!searchQuery.trim() && selectedCategory === "ALL")) ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {((searchQuery.trim() || selectedCategory !== "ALL") ? filteredProducts : suggestedProducts).map((product) => (
                <div key={product.id} className="group">
                  <Link href={`/product/${product.slug}`}>
                    {/* Product Image */}
                    <div className="relative aspect-[3/4] bg-gray-100 mb-3 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      />

                      {/* Quick Add Button */}
                      <button
                        type="button"
                        className="absolute bottom-3 left-3 w-6 h-6 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-gray-100"
                        aria-label="Quick add to cart"
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product.id, null, 1);
                        }}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </button>

                      {/* Wishlist Button */}
                      <button
                        type="button"
                        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm rounded-full p-1.5 hover:bg-white"
                        aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id);
                        }}
                      >
                        <svg
                          className={`w-4 h-4 ${isInWishlist(product.id) ? 'text-brand' : 'text-gray-700 hover:text-black'}`}
                          fill={isInWishlist(product.id) ? 'currentColor' : 'none'}
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
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-1">
                      <h3 className="text-xs tracking-wide text-gray-800 truncate">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-600">
                        ₹ {product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State (when searching/filtering with no results) */
            <div className="text-center mt-16">
              <p className="text-sm text-gray-500 tracking-wide">
                {searchQuery.trim()
                  ? `No results found for "${searchQuery}"`
                  : selectedCategory !== "ALL"
                  ? `No products found in ${selectedCategory}`
                  : "No products found"}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {searchQuery.trim()
                  ? "Try searching with different keywords"
                  : "Try selecting a different category"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}