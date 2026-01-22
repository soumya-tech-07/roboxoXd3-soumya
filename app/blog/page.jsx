'use client';

import { blogPages } from './data/blogData';
import { useBlogNavigation } from './hooks/useBlogNavigation';
import BlogMagazineLayout from './components/BlogMagazineLayout';
import BlogNavigation from './components/BlogNavigation';

// ARCHIVED: Newspaper Layout (commented out - code preserved in BlogNewspaperLayout.jsx)
// import BlogNewspaperLayout from './components/BlogNewspaperLayout';

export default function BlogPage() {
  const {
    currentPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
  } = useBlogNavigation(blogPages.length);

  const currentBlog = blogPages[currentPage];

  return (
    <div className="relative min-h-screen w-full pt-20 sm:pt-28 lg:pt-32">
      {/* A4 Paper Container */}
      <div className="flex justify-center items-start py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        {/* A4 Paper Sheet - 210mm x 297mm (A4 dimensions) */}
        <div 
          className="w-full max-w-7xl bg-[#f5f3f0] shadow-[0_0_20px_rgba(0,0,0,0.1)] mx-auto"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          {/* Paper Content */}
          <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 md:py-20">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-8 sm:mb-12 md:mb-16 text-black">
              {currentBlog.title}
            </h1>

            {/* Magazine Layout (Active) */}
            <BlogMagazineLayout blog={currentBlog} />

            {/* ARCHIVED: Newspaper Layout (Commented Out) */}
            {/* 
            <BlogNewspaperLayout blog={currentBlog} />
            
            The original Newspaper layout has been replaced with Magazine layout,
            which is optimized for vertical fashion imagery. The Newspaper layout
            code is preserved in: app/blog/components/BlogNewspaperLayout.jsx
            
            To restore the Newspaper layout:
            1. Uncomment the import at the top: import BlogNewspaperLayout from './components/BlogNewspaperLayout';
            2. Replace <BlogMagazineLayout blog={currentBlog} /> with <BlogNewspaperLayout blog={currentBlog} />
            3. Optionally, add back the layout toggle button for both options
            */}
          </div>

          {/* Bottom Navigation Bar */}
          <BlogNavigation
            currentPage={currentPage}
            totalPages={blogPages.length}
            cta={currentBlog.cta}
            onNext={nextPage}
            onPrev={prevPage}
            canGoNext={canGoNext}
            canGoPrev={canGoPrev}
          />
        </div>
      </div>
    </div>
  );
}

/* 
===========================================
ARCHIVED: LAYOUT TOGGLE FUNCTIONALITY
===========================================
The layout toggle feature (Magazine/Newspaper switcher) has been removed
as Magazine layout is now the default and only active layout.

Original toggle code (commented out for reference):

import { useState } from 'react';

const [layoutMode, setLayoutMode] = useState('magazine');

// Layout Toggle Button JSX:
<div className="flex justify-center py-4 sm:py-6 px-4">
  <div className="inline-flex items-center gap-3 sm:gap-4 bg-white border border-gray-200 rounded-sm px-4 sm:px-6 py-2.5 sm:py-3 shadow-sm">
    <span className="text-xs sm:text-sm font-medium text-gray-600 uppercase tracking-wide">
      Layout:
    </span>
    <button
      onClick={() => setLayoutMode('magazine')}
      className={`px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium uppercase tracking-wide transition-all duration-200 ${
        layoutMode === 'magazine'
          ? 'bg-black text-white'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      Magazine
    </button>
    <button
      onClick={() => setLayoutMode('newspaper')}
      className={`px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium uppercase tracking-wide transition-all duration-200 ${
        layoutMode === 'newspaper'
          ? 'bg-black text-white'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      Newspaper
    </button>
  </div>
</div>

// Conditional rendering:
{layoutMode === 'magazine' ? (
  <BlogMagazineLayout blog={currentBlog} />
) : (
  <BlogNewspaperLayout blog={currentBlog} />
)}

===========================================
*/
