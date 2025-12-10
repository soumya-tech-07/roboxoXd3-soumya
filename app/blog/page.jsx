'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function BlogPage() {
  const [currentPage, setCurrentPage] = useState(0);

  const blogPages = [
    {
      type: 'intro',
      title: 'RETRO JOURNAL',
      heading: "INDIA'S NEW ERA OF LUXURY FASHION — CURATED BY RETRO LOUVE",
      content: `Winter in India has always carried its own quiet kind of magic — the misty mornings in Delhi, the golden sunsets in Mumbai, the crisp nights of Bangalore. This year, the season ushers in a new definition of luxury: one that blends warmth with couture craftsmanship, practicality with refined glamour.

At Retro Louve, we craft pieces not to follow trends but to re-shape them — for the modern Indian woman and man who chooses elegance as a lifestyle, not an occasional indulgence.

Here, we present six winter fashion trends dominating elite wardrobes worldwide — reimagined through Retro Louve's signature language of sophistication.`,
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=1600&fit=crop&q=80',
      cta: 'CLICK HERE TO SEE HOW YOU CAN ENRICH YOUR WARDROBE WITH UPDATED FASHION TRENDS BY RETRO LOUVE',
    },
    {
      type: 'product',
      title: 'TWILL & FAUX LEATHER LOWER',
      content: `The Twill & Faux Leather Lower is where contemporary tailoring meets urban sophistication. Crafted with premium twill and accented with faux leather, it offers structure, comfort, and versatility. Designed for both men and women, it seamlessly blends refined elegance with modern streetwear sensibilities, making it a cornerstone piece for the Retdo Louve winter wardrobe.`,
      sections: [
        {
          heading: 'Retro Louve Reimagines It:',
          text: 'Pair these lowers with the Black Faux Leather Jacket with Peach Sherpa for a polished, city-ready ensemble or combine with the Unisex Black Varsity Jacket and Melange French Terry Vest for layered, textural sophistication.',
        },
        {
          heading: 'Why It Elevates Luxury:',
          text: 'Luxury is reflected in material fusion and meticulous tailoring. The combination of soft twill and faux leather transforms standard lower into a statement of subtle power and style-conscious design.',
        },
      ],
      image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=1200&h=1600&fit=crop&q=80',
      cta: 'CLICK HERE TO SEE HOW YOU CAN BE MORE FASHIONABLE',
    },
    {
      type: 'product',
      title: 'UNISEX BLACK VARSITY JACKET',
      content: `The Unisex Black Varsity Jacket is a modern reinterpretation of classic athletic wear, elevated with premium fabrics and meticulous craftsmanship. Made with twill, taffeta, and polyfill, it combines warmth, structure, and refined comfort. Its unisex design makes it versatile for both men and women, embodying sophisticated street-style elegance.`,
      sections: [
        {
          heading: 'Retro Louve Reimagines It:',
          text: 'Layer it over a high-quality cotton shirt or the White Lycra Top with Red Lace, paired with Twill-Faux Leather Lowers for a polished urban ensemble. Add a belt or scarf to create definition and playful layering for city strolls, café outings, or evening gatherings.',
        },
        {
          heading: 'Why It Elevates Luxury:',
          text: 'Premium materials and tailored construction transform a sporty jacket into a statement of understated refinement, perfect for those who value versatility and style.',
        },
      ],
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=1600&fit=crop&q=80',
      cta: 'CLICK HERE TO SEE HOW YOU CAN BE MORE FASHIONABLE',
    },
    {
      type: 'product',
      title: 'BLACK OFF-SHOULDER HOSIERY TOP',
      content: `The Black Off-Shoulder Hosiery Top exudes sculpted elegance and contemporary sophistication, designed for women who embrace understated sensuality. Crafted from premium hosiery fabric, it hugs the body gracefully while framing the shoulders, creating a sleek, refined silhouette that transitions effortlessly from day to night.`,
      sections: [
        {
          heading: 'Retro Louve Reimagines It:',
          text: 'Pair it with Twill-Faux Leather Lowers or layer under the Melange French Terry Vest for cocktail evenings, rooftop dinners, or stylish winter parties. For a casual daytime look, combine with tailored trousers and a soft scarf for subtle texture.',
        },
        {
          heading: 'Why It Elevates Luxury:',
          text: 'Luxury is in the balance of minimalism and sensuality. The off-shoulder design, paired with high-quality fabric, transforms a simple top into a versatile piece that signals sophistication without effort.',
        },
      ],
      image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=1200&h=1600&fit=crop&q=80',
      cta: 'CLICK HERE TO SEE HOW YOU CAN BE MORE FASHIONABLE',
    },
    {
      type: 'product',
      title: 'WHITE LYCRA TOP WITH RED LACE',
      content: `The White Lycra Top with Red Lace embodies delicate elegance fused with modern sophistication. Crafted from soft lycra, it hugs the body while offering comfort and flexibility, while the intricate red lace adds a touch of romantic couture-inspired detail.`,
      sections: [
        {
          heading: 'Retro Louve Reimagines It:',
          text: 'Pair it with the Black Faux Leather Jacket with Peach Sherpa and Twill-Faux Leather Lower for an urban-chic daytime ensemble. For evening occasions, layer it under a blazer or the Melange French Terry Vest to add depth and dimension to your outfit.',
        },
        {
          heading: 'Why It Elevates Luxury:',
          text: 'Luxury lies in the attention to detail — the delicate lace and high-quality fabric transform a simple top into a refined statement piece, perfect for individuals who appreciate subtle sophistication.',
        },
      ],
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=1200&h=1600&fit=crop&q=80',
      imageGrid: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=1000&fit=crop&q=80',
      ],
      cta: 'CLICK HERE TO SEE HOW YOU CAN BE MORE FASHIONABLE',
    },
    {
      type: 'product',
      title: 'FAUX FUR OPULENCE: WARMTH THAT WHISPERS LUXURY',
      content: `Winter fashion meets modern elegance in the Black Faux Leather Jacket with Peach Sherpa — a statement piece designed to combine urban boldness with cozy refinement.`,
      sections: [
        {
          heading: 'Retro Louve Reimagines It:',
          text: 'Let the sherpa lining of our Faux Leather Jacket be your subtle entry into the fur trend, or layer a neutral faux fur muffler over your winter ensemble. Together, the texture play feels rich, warm and quietly extravagant.',
        },
        {
          heading: 'Why It Elevates Luxury:',
          text: 'Texture equals perceived value. The more layered, the more elevated. Ideal for: Christmas dinners, rooftop parties, New Year itineraries.',
        },
      ],
      image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=1200&h=1600&fit=crop&q=80',
      cta: 'CLICK HERE TO SEE HOW YOU CAN BE MORE FASHIONABLE',
    },
    {
      type: 'product-grid',
      title: 'BLACK & BLUE HIGH-QUALITY COTTON SHIRTS (UNISEX)',
      content: `The Black and Blue High-Quality Cotton Shirts are a timeless expression of elegance and versatility, designed for both men and women who value refined simplicity. Crafted from premium cotton, these shirts offer softness, durability, and a crisp finish, making them perfect for layering or wearing solo. They are the ideal foundation for creating sophisticated winter ensembles.`,
      sections: [
        {
          heading: 'Retro Louve Reimagines It:',
          text: 'Style these shirts under the Melange French Terry Vest or the Unisex Black Varsity Jacket for a polished, urban-chic look. Pair with the Twill & Faux Leather Lower for day-to-night versatility, or layer under the Black Faux Leather Jacket with Peach Sherpa for statement evening ensembles. These shirts also complement the White Lycra Top with Red Lace or Black Off-Shoulder Hosiery Top when layering is desired.',
        },
        {
          heading: 'Why It Elevates Luxury:',
          text: 'The combination of premium cotton and precise tailoring transforms a basic shirt into a refined wardrobe essential. Clean lines, impeccable fit, and tactile comfort signal understated sophistication.',
        },
      ],
      productImages: [
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=80',
      ],
      cta: 'THATS ALL FOLKS!',
    },
    {
      type: 'product',
      title: 'MELANGE FRENCH TERRY VEST (UNISEX)',
      content: `The Melange French Terry Vest is a study in modern minimalism and understated luxury. Designed primarily for men but effortlessly wearable by women, it is crafted from plush French terry that balances comfort, warmth, and contemporary style. Its clean lines and versatile silhouette make it a must-have layering piece for the sophisticated Indian wardrobe.`,
      sections: [
        {
          heading: 'Retro Louve Reimagines It:',
          text: 'Layer it over the Black or Blue High-Quality Cotton Shirts for polished office-to-evening transitions, or combine with the Twill-Faux Leather Lower and a Black Varsity Jacket for elevated street-style sophistication. Pairing it with the White Lycra Top with Red Lace or the Black Off-Shoulder Hosiery Top creates dimension and texture, perfect for evening outings or casual chic events.',
        },
        {
          heading: 'Why It Elevates Luxury:',
          text: 'The tactile richness of French terry and the minimalist design transform a simple vest into a curated statement of elegance, demonstrating that understated layering can feel as luxurious as any bold piece.',
        },
      ],
      image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1200&h=1600&fit=crop&q=80',
      cta: 'CLICK HERE TO SEE HOW YOU CAN BE MORE FASHIONABLE',
    },
  ];

  const currentBlog = blogPages[currentPage];

  const nextPage = () => {
    if (currentPage < blogPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="relative min-h-screen w-full pt-20 sm:pt-28 lg:pt-32">
      {/* Main Content Area */}
      <div className="w-full">
        <div className="px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-12 sm:py-16 md:py-20">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl font-black tracking-tight mb-8 sm:mb-12 md:mb-16 text-black">
            {currentBlog.title}
          </h1>

          {/* Intro Layout */}
          {currentBlog.type === 'intro' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
              {/* Left Column - Text */}
              <div className="space-y-6 lg:space-y-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light leading-snug text-black">
                  {currentBlog.heading}
                </h2>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-900 whitespace-pre-line text-justify">
                  {currentBlog.content}
                </p>
              </div>

              {/* Right Column - Image */}
              <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] bg-gray-300 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={currentBlog.image}
                  alt={currentBlog.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Product Layout */}
          {currentBlog.type === 'product' && (
            <div className="space-y-10 sm:space-y-12">
              {/* Main Image */}
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-gray-300 mb-8 rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={currentBlog.image}
                  alt={currentBlog.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-900 text-justify">
                {currentBlog.content}
              </p>

              {/* Image Grid (if exists) */}
              {currentBlog.imageGrid && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 my-10">
                  {currentBlog.imageGrid.map((img, idx) => (
                    <div key={idx} className="relative aspect-3/4 bg-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <Image src={img} alt={`Style ${idx + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Sections */}
              {currentBlog.sections?.map((section, idx) => (
                <div key={idx} className="space-y-4 py-6 border-b border-gray-200 last:border-b-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-black">
                    {section.heading}
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed text-gray-900 text-justify">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Product Grid Layout */}
          {currentBlog.type === 'product-grid' && (
            <div className="space-y-10 sm:space-y-12">
              {/* Description */}
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-900 text-justify">
                {currentBlog.content}
              </p>

              {/* Sections */}
              {currentBlog.sections?.map((section, idx) => (
                <div key={idx} className="space-y-4 py-6 border-b border-gray-200 last:border-b-0">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 text-black">
                    {section.heading}
                  </h3>
                  <p className="text-base sm:text-lg leading-relaxed text-gray-900 text-justify">
                    {section.text}
                  </p>
                </div>
              ))}

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 my-10">
                {currentBlog.productImages?.map((img, idx) => (
                  <div key={idx} className="relative aspect-3/4 bg-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
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
          )}

          {/* Bottom Navigation Bar - At the end of content */}
          <div className="mt-16 sm:mt-20 bg-[#f5f3f0] border-t-2 border-gray-400 shadow-lg px-6 sm:px-10 md:px-16 lg:px-20 xl:px-24 py-6 sm:py-8">
            <div className="flex items-center justify-between gap-6">
              {/* Left: CTA Button */}
              <button
                onClick={nextPage}
                disabled={currentPage === blogPages.length - 1}
                className="flex items-center gap-3 sm:gap-4 group disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full border-2 border-black flex items-center justify-center group-hover:bg-black group-hover:scale-110 transition-all duration-300 shrink-0">
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-black group-hover:text-white transition-colors"
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
                <span className="text-sm sm:text-base  font-semibold text-black max-w-xs sm:max-w-md lg:max-w-lg">
                  {currentBlog.cta}
                </span>
              </button>

              {/* Right: Navigation Controls */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                {currentPage > 0 && (
                  <button
                    onClick={prevPage}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-black text-black flex items-center justify-center hover:bg-black hover:text-white hover:scale-110 transition-all duration-300 cursor-pointer"
                  >
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}
                <div className="text-sm sm:text-base font-mono font-semibold text-black px-3 py-1 bg-white rounded border border-gray-300">
                  {currentPage + 1} / {blogPages.length}
                </div>
              </div>
            </div>

            {/* Website URL */}
            <div className="text-xs sm:text-sm font-semibold mt-4 text-gray-700">
              RETROLOUVE.COM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}