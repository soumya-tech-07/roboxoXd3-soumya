'use client';

import { useEffect, useState, useMemo } from 'react';
import { createPublicClient } from '@/lib/supabase/public';
import { useBlogNavigation } from './hooks/useBlogNavigation';
import BlogMagazineLayout from './components/BlogMagazineLayout';
import BlogNavigation from './components/BlogNavigation';

/** Maps a row from blog_posts to the shape expected by BlogMagazineLayout and BlogNavigation. */
function mapBlogPostFromDb(row) {
  return {
    id: row.id,
    type: row.type || 'post',
    title: row.title || '',
    heading: row.heading ?? null,
    content: row.content ?? '',
    image: row.image_url ?? '',
    cta: row.cta ?? '',
    sections: Array.isArray(row.sections) ? row.sections : (row.sections ? [row.sections] : []),
    productImages: Array.isArray(row.product_images) ? row.product_images : (row.product_images ? [row.product_images] : []),
  };
}

export default function BlogPage() {
  const [blogPages, setBlogPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {
    currentPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
  } = useBlogNavigation(blogPages.length);

  const currentBlog = useMemo(() => blogPages[currentPage] ?? null, [blogPages, currentPage]);

  useEffect(() => {
    const supabase = createPublicClient();
    async function fetchBlogPosts() {
      try {
        setLoading(true);
        setError(null);
        const { data, error: fetchError } = await supabase
          .from('blog_posts')
          .select('id, type, title, heading, content, image_url, cta, sections, product_images')
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true });

        if (fetchError) {
          setError(fetchError.message);
          setBlogPages([]);
          return;
        }
        setBlogPages((data || []).map(mapBlogPostFromDb));
      } catch (err) {
        setError(err?.message || 'Failed to load blog');
        setBlogPages([]);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen w-full pt-20 sm:pt-28 lg:pt-32 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4" />
          <p className="text-sm text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen w-full pt-20 sm:pt-28 lg:pt-32 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <p className="text-gray-700 mb-4">Unable to load the blog.</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!currentBlog || blogPages.length === 0) {
    return (
      <div className="relative min-h-screen w-full pt-20 sm:pt-28 lg:pt-32 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold text-black mb-2">No posts yet</h1>
          <p className="text-gray-600">Create and publish posts from the admin panel.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full pt-20 sm:pt-28 lg:pt-32">
      <div className="flex justify-center items-start py-8 sm:py-12 lg:py-16 px-4 sm:px-6">
        <div
          className="w-full max-w-7xl bg-[#f5f3f0] shadow-[0_0_20px_rgba(0,0,0,0.1)] mx-auto"
          style={{
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 py-12 sm:py-16 md:py-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-black tracking-tight mb-8 sm:mb-12 md:mb-16 text-black">
              {currentBlog.title}
            </h1>
            <BlogMagazineLayout blog={currentBlog} />
          </div>
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
