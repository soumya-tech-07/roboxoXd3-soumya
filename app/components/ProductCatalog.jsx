import Image from 'next/image';

// Placeholder image for products without images
const PLACEHOLDER_IMAGE = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect fill='%23f3f4f6' width='800' height='1000'/%3E%3Ctext fill='%239ca3af' font-family='system-ui,-apple-system,sans-serif' font-size='24' font-weight='500' x='50%25' y='45%25' text-anchor='middle' dominant-baseline='middle'%3ENo Image%3C/text%3E%3Ctext fill='%239ca3af' font-family='system-ui,-apple-system,sans-serif' font-size='18' font-weight='400' x='50%25' y='52%25' text-anchor='middle' dominant-baseline='middle'%3EAvailable%3C/text%3E%3C/svg%3E`;

const defaultHover = (img) => img;

const buildGallery = (primary, secondary) => {
  const gallery = [];
  const candidates = [primary, secondary];

  candidates.forEach((url) => {
    if (!url || url === PLACEHOLDER_IMAGE) return;
    if (!gallery.includes(url)) {
      gallery.push(url);
    }
  });

  // Fill remaining slots with placeholder if needed
  while (gallery.length < 4) {
    gallery.push(PLACEHOLDER_IMAGE);
  }

  return gallery.slice(0, 4);
};

const RAW_PRODUCT_CATALOG = [
  // WOMEN'S PRODUCTS
  {
    id: 1,
    name: 'THE MIDNIGHT SIN JACKET',
    price: 14995,
    category: 'JACKETS',
    size: ['S', 'M', 'L'],
    availability: 'IN STOCK',
    stock: 18,
    description: 'The Midnight Sin Winter Jacket is crafted in exquisite high-grade faux leather and enveloped in indulgent sherpa fur, offering a harmony of warmth and refinement. Its sculpted silhouette, polished detailing, and midnight finish evokes quiet luxury. An intimate fusion of comfort and sophistication; it elevates winter dressing to an art form.',
    image: '/images/products/Midnight sin jacket- women/1.jpg',
    hoverImage: '/images/products/Midnight sin jacket- women/7.JPG',
    gallery: [
      '/images/products/Midnight sin jacket- women/1.jpg',
      '/images/products/Midnight sin jacket- women/2.heic',
      '/images/products/Midnight sin jacket- women/3.heic',
      '/images/products/Midnight sin jacket- women/4.jpg',
      '/images/products/Midnight sin jacket- women/5.heic',
      '/images/products/Midnight sin jacket- women/6.heic',
      '/images/products/Midnight sin jacket- women/7.JPG',
      '/images/products/Midnight sin jacket- women/8.jpg',
    ],
    slug: 'the-midnight-sin-jacket',
    tags: ['winter-arc', 'latest-drop', 'womens'],
    materials: ['Faux leather', 'Sherpa fur'],
    composition: 'Italian 302 faux leather (outer shell), Tibetan sherpa fabric (inner lining)',
    care: 'Dry clean only. Do not machine wash or tumble dry. Wipe faux leather with a damp soft cloth. Store away from direct sunlight to preserve finish. Store in a cool and dry place.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'S',
      height: '171cm / 5\'7"',
    },
  },
  {
    id: 2,
    name: 'THE OUTLAW CREW VARSITY JACKET',
    price: 12995,
    category: 'JACKETS',
    size: ['S', 'M', 'L'],
    availability: 'IN STOCK',
    stock: 22,
    description: 'The Outlaw Crew Varsity Jacket merges elevated street style with meticulous craftsmanship. Premium cotton twill, a warm polyfil layer, and a refined taffeta lining ensure comfort and structure. With its curated patches and bold graphic accents, it embodies modern rebellion. A statement piece that embodies artistry, warmth, and cultured street luxury.',
    image: '/images/products/The outlaw crew varsity jacket- women/1.jpg',
    hoverImage: '/images/products/The outlaw crew varsity jacket- women/5.jpg',
    gallery: [
      '/images/products/The outlaw crew varsity jacket- women/1.jpg',
      '/images/products/The outlaw crew varsity jacket- women/2.heic',
      '/images/products/The outlaw crew varsity jacket- women/3.heic',
      '/images/products/The outlaw crew varsity jacket- women/4.heic',
      '/images/products/The outlaw crew varsity jacket- women/5.jpg',
      '/images/products/The outlaw crew varsity jacket- women/IMG_4423.heic',
      '/images/products/The outlaw crew varsity jacket- women/IMG_7061.jpg',
    ],
    slug: 'the-outlaw-crew-varsity-jacket-womens',
    tags: ['winter-arc', 'latest-drop', 'womens'],
    materials: ['Cotton twill 500 gsm', 'Monolith silk taffeta', 'Sheep wool threaded polyfil'],
    composition: 'Double threaded cotton twill (outer), Oxford sheep wool polyfil (insulation), Monolith silk taffeta (inner lining)',
    care: 'Dry clean only. Do not machine wash or tumble dry. Store away from direct sunlight to preserve finish of prints. Store in a clean and dry place.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'S',
      height: '171cm / 5\'7"',
    },
  },
  {
    id: 3,
    name: 'SHADOW OF LOUVE SWEATPANTS',
    price: 8995,
    category: 'SWEATPANTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 28,
    description: 'The Shadow of Louve Sweatpants reinterprets casual wear through a refined blend of sleek faux leather and tailored cotton twill. With a sculpted fit and a soft, elevated finish, they embody understated opulence. Versatile and effortlessly polished, they bring contemporary luxury to everyday movement and modern street sophistication.',
    image: '/images/products/Shadow of louve sweat pants- women/1.jpg',
    hoverImage: '/images/products/Shadow of louve sweat pants- women/2.jpg',
    gallery: [
      '/images/products/Shadow of louve sweat pants- women/1.jpg',
      '/images/products/Shadow of louve sweat pants- women/2.jpg',
      '/images/products/Shadow of louve sweat pants- women/3.jpg',
      '/images/products/Shadow of louve sweat pants- women/4.heic',
      '/images/products/Shadow of louve sweat pants- women/IMG_0012.jpg',
    ],
    slug: 'shadow-of-louve-sweatpants-womens',
    tags: ['winter-arc', 'latest-drop', 'womens'],
    materials: ['Cotton twill', 'Faux leather'],
    composition: 'Cotton twill, Faux leather paneling',
    care: 'Hand wash inside-out in cold water. Do not wring; air dry only. Avoid ironing directly on faux leather. Do not bleach.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'S',
      height: '171cm / 5\'7"',
    },
  },
  {
    id: 4,
    name: 'LACE & ROSES TANK TOP',
    price: 3995,
    category: 'TOPS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 32,
    description: 'The Laces & Roses Tank Top pairs a beautifully sculpted white silhouette with delicate red lace tracing the neckline. Crafted from a soft, form-flattering fabric and trimmed with whisper-light lace, it blends grace and allure effortlessly. Feminine, refined, and timeless; an intimate expression of modern romantic luxury.',
    image: '/images/products/Lace & roses tank top- women/1.PNG',
    hoverImage: '/images/products/Lace & roses tank top- women/2.PNG',
    gallery: [
      '/images/products/Lace & roses tank top- women/1.PNG',
      '/images/products/Lace & roses tank top- women/2.PNG',
      '/images/products/Lace & roses tank top- women/3.jpg',
      '/images/products/Lace & roses tank top- women/4.jpg',
      '/images/products/Lace & roses tank top- women/5.jpg',
    ],
    slug: 'lace-roses-tank-top',
    tags: ['winter-arc', 'latest-drop', 'womens'],
    materials: ['Lycra lace', '300 gsm 4-way cotton lycra'],
    composition: '300 GSM premium hosiery, Lycra lace detailing (neckline)',
    care: 'Hand wash in cold water. Do not stretch lace while wet. Lay flat to dry. Iron on low heat; avoid lace area.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'S',
      height: '171cm / 5\'7"',
    },
  },
  {
    id: 5,
    name: 'THE ICY WHISPERER TOP',
    price: 4495,
    category: 'TOPS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 26,
    description: 'The Icy Whisper is a one-shoulder ruched top crafted from premium, ultra-soft hosiery that glides effortlessly against the skin. Its sculpted silhouette, delicate ruching, and modern asymmetry create an understated yet luxurious statement—elegant, refined, and designed to elevate every moment with quiet sophistication.',
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    gallery: [
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
    ],
    slug: 'the-icy-whisperer-top',
    tags: ['winter-arc', 'latest-drop', 'womens'],
    materials: ['300 gsm hosiery'],
    composition: '300 GSM ultra-soft hosiery, Ruching and asymmetrical construction',
    care: 'Hand wash only. Do not tumble dry. Keep away from rough surfaces to prevent pilling. Steam lightly if needed.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'S',
      height: '171cm / 5\'7"',
    },
  },
  {
    id: 6,
    name: 'YIN YANG CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 24,
    description: 'The Yin Yang Check Shirt reimagines classic checks with poised sophistication. Crafted from luxurious, finely woven cotton, its black-and-white palette creates a striking harmony of contrasts. The relaxed silhouette falls with effortless elegance, offering refined comfort and timeless allure.',
    image: '/images/products/Yin yang check shirt- women/1.jpg',
    hoverImage: '/images/products/Yin yang check shirt- women/2.jpg',
    gallery: [
      '/images/products/Yin yang check shirt- women/1.jpg',
      '/images/products/Yin yang check shirt- women/2.jpg',
      '/images/products/Yin yang check shirt- women/3.jpg',
      '/images/products/Yin yang check shirt- women/4.heic',
      '/images/products/Yin yang check shirt- women/5.jpg',
      '/images/products/Yin yang check shirt- women/6.jpg',
      '/images/products/Yin yang check shirt- women/IMG_0023.heic',
      '/images/products/Yin yang check shirt- women/IMG_0042.jpg',
      '/images/products/Yin yang check shirt- women/IMG_7045.jpg',
      '/images/products/Yin yang check shirt- women/Untitled design.PNG',
    ],
    slug: 'yin-yang-check-shirt-womens',
    tags: ['winter-arc', 'catalog', 'womens'],
    materials: ['100% Cotton'],
    composition: '100% finely woven cotton',
    care: 'Machine wash cold. Do not bleach. Iron on medium heat. Air dry recommended to prevent shrinkage.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'S',
      height: '171cm / 5\'7"',
    },
  },
  {
    id: 7,
    name: 'OCEAN BREEZE BLUE CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 21,
    description: 'The Ocean Breeze Blue Check Shirt captures the calm sophistication of coastal hues. Crafted from exquisitely soft, premium cotton, its serene blue checks offer a fresh yet timeless appeal. The relaxed silhouette drapes with effortless elegance, creating a refined wardrobe staple that embodies ease, balance, and elevated everyday style.',
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    gallery: [
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
    ],
    slug: 'ocean-breeze-blue-check-shirt-womens',
    tags: ['winter-arc', 'catalog', 'womens'],
    materials: ['100% cotton'],
    composition: '100% premium cotton',
    care: 'Machine wash with similar colours. Use mild detergent. Iron on medium heat for crisp finish. Do not tumble dry for longevity.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'S',
      height: '171cm / 5\'7"',
    },
  },
  
  // MEN'S PRODUCTS
  {
    id: 8,
    name: 'HAWK EYE GREY VEST',
    price: 4495,
    category: 'VESTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 30,
    description: 'The Hawk Eye Grey Vest is crafted from exceptionally soft, resilient French terry, designed for a fluid, drop-shoulder drape. Its commanding eagle motif contrasts elegantly with the subtly distressed waist hem, creating a curated edge. Effortlessly modern and artfully textured, it embodies contemporary street luxury with a bold yet understated aesthetic.',
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    gallery: [
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
    ],
    slug: 'hawk-eye-grey-vest',
    tags: ['winter-arc', 'latest-drop', 'mens'],
    materials: ['French terry'],
    composition: '100% French terry cotton, Printed eagle motif, Subtly distressed hem finish',
    care: 'Gentle machine wash in cold water. Wash inside-out. Do not tumble dry. Iron on low heat (avoid print).',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'M',
      height: '175cm / 5\'9"',
    },
  },
  {
    id: 9,
    name: 'OCEAN BREEZE BLUE CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 27,
    description: 'The Ocean Breeze Blue Check Shirt captures the calm sophistication of coastal hues. Crafted from exquisitely soft, premium cotton, its serene blue checks offer a fresh yet timeless appeal. The relaxed silhouette drapes with effortless elegance, creating a refined wardrobe staple that embodies ease, balance, and elevated everyday style.',
    image: PLACEHOLDER_IMAGE,
    hoverImage: PLACEHOLDER_IMAGE,
    gallery: [
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
      PLACEHOLDER_IMAGE,
    ],
    slug: 'ocean-breeze-blue-check-shirt-mens',
    tags: ['winter-arc', 'catalog', 'mens'],
    materials: ['100% cotton'],
    composition: '100% premium cotton',
    care: 'Machine wash with similar colours. Use mild detergent. Iron on medium heat for crisp finish. Do not tumble dry for longevity.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'M',
      height: '175cm / 5\'9"',
    },
  },
  {
    id: 10,
    name: 'YIN YANG CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 25,
    description: 'The Yin Yang Check Shirt reimagines classic checks with poised sophistication. Crafted from luxurious, finely woven cotton, its black-and-white palette creates a striking harmony of contrasts. The relaxed silhouette falls with effortless elegance, offering refined comfort and timeless allure.',
    image: '/images/products/Yin yang shirt- men/6.jpg',
    hoverImage: '/images/products/Yin yang shirt- men/9.jpg',
    gallery: [
      '/images/products/Yin yang shirt- men/1.heic',
      '/images/products/Yin yang shirt- men/2.heic',
      '/images/products/Yin yang shirt- men/3.heic',
      '/images/products/Yin yang shirt- men/4.heic',
      '/images/products/Yin yang shirt- men/5.heic',
      '/images/products/Yin yang shirt- men/6.jpg',
      '/images/products/Yin yang shirt- men/7.PNG',
      '/images/products/Yin yang shirt- men/8.heic',
      '/images/products/Yin yang shirt- men/9.jpg',
      '/images/products/Yin yang shirt- men/IMG_7045.jpg',
      '/images/products/Yin yang shirt- men/Untitled design.PNG',
    ],
    slug: 'yin-yang-check-shirt-mens',
    tags: ['winter-arc', 'catalog', 'mens'],
    materials: ['Oxford gittisham 100% cotton'],
    composition: '100% premium cotton',
    care: 'Machine wash with similar colours. Use mild detergent. Iron on medium heat for crisp finish. Do not tumble dry for longevity.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'M',
      height: '175cm / 5\'9"',
    },
  },
  {
    id: 11,
    name: 'SHADOW OF LOUVE SWEATPANTS',
    price: 8995,
    category: 'SWEATPANTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 29,
    description: 'The Shadow of Louve Sweatpants reinterprets casual wear through a refined blend of sleek faux leather and tailored cotton twill. With a sculpted fit and a soft, elevated finish, they embody understated opulence. Versatile and effortlessly polished, they bring contemporary luxury to everyday movement and modern street sophistication.',
    image: '/images/products/Shadow of louve sweatpants- men/2.jpg',
    hoverImage: '/images/products/Shadow of louve sweatpants- men/5.jpg',
    gallery: [
      '/images/products/Shadow of louve sweatpants- men/1.heic',
      '/images/products/Shadow of louve sweatpants- men/2.jpg',
      '/images/products/Shadow of louve sweatpants- men/3.heic',
      '/images/products/Shadow of louve sweatpants- men/4.heic',
      '/images/products/Shadow of louve sweatpants- men/5.jpg',
      '/images/products/Shadow of louve sweatpants- men/6.heic',
    ],
    slug: 'shadow-of-louve-sweatpants-mens',
    tags: ['winter-arc', 'latest-drop', 'mens'],
    materials: ['Cotton twill', 'Faux leather'],
    composition: 'Cotton twill, Faux leather paneling',
    care: 'Hand wash inside-out in cold water. Do not wring; air dry only. Avoid ironing directly on faux leather. Do not bleach.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'M',
      height: '175cm / 5\'9"',
    },
  },
  {
    id: 12,
    name: 'THE OUTLAW CREW VARSITY JACKET',
    price: 12995,
    category: 'JACKETS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 19,
    description: 'The Outlaw Crew Varsity Jacket merges elevated street style with meticulous craftsmanship. Premium cotton twill, a warm polyfil layer, and a refined taffeta lining ensure comfort and structure. With its curated patches and bold graphic accents, it embodies modern rebellion. A statement piece that embodies artistry, warmth, and cultured street luxury.',
    image: '/images/products/The outlaw crew varsity jacket- men/2.jpg',
    hoverImage: '/images/products/The outlaw crew varsity jacket- men/3.jpg',
    gallery: [
      '/images/products/The outlaw crew varsity jacket- men/1.heic',
      '/images/products/The outlaw crew varsity jacket- men/2.jpg',
      '/images/products/The outlaw crew varsity jacket- men/3.jpg',
      '/images/products/The outlaw crew varsity jacket- men/4.heic',
      '/images/products/The outlaw crew varsity jacket- men/5.jpg',
      '/images/products/The outlaw crew varsity jacket- men/6.jpg',
      '/images/products/The outlaw crew varsity jacket- men/7.heic',
      '/images/products/The outlaw crew varsity jacket- men/8.jpg',
      '/images/products/The outlaw crew varsity jacket- men/IMG_7061.jpg',
    ],
    slug: 'the-outlaw-crew-varsity-jacket-mens',
    tags: ['winter-arc', 'latest-drop', 'mens'],
    materials: ['Cotton twill', 'High quality taffeta', '100 gsm silkenised polyfil'],
    composition: 'Premium cotton twill (outer), 100 GSM silkenised polyfil (insulation), High-quality taffeta (inner lining)',
    care: 'Dry clean only. Do not machine wash or tumble dry. Store away from direct sunlight to preserve finish of prints. Store in a clean and dry place.',
    origin: 'Designed in India. Ethically crafted in limited quantities.',
    modelInfo: {
      size: 'M',
      height: '175cm / 5\'9"',
    },
  },
];

export const PRODUCT_CATALOG = RAW_PRODUCT_CATALOG.map((product) => {
  const existingGallery = Array.isArray(product.gallery)
    ? product.gallery.filter(Boolean)
    : [];

  return {
    ...product,
    gallery:
      existingGallery.length > 0
        ? existingGallery
        : buildGallery(product.image, product.hoverImage),
  };
});

export const latestDropProductIds = [1, 2, 3, 4, 5, 8, 11, 12];
export const coreCollectionProductIds = [6, 7, 9, 10];

export const getProductsByIds = (ids) =>
  PRODUCT_CATALOG.filter((product) => ids.includes(product.id));

export const getProductsByCategory = (category) =>
  category === 'VIEW ALL'
    ? PRODUCT_CATALOG
    : PRODUCT_CATALOG.filter((product) => product.category === category);

export const getProductBySlug = (slug) =>
  PRODUCT_CATALOG.find((product) => product.slug === slug);

export default function ProductCatalogList() {
  return (
    <section className="bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div>
            <p className="text-[10px] tracking-[0.18em] text-brand">WINTER ARC COLLECTION</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              Product Catalog
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            {PRODUCT_CATALOG.length} styles · synced across UI components
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_CATALOG.map((product) => (
            <article
              key={product.id}
              className="border border-gray-200 rounded-sm bg-white shadow-sm overflow-hidden"
            >
              <div className="relative aspect-4/5 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="p-4 space-y-2 text-[11px] uppercase tracking-[0.12em]">
                <div className="flex justify-between text-brand font-semibold">
                  <span>ID: {product.id}</span>
                  <span>₹{product.price.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-gray-900 font-medium">{product.name}</p>
                <p className="text-gray-500 lowercase">/{product.slug}</p>
                <div className="flex items-center justify-between text-[10px] text-gray-600">
                  <span>{product.category}</span>
                  <span>{product.availability}</span>
                </div>
                <p className="normal-case text-[11px] text-gray-600 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-brand/10 text-brand px-2 py-0.5 rounded-full text-[10px] tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

