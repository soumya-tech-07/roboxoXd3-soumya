'use client';

import { useState, useRef, useEffect } from 'react';

const CATEGORIES = [
  'VIEW ALL',
  'T-SHIRTS',
  'POLOS',
  'SHIRTS',
  'JACKETS',
  'HOODIES',
  'SWEATSHIRTS',
  'CARGOS',
  'JEANS',
  'SHORTS',
  'PANTS',
  'JERSEY',
];

const SIZES = ['ALL', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
const AVAILABILITY_OPTIONS = ['ALL', 'IN STOCK', 'OUT OF STOCK'];

export default function CategoryAndFilterBar({
  totalProducts = 158,
  onCategoryChange,
  onSortChange,
  onSizeChange,
  onAvailabilityChange,
}) {
  const [activeCategory, setActiveCategory] = useState('VIEW ALL');
  const [sortBy, setSortBy] = useState('FEATURED');
  const [selectedSize, setSelectedSize] = useState('ALL');
  const [selectedAvailability, setSelectedAvailability] = useState('ALL');
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showAvailabilityDropdown, setShowAvailabilityDropdown] = useState(false);
  const sizeDropdownRef = useRef(null);
  const availabilityDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target)) {
        setShowSizeDropdown(false);
      }
      if (availabilityDropdownRef.current && !availabilityDropdownRef.current.contains(event.target)) {
        setShowAvailabilityDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (cat) => {
    setActiveCategory(cat);
    onCategoryChange && onCategoryChange(cat);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange && onSortChange(value);
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setShowSizeDropdown(false);
    onSizeChange && onSizeChange(size === 'ALL' ? null : size);
  };

  const handleAvailabilitySelect = (availability) => {
    setSelectedAvailability(availability);
    setShowAvailabilityDropdown(false);
    onAvailabilityChange && onAvailabilityChange(availability === 'ALL' ? null : availability);
  };

  return (
    <div className="w-full bg-white">
      {/* TOP NAV – CATEGORY OPTIONS */}
      <div className="w-full border-b border-neutral-200 bg-neutral-50/30">
        <div className="mx-auto flex items-center justify-between gap-6 md:gap-8 pt-6 overflow-x-auto scrollbar-hide px-4 sm:px-8 py-4 text-[10px] uppercase tracking-[0.18em]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryClick(cat)}
              className={`whitespace-nowrap cursor-pointer pb-1 px-1 transition-all duration-200 font-medium ${
                activeCategory === cat
                  ? 'border-b border-brand text-brand'
                  : 'border-b border-transparent text-[#777] hover:text-brand hover:border-brand/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* SECOND ROW – NEW IN + FILTERS + SORT */}
      <div className="w-full bg-white">
        <div className="mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 sm:px-8 py-5 text-[10px] uppercase tracking-[0.18em]">
          {/* LEFT SIDE */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10">
            {/* NEW IN label */}
            <span className="text-[10px] font-semibold uppercase text-[#222]">
              NEW IN
            </span>

            {/* FILTERS */}
            <div className="flex items-center gap-5">
              <span className="text-[10px] font-medium uppercase text-[#777]">
                FILTER:
              </span>

              {/* SIZE */}
              <div className="relative" ref={sizeDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowSizeDropdown(!showSizeDropdown);
                    setShowAvailabilityDropdown(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition-all duration-200 text-[10px] uppercase tracking-[0.18em] font-medium ${
                    selectedSize !== 'ALL'
                    ? 'border-brand text-brand bg-brand/10'
                    : 'border-gray-300 text-[#555] hover:border-brand/50 hover:text-brand bg-white'
                  }`}
                >
                  <span>SIZE{selectedSize !== 'ALL' ? `: ${selectedSize}` : ''}</span>
                  <span className={`text-[8px] transition-transform duration-200 ${showSizeDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showSizeDropdown && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 shadow-xl z-50 min-w-[140px] rounded-sm overflow-hidden">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeSelect(size)}
                        className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors duration-150 ${
                          selectedSize === size
                            ? 'bg-brand text-white font-semibold'
                            : 'text-[#555] hover:bg-gray-50 hover:text-brand'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AVAILABILITY */}
              <div className="relative" ref={availabilityDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAvailabilityDropdown(!showAvailabilityDropdown);
                    setShowSizeDropdown(false);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border transition-all duration-200 text-[10px] uppercase tracking-[0.18em] font-medium ${
                    selectedAvailability !== 'ALL'
                    ? 'border-brand text-brand bg-brand/10'
                    : 'border-gray-300 text-[#555] hover:border-brand/50 hover:text-brand bg-white'
                  }`}
                >
                  <span>
                    AVAILABILITY
                    {selectedAvailability !== 'ALL' ? `: ${selectedAvailability.replace(' ', '')}` : ''}
                  </span>
                  <span className={`text-[8px] transition-transform duration-200 ${showAvailabilityDropdown ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {showAvailabilityDropdown && (
                  <div className="absolute top-full left-0 mt-1.5 bg-white border border-gray-200 shadow-xl z-50 min-w-[180px] rounded-sm overflow-hidden">
                    {AVAILABILITY_OPTIONS.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleAvailabilitySelect(option)}
                        className={`w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-[0.18em] transition-colors duration-150 ${
                          selectedAvailability === option
                            ? 'bg-brand text-white font-semibold'
                            : 'text-[#555] hover:bg-gray-50 hover:text-brand'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-6">
            {/* SORT BY */}
            <div className="flex items-center gap-3 relative">
              <span className="text-[10px] font-medium uppercase text-[#777]">
                SORT BY:
              </span>

              {/* Visual select dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-sm px-3 py-1.5 pr-8 text-[10px] uppercase tracking-[0.18em] text-[#222] cursor-pointer focus:outline-none focus:border-brand transition-colors duration-200 hover:border-brand/60"
                >
                  <option value="FEATURED">FEATURED</option>
                  <option value="PRICE_LOW_HIGH">PRICE: LOW TO HIGH</option>
                  <option value="PRICE_HIGH_LOW">PRICE: HIGH TO LOW</option>
                  <option value="NEWEST">NEWEST</option>
                </select>
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px] pointer-events-none text-brand">▼</span>
              </div>
            </div>

            {/* PRODUCT COUNT */}
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#777]">
              {totalProducts} PRODUCTS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}