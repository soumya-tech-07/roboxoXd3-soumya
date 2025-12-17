import Image from 'next/image';

// Dummy product images from Unsplash Source
const PRODUCT_IMAGES = {
  // Jackets
  jacket1: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
  jacket2: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1000&fit=crop',
  jacket3: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop',
  // Sweatpants
  sweatpants1: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop',
  sweatpants2: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop',
  // Tops
  top1: 'https://images.unsplash.com/photo-1594633312681-425a7b9569e2?w=800&h=1000&fit=crop',
  top2: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop',
  // Shirts
  shirt1: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1000&fit=crop',
  shirt2: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop',
  shirt3: 'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1000&fit=crop',
  shirt4: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop',
  // Vests
  vest1: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=1000&fit=crop',
};

// Gallery images for hover states and product galleries
const GALLERY_IMAGES = {
  jacket: [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
  ],
  sweatpants: [
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
  ],
  tops: [
    'https://images.unsplash.com/photo-1594633312681-425a7b9569e2?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
  ],
  shirts: [
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
  ],
  vests: [
    'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
  ],
};

const defaultHover = (img) => img;

const FALLBACK_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&h=1000&fit=crop',
  'https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&h=1000&fit=crop',
];

const buildGallery = (primary, secondary) => {
  const gallery = [];
  const candidates = [primary, secondary, ...FALLBACK_GALLERY_IMAGES];

  candidates.forEach((url) => {
    if (!url) return;
    if (!gallery.includes(url)) {
      gallery.push(url);
    }
  });

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
    description: 'Crafted in exquisite high-grade faux leather and enveloped in indulgent sherpa fur, offering a harmony of warmth and refinement.',
    image: PRODUCT_IMAGES.jacket1,
    hoverImage: PRODUCT_IMAGES.jacket2,
    gallery: GALLERY_IMAGES.jacket,
    slug: 'the-midnight-sin-jacket',
    tags: ['winter-arc', 'latest-drop', 'womens'],
  },
  {
    id: 2,
    name: 'THE OUTLAW CREW VARSITY JACKET',
    price: 12995,
    category: 'JACKETS',
    size: ['S', 'M', 'L'],
    availability: 'IN STOCK',
    stock: 22,
    description: 'Merges elevated street style with meticulous craftsmanship. Premium cotton twill, a warm polyfil layer, and a refined taffeta lining ensure comfort and structure.',
    image: PRODUCT_IMAGES.jacket2,
    hoverImage: PRODUCT_IMAGES.jacket3,
    gallery: GALLERY_IMAGES.jacket,
    slug: 'the-outlaw-crew-varsity-jacket-womens',
    tags: ['winter-arc', 'latest-drop', 'womens'],
  },
  {
    id: 3,
    name: 'SHADOW OF LOUVE SWEATPANTS',
    price: 8995,
    category: 'SWEATPANTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 28,
    description: 'Reinterprets casual wear through a refined blend of sleek faux leather and tailored cotton twill. With a sculpted fit and a soft, elevated finish.',
    image: PRODUCT_IMAGES.sweatpants1,
    hoverImage: PRODUCT_IMAGES.sweatpants2,
    gallery: GALLERY_IMAGES.sweatpants,
    slug: 'shadow-of-louve-sweatpants-womens',
    tags: ['winter-arc', 'latest-drop', 'womens'],
  },
  {
    id: 4,
    name: 'LACE & ROSES TANK TOP',
    price: 3995,
    category: 'TOPS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 32,
    description: 'Pairs a beautifully sculpted white silhouette with delicate red lace tracing the neckline. Crafted from a soft, form-flattering fabric and trimmed with whisper-light lace.',
    image: PRODUCT_IMAGES.top1,
    hoverImage: PRODUCT_IMAGES.top2,
    gallery: GALLERY_IMAGES.tops,
    slug: 'lace-roses-tank-top',
    tags: ['winter-arc', 'latest-drop', 'womens'],
  },
  {
    id: 5,
    name: 'THE ICY WHISPERER TOP',
    price: 4495,
    category: 'TOPS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 26,
    description: 'A one-shoulder ruched top crafted from premium, ultra-soft hosiery that glides effortlessly against the skin. Its sculpted silhouette, delicate ruching, and modern asymmetry create an understated yet luxurious statement.',
    image: PRODUCT_IMAGES.top2,
    hoverImage: PRODUCT_IMAGES.top1,
    gallery: GALLERY_IMAGES.tops,
    slug: 'the-icy-whisperer-top',
    tags: ['winter-arc', 'latest-drop', 'womens'],
  },
  {
    id: 6,
    name: 'YIN YANG CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 24,
    description: 'Reimagines classic checks with poised sophistication. Crafted from luxurious, finely woven cotton, its black-and-white palette creates a striking harmony of contrasts.',
    image: PRODUCT_IMAGES.shirt1,
    hoverImage: PRODUCT_IMAGES.shirt2,
    gallery: GALLERY_IMAGES.shirts,
    slug: 'yin-yang-check-shirt-womens',
    tags: ['winter-arc', 'catalog', 'womens'],
  },
  {
    id: 7,
    name: 'OCEAN BREEZE BLUE CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 21,
    description: 'Captures the calm sophistication of coastal hues. Crafted from exquisitely soft, premium cotton, its serene blue checks offer a fresh yet timeless appeal.',
    image: PRODUCT_IMAGES.shirt2,
    hoverImage: PRODUCT_IMAGES.shirt1,
    gallery: GALLERY_IMAGES.shirts,
    slug: 'ocean-breeze-blue-check-shirt-womens',
    tags: ['winter-arc', 'catalog', 'womens'],
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
    description: 'Crafted from exceptionally soft, resilient French terry, designed for a fluid, drop-shoulder drape. Its commanding eagle motif contrasts elegantly with the subtly distressed waist hem.',
    image: PRODUCT_IMAGES.vest1,
    hoverImage: PRODUCT_IMAGES.shirt1,
    gallery: GALLERY_IMAGES.vests,
    slug: 'hawk-eye-grey-vest',
    tags: ['winter-arc', 'latest-drop', 'mens'],
  },
  {
    id: 9,
    name: 'OCEAN BREEZE BLUE CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 27,
    description: 'Captures the calm sophistication of coastal hues. Crafted from exquisitely soft, premium cotton, its serene blue checks offer a fresh yet timeless appeal.',
    image: PRODUCT_IMAGES.shirt3,
    hoverImage: PRODUCT_IMAGES.shirt4,
    gallery: GALLERY_IMAGES.shirts,
    slug: 'ocean-breeze-blue-check-shirt-mens',
    tags: ['winter-arc', 'catalog', 'mens'],
  },
  {
    id: 10,
    name: 'YIN YANG CHECK SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 25,
    description: 'Reimagines classic checks with poised sophistication. Crafted from luxurious, finely woven cotton, its black-and-white palette creates a striking harmony of contrasts.',
    image: PRODUCT_IMAGES.shirt4,
    hoverImage: PRODUCT_IMAGES.shirt3,
    gallery: GALLERY_IMAGES.shirts,
    slug: 'yin-yang-check-shirt-mens',
    tags: ['winter-arc', 'catalog', 'mens'],
  },
  {
    id: 11,
    name: 'SHADOW OF LOUVE SWEATPANTS',
    price: 8995,
    category: 'SWEATPANTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 29,
    description: 'Reinterprets casual wear through a refined blend of sleek faux leather and tailored cotton twill. With a sculpted fit and a soft, elevated finish.',
    image: PRODUCT_IMAGES.sweatpants2,
    hoverImage: PRODUCT_IMAGES.sweatpants1,
    gallery: GALLERY_IMAGES.sweatpants,
    slug: 'shadow-of-louve-sweatpants-mens',
    tags: ['winter-arc', 'latest-drop', 'mens'],
  },
  {
    id: 12,
    name: 'THE OUTLAW CREW VARSITY JACKET',
    price: 12995,
    category: 'JACKETS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 19,
    description: 'Merges elevated street style with meticulous craftsmanship. Premium cotton twill, a warm polyfil layer, and a refined taffeta lining ensure comfort and structure.',
    image: PRODUCT_IMAGES.jacket3,
    hoverImage: PRODUCT_IMAGES.jacket1,
    gallery: GALLERY_IMAGES.jacket,
    slug: 'the-outlaw-crew-varsity-jacket-mens',
    tags: ['winter-arc', 'latest-drop', 'mens'],
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

