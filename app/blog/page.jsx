'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Art of Sustainable Fashion",
      excerpt: "Discover how we're revolutionizing the fashion industry with sustainable practices and eco-friendly materials.",
      date: "January 15, 2025",
      category: "Sustainability",
      image: "/images/new.webp",
      slug: "art-of-sustainable-fashion"
    },
    {
      id: 2,
      title: "Spring Collection 2025: A New Beginning",
      excerpt: "Explore our latest spring collection featuring bold prints, vibrant colors, and contemporary designs.",
      date: "January 10, 2025",
      category: "Collections",
      image: "/images/new.webp",
      slug: "spring-collection-2025"
    },
    {
      id: 3,
      title: "Fashion Tips: Styling Your Wardrobe",
      excerpt: "Learn how to mix and match pieces from your wardrobe to create stunning outfits for every occasion.",
      date: "January 5, 2025",
      category: "Style Guide",
      image: "/images/new.webp",
      slug: "fashion-tips-styling"
    },
    {
      id: 4,
      title: "Behind the Scenes: Our Design Process",
      excerpt: "Take a look behind the curtain and see how our designers bring concepts to life.",
      date: "December 28, 2024",
      category: "Design",
      image: "/images/new.webp",
      slug: "behind-scenes-design"
    },
    {
      id: 5,
      title: "Celebrating Individuality Through Fashion",
      excerpt: "How fashion empowers us to express our unique personalities and celebrate our individuality.",
      date: "December 20, 2024",
      category: "Lifestyle",
      image: "/images/new.webp",
      slug: "celebrating-individuality"
    },
    {
      id: 6,
      title: "The Future of Retail: Online Shopping Experience",
      excerpt: "Exploring how technology is transforming the way we shop for fashion online.",
      date: "December 15, 2024",
      category: "Technology",
      image: "/images/new.webp",
      slug: "future-of-retail"
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-36 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-wide">
            BLOG
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 tracking-wide max-w-2xl mx-auto">
            Discover the latest trends, fashion tips, and stories from Retro Louve
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="group cursor-pointer"
            >
              <Link href={`/blog/${post.slug}`}>
                {/* Image Container */}
                <div className="relative aspect-4/3 overflow-hidden bg-gray-100 mb-4">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="uppercase tracking-wide">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-wide group-hover:text-brand transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center text-xs text-brand tracking-wide uppercase group-hover:underline">
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

        {/* Load More Button */}
        <div className="flex justify-center mt-12 sm:mt-16">
          <button className="px-6 sm:px-8 py-3 text-brand border-2 border-brand text-xs sm:text-sm tracking-wider font-medium hover:bg-brand hover:text-white transition-colors duration-300">
            LOAD MORE
          </button>
        </div>
      </div>
    </div>
  );
}

