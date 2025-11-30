'use client';

import { useState, useMemo } from 'react';
import NavbarWithCustomGif from '../components/NavbarWithCustomGif';
import FilterBar from '../components/FilterBar';
import ProductGrid from '../components/ProductGrid';
import { PRODUCT_CATALOG } from '../components/ProductCatalog';

export default function NewInPage() {
  const [allProducts] = useState(PRODUCT_CATALOG);

  const [sortBy, setSortBy] = useState('FEATURED');
  const [selectedCategory, setSelectedCategory] = useState('VIEW ALL');
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedAvailability, setSelectedAvailability] = useState(null);

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
      <div className="pt-24 sm:pt-32 lg:pt-40 pb-12">
        <div className="">
          <FilterBar
            totalProducts={filteredAndSortedProducts.length}
            onSortChange={handleSortChange}
            onCategoryChange={handleCategoryChange}
            onSizeChange={handleSizeChange}
            onAvailabilityChange={handleAvailabilityChange}
          />
          <ProductGrid products={filteredAndSortedProducts} />
        </div>
      </div>
    </>
  );
}

