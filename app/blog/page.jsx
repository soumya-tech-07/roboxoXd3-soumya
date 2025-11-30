'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const blogPosts = [
    {
      id: 1,
      title: "The Art of Sustainable Fashion",
      excerpt: "Discover how we're revolutionizing the fashion industry with sustainable practices and eco-friendly materials that don't compromise on style.",
      date: "January 15, 2025",
      category: "Sustainability",
      image: "/images/new.webp",
      slug: "art-of-sustainable-fashion",
      featured: true
    },
    {
      id: 2,
      title: "Spring Collection 2025: A New Beginning",
      excerpt: "Explore our latest spring collection featuring bold prints, vibrant colors, and contemporary designs that celebrate individuality.",
      date: "January 10, 2025",
      category: "Collections",
      image: "/images/new.webp",
      slug: "spring-collection-2025"
    },
    {
      id: 3,
      title: "Fashion Tips: Styling Your Wardrobe",
      excerpt: "Learn how to mix and match pieces from your wardrobe to create stunning outfits for every occasion with our expert styling guide.",
      date: "January 5, 2025",
      category: "Style Guide",
      image: "/images/new.webp",
      slug: "fashion-tips-styling"
    },
    {
      id: 4,
      title: "Behind the Scenes: Our Design Process",
      excerpt: "Take a look behind the curtain and see how our designers bring concepts to life, from initial sketches to final production.",
      date: "December 28, 2024",
      category: "Design",
      image: "/images/new.webp",
      slug: "behind-scenes-design"
    },
    {
      id: 5,
      title: "Celebrating Individuality Through Fashion",
      excerpt: "How fashion empowers us to express our unique personalities and celebrate our individuality in a world of trends.",
      date: "December 20, 2024",
      category: "Lifestyle",
      image: "/images/new.webp",
      slug: "celebrating-individuality"
    },
    {
      id: 6,
      title: "The Future of Retail: Online Shopping Experience",
      excerpt: "Exploring how technology is transforming the way we shop for fashion online, making it more personal and engaging.",
      date: "December 15, 2024",
      category: "Technology",
      image: "/images/new.webp",
      slug: "future-of-retail"
    }
  ];

  const categories = ['All', 'Sustainability', 'Collections', 'Style Guide', 'Design', 'Lifestyle', 'Technology'];
  const featuredPost = blogPosts.find(post => post.featured);
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts.filter(post => !post.featured)
    : blogPosts.filter(post => post.category === selectedCategory && !post.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Black Background */}
      <div className="bg-black min-h-[50vh] sm:min-h-[60vh] lg:min-h-[80vh] justify-center flex items-center pt-24 sm:pt-32 lg:pt-40 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-wide">
              BLOG
            </h1>
            <p className="text-sm sm:text-base text-gray-300 tracking-wide leading-relaxed">
              Discover the latest trends, fashion tips, and stories from Retro Louve. 
              Stay inspired and informed with our curated content.
            </p>
          </div>
        </div>
      </div>

      {/* Featured Post Section */}
      {featuredPost && (
        <section className="bg-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-6">
              <span className="text-xs tracking-widest text-brand uppercase font-semibold">FEATURED</span>
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="uppercase tracking-wide px-3 py-1 bg-brand/10 text-brand rounded-full">
                      {featuredPost.category}
                    </span>
                    <span>{featuredPost.date}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-wide group-hover:text-brand transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center text-sm text-brand tracking-wide uppercase font-medium group-hover:underline">
                    Read Full Article
                    <svg
                      className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs sm:text-sm tracking-wide font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-brand text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="group cursor-pointer"
                >
                  <Link href={`/blog/${post.slug}`}>
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 mb-5">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="uppercase tracking-wide px-2 py-1 bg-brand/10 text-brand rounded">
                          {post.category}
                        </span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 tracking-wide group-hover:text-brand transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center text-xs text-brand tracking-wide uppercase font-medium pt-2">
                        Read More
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-sm">No posts found in this category.</p>
            </div>
          )}

          {/* Load More Button */}
          {filteredPosts.length > 0 && (
            <div className="flex justify-center mt-12 sm:mt-16">
              <button className="px-8 py-3 text-brand border-2 border-brand text-sm tracking-wider font-medium hover:bg-brand hover:text-white transition-all duration-300">
                LOAD MORE
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
