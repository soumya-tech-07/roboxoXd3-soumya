'use client';

import Image from 'next/image';

export default function BlogNewspaperLayout({ blog }) {
  if (blog.type === 'intro') {
    return (
      <article className="relative">
        {/* Background Image Layer - Desktop Only */}
        <div className="hidden max-w-7xl lg:block absolute inset-0 -z-10 opacity-10">
          <div className="relative w-full h-full">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Mobile: Image → Text Pattern */}
          <div className="lg:hidden space-y-6">
            <div className="relative w-full h-[300px] sm:h-[400px] bg-gray-200 overflow-hidden shadow-sm border border-gray-300">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-light leading-snug text-black">
                {blog.heading}
              </h2>
              <p className="text-base sm:text-lg leading-relaxed text-gray-900 whitespace-pre-line text-justify">
                {blog.content}
              </p>
            </div>
          </div>

          {/* Desktop: Full-width Cover + Structured Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12">
            {/* Full-width Cover Image */}
            <div className="col-span-12 mb-8">
              <div className="relative w-full h-[400px] xl:h-[500px] bg-gray-200 overflow-hidden shadow-md border border-gray-300">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>

            {/* Structured Text Layout */}
            <div className="col-span-12 col-start-1 space-y-6">
              <h2 className="text-3xl xl:text-4xl font-light leading-snug text-black">
                {blog.heading}
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg xl:text-xl leading-relaxed text-gray-900 whitespace-pre-line text-justify">
                  {blog.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (blog.type === 'product') {
    return (
      <article className="relative">
        {/* Background Image Layer - Desktop Only */}
        <div className="hidden lg:block absolute inset-0 -z-10 opacity-10">
          <div className="relative w-full h-full">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8 lg:space-y-12">
          {/* Mobile: Image → Text Pattern */}
          <div className="lg:hidden space-y-6">
            {/* Image */}
            <div className="relative w-full h-[300px] sm:h-[400px] bg-gray-200 overflow-hidden shadow-sm border border-gray-300">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Text */}
            <div className="space-y-4">
              <p className="text-base sm:text-lg leading-relaxed text-gray-900 text-justify">
                {blog.content}
              </p>
            </div>

            {/* Image Grid (if exists) */}
            {blog.imageGrid && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
                {blog.imageGrid.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-3/4 bg-gray-200 overflow-hidden shadow-sm border border-gray-300"
                  >
                    <Image
                      src={img}
                      alt={`Style ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Sections */}
            {blog.sections?.map((section, idx) => (
              <div key={idx} className="space-y-3 py-4 border-b border-gray-200 last:border-b-0">
                <h3 className="text-lg sm:text-xl font-semibold text-black">
                  {section.heading}
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-gray-900 text-justify">
                  {section.text}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: Structured Layout */}
          <div className="hidden lg:block">
            {/* Main Image */}
            <div className="relative w-full h-[400px] xl:h-[500px] bg-gray-200 overflow-hidden shadow-md border border-gray-300 mb-8">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Text Content */}
            <div className="max-w-7xl mx-auto space-y-8">
              <p className="text-lg xl:text-xl leading-relaxed text-gray-900 text-justify">
                {blog.content}
              </p>

              {/* Image Grid (if exists) */}
              {blog.imageGrid && (
                <div className="grid grid-cols-5 gap-3 my-10">
                  {blog.imageGrid.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-3/4 bg-gray-200 overflow-hidden shadow-sm border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <Image
                        src={img}
                        alt={`Style ${idx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Sections */}
              {blog.sections?.map((section, idx) => (
                <div
                  key={idx}
                  className="space-y-4 py-6 border-b border-gray-200 last:border-b-0"
                >
                  <h3 className="text-xl xl:text-2xl font-semibold mb-4 text-black">
                    {section.heading}
                  </h3>
                  <p className="text-lg xl:text-xl leading-relaxed text-gray-900 text-justify">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (blog.type === 'product-grid') {
    return (
      <article className="relative">
        {/* Background Image Layer - Desktop Only */}
        <div className="hidden lg:block absolute inset-0 -z-10 opacity-10">
          <div className="relative w-full h-full">
            {blog.productImages?.[0] && (
              <Image
                src={blog.productImages[0]}
                alt={blog.title}
                fill
                className="object-cover"
              />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 space-y-8 lg:space-y-12">
          {/* Mobile: Text → Image Grid Pattern */}
          <div className="lg:hidden space-y-6">
            <p className="text-base sm:text-lg leading-relaxed text-gray-900 text-justify">
              {blog.content}
            </p>

            {blog.sections?.map((section, idx) => (
              <div key={idx} className="space-y-3 py-4 border-b border-gray-200 last:border-b-0">
                <h3 className="text-lg sm:text-xl font-semibold text-black">
                  {section.heading}
                </h3>
                <p className="text-base sm:text-lg leading-relaxed text-gray-900 text-justify">
                  {section.text}
                </p>
              </div>
            ))}

            {/* Image Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-6">
              {blog.productImages?.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-3/4 bg-gray-200 overflow-hidden shadow-sm border border-gray-300"
                >
                  <Image
                    src={img}
                    alt={`Product ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: Structured Layout */}
          <div className="hidden lg:block max-w-6xl mx-auto space-y-10">
            <p className="text-lg xl:text-xl leading-relaxed text-gray-900 text-justify">
              {blog.content}
            </p>

            {blog.sections?.map((section, idx) => (
              <div
                key={idx}
                className="space-y-4 py-6 border-b border-gray-200 last:border-b-0"
              >
                <h3 className="text-xl xl:text-2xl font-semibold mb-4 text-black">
                  {section.heading}
                </h3>
                <p className="text-lg xl:text-xl leading-relaxed text-gray-900 text-justify">
                  {section.text}
                </p>
              </div>
            ))}

            {/* Product Grid */}
            <div className="grid grid-cols-4 gap-3 my-10">
              {blog.productImages?.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-3/4 bg-gray-200 overflow-hidden shadow-sm border border-gray-300 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <Image
                    src={img}
                    alt={`Product ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </article>
    );
  }

  return null;
}

