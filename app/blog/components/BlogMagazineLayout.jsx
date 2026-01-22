'use client';

import Image from 'next/image';

export default function BlogMagazineLayout({ blog }) {
  if (blog.type === 'intro') {
    return (
      <div className="space-y-8 sm:space-y-10">
        {/* Hero Image - Centered, Natural Aspect Ratio */}
        <div className="w-full flex justify-center -mx-4 sm:mx-0">
          <div className="relative w-full max-w-2xl bg-[#f5f3f0]" style={{ aspectRatio: '3/4', maxHeight: '600px' }}>
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        </div>

        {/* Content - Narrow Column */}
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {blog.heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-black">
              {blog.heading}
            </h2>
          )}
          
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-900">
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (blog.type === 'product') {
    return (
      <div className="space-y-8 sm:space-y-10">
        {/* Hero Image - Centered */}
        <div className="w-full flex justify-center -mx-4 sm:mx-0">
          <div className="relative w-full max-w-2xl bg-[#f5f3f0]" style={{ aspectRatio: '3/4', maxHeight: '600px' }}>
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 672px"
              priority
            />
          </div>
        </div>

        {/* Content - Narrow Column */}
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Content */}
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-900">
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sections */}
          {blog.sections && blog.sections.length > 0 && (
            <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-gray-300">
              {blog.sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                    {section.heading}
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed text-gray-900">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (blog.type === 'product-grid') {
    return (
      <div className="space-y-8 sm:space-y-10">
        {/* Content First - Narrow Column */}
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {/* Main Content */}
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-900">
            {blog.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Sections */}
          {blog.sections && blog.sections.length > 0 && (
            <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-gray-300">
              {blog.sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                    {section.heading}
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed text-gray-900">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Image Grid - 3 Columns (Better for Portrait) */}
        {blog.productImages && blog.productImages.length > 0 && (
          <div className="pt-8 sm:pt-10 -mx-4 sm:mx-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto px-4 sm:px-0">
              {blog.productImages.map((imageSrc, index) => (
                <div
                  key={index}
                  className="relative bg-[#f5f3f0] overflow-hidden"
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={imageSrc}
                    alt={`${blog.title} ${index + 1}`}
                    fill
                    className="object-contain hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
