'use client';

import Image from 'next/image';

/**
 * Tiptap/rich-text HTML class: headings, lists, links, images.
 * Use with dangerouslySetInnerHTML so Tiptap output from admin renders correctly.
 */
const TIPTAP_CONTENT_CLASS =
  'blog-tiptap-content space-y-4 text-base sm:text-lg leading-relaxed text-gray-900 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_li]:my-1 [&_a]:text-brand [&_a]:underline [&_a]:hover:opacity-80 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded [&_img]:my-4';

/** Renders content as HTML (Tiptap from admin) or plain text (paragraphs by double newline). */
function BlogContent({ content, className = '' }) {
  if (!content) return null;
  const isHtml = typeof content === 'string' && (content.trim().startsWith('<') || content.includes('<p>') || content.includes('<h'));
  if (isHtml) {
    return (
      <div
        className={`${TIPTAP_CONTENT_CLASS} ${className}`.trim()}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }
  return (
    <div className={`space-y-4 text-base sm:text-lg leading-relaxed text-gray-900 ${className}`.trim()}>
      {content.split('\n\n').map((paragraph, index) => (
        <p key={index} className="leading-relaxed">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export default function BlogMagazineLayout({ blog }) {
  if (blog.type === 'intro') {
    return (
      <div className="space-y-8 sm:space-y-10">
        {blog.image && (
          <div className="w-full flex justify-center items-center">
            <div className="relative w-full max-w-2xl bg-[#f5f3f0] mx-auto" style={{ aspectRatio: '3/4', maxHeight: '600px' }}>
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 672px"
                quality={70}
                loading="lazy"
              />
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          {blog.heading && (
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-black">
              {blog.heading}
            </h2>
          )}
          <BlogContent content={blog.content} />
        </div>
      </div>
    );
  }

  if (blog.type === 'product') {
    return (
      <div className="space-y-8 sm:space-y-10">
        {blog.image && (
          <div className="w-full flex justify-center items-center">
            <div className="relative w-full max-w-2xl bg-[#f5f3f0] mx-auto" style={{ aspectRatio: '3/4', maxHeight: '600px' }}>
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 672px"
                quality={70}
                loading="lazy"
              />
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <BlogContent content={blog.content} />
          {blog.sections && blog.sections.length > 0 && (
            <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-gray-300">
              {blog.sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                    {section.heading}
                  </h3>
                  <BlogContent content={section.text} className="space-y-0" />
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
        {blog.productImages && blog.productImages.length > 0 && (
          <div className="w-full flex justify-center items-center">
            <div className="relative w-full max-w-2xl bg-[#f5f3f0] mx-auto" style={{ aspectRatio: '3/4', maxHeight: '600px' }}>
              <Image
                src={blog.productImages[0]}
                alt={blog.title}
                fill
                className="object-contain object-center"
                sizes="(max-width: 768px) 100vw, 672px"
                quality={70}
                loading="lazy"
              />
            </div>
          </div>
        )}
        <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
          <BlogContent content={blog.content} />
          {blog.sections && blog.sections.length > 0 && (
            <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-gray-300">
              {blog.sections.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                    {section.heading}
                  </h3>
                  <BlogContent content={section.text} className="space-y-0" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* Admin-created posts (Tiptap rich text): type 'post' or any other type */
  return (
    <div className="space-y-8 sm:space-y-10">
      {blog.image && (
        <div className="w-full flex justify-center items-center">
          <div className="relative w-full max-w-2xl bg-[#f5f3f0] mx-auto" style={{ aspectRatio: '3/4', maxHeight: '600px' }}>
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-contain object-center"
              sizes="(max-width: 768px) 100vw, 672px"
              quality={70}
              loading="lazy"
            />
          </div>
        </div>
      )}
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        {blog.heading && (
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight text-black">
            {blog.heading}
          </h2>
        )}
        <BlogContent content={blog.content} />
        {blog.sections && blog.sections.length > 0 && (
          <div className="space-y-6 sm:space-y-8 pt-6 sm:pt-8 border-t border-gray-300">
            {blog.sections.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                  {section.heading}
                </h3>
                <BlogContent content={section.text} className="space-y-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
