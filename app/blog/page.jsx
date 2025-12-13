'use client';

import { blogPages } from './data/blogData';
import { useBlogNavigation } from './hooks/useBlogNavigation';
import BlogNewspaperLayout from './components/BlogNewspaperLayout';
import BlogNavigation from './components/BlogNavigation';

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
          <div className="px-8 sm:px-12 md:px-16 lg:px-20 py-12 sm:py-16 md:py-20">
          {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-8 sm:mb-12 md:mb-16 text-black">
            {currentBlog.title}
          </h1>

            {/* Newspaper-style Layout */}
            <BlogNewspaperLayout blog={currentBlog} />
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
