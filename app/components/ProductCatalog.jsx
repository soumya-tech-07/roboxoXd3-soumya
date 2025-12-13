import Image from 'next/image';

const defaultHover = (img) => `${img}&auto=format`;

const FALLBACK_GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
  'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
  'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
  'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
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
  {
    id: 1,
    name: 'COTTON ESSENTIAL TEE',
    price: 2495,
    category: 'T-SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 42,
    description: 'Ultra-light cotton tee with a sleek modern cut.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
    ],
    slug: 'cotton-essential-tee',
    tags: ['latest-drop', 'catalog'],
  },
  {
    id: 122,
    name: 'COTTON ESSENTIAL TEE',
    price: 2495,
    category: 'T-SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 42,
    description: 'Ultra-light cotton tee with a sleek modern cut.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
    ],
    slug: 'cotton-essential-tee',
    tags: ['latest-drop', 'catalog'],
  },
  {
    id: 133,
    name: 'COTTON ESSENTIAL TEE',
    price: 2495,
    category: 'T-SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 42,
    description: 'Ultra-light cotton tee with a sleek modern cut.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
    ],
    slug: 'cotton-essential-tee',
    tags: ['latest-drop', 'catalog'],
  },
  {
    id: 155,
    name: 'COTTON ESSENTIAL TEE',
    price: 2495,
    category: 'T-SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 42,
    description: 'Ultra-light cotton tee with a sleek modern cut.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
    ],
    slug: 'cotton-essential-tee',
    tags: ['latest-drop', 'catalog'],
  },

  {
    id: 2,
    name: 'VINTAGE BLACK TEE',
    price: 3195,
    category: 'T-SHIRTS',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 18,
    description: 'Vintage washed tee with tonal graphics.',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
    gallery: [
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=90',
    ],
    slug: 'vintage-black-tee',
    tags: ['core-collection', 'catalog'],
  },
  {
    id: 3,
    name: 'SLIM FIT COTTON TEE',
    price: 2795,
    category: 'T-SHIRTS',
    size: ['XS', 'S', 'M', 'L'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Tailored slim-fit tee in brushed cotton.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90'),
    gallery: [
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=800&h=1000&fit=crop&q=90',
    ],
    slug: 'slim-fit-cotton-tee',
    tags: ['catalog'],
  },
  {
    id: 4,
    name: 'PREMIUM ORGANIC TEE',
    price: 3995,
    category: 'T-SHIRTS',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 35,
    description: 'Organic cotton tee with reinforced seams.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90'),
    gallery: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
      'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&h=1000&fit=crop&q=90',
    ],
    slug: 'premium-organic-tee',
    tags: ['catalog'],
  },
  {
    id: 5,
    name: 'OVERSIZED COMFORT TEE',
    price: 3395,
    category: 'T-SHIRTS',
    size: ['M', 'L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 27,
    description: 'Relaxed oversized tee with drop shoulders.',
    image: 'https://images.unsplash.com/photo-1503341338985-b0475d5a0c4e?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1503341338985-b0475d5a0c4e?w=800&h=1000&fit=crop&q=90'),
    slug: 'oversized-comfort-tee',
    tags: ['catalog'],
  },
  {
    id: 6,
    name: 'CLASSIC BOMBER JACKET',
    price: 17995,
    category: 'JACKETS',
    size: ['M', 'L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 14,
    description: 'Heritage bomber with premium hardware.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=1000&fit=crop&q=90',
    slug: 'classic-bomber-jacket',
    tags: ['latest-drop', 'outerwear'],
  },
  {
    id: 7,
    name: 'VINTAGE DENIM JACKET',
    price: 15995,
    category: 'JACKETS',
    size: ['S', 'M', 'L'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Washed denim jacket with distressed finish.',
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=90',
    slug: 'vintage-denim-jacket',
    tags: ['core-collection', 'outerwear'],
  },
  {
    id: 8,
    name: 'TACTICAL FIELD JACKET',
    price: 21995,
    category: 'JACKETS',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 11,
    description: 'Utility field jacket with multi-pocket storage.',
    image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800&h=1000&fit=crop&q=90'),
    slug: 'tactical-field-jacket',
    tags: ['outerwear', 'catalog'],
  },
  {
    id: 9,
    name: 'GENUINE LEATHER JACKET',
    price: 26995,
    category: 'JACKETS',
    size: ['L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 9,
    description: 'Full-grain leather biker silhouette.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&q=90'),
    slug: 'genuine-leather-jacket',
    tags: ['outerwear', 'catalog'],
  },
  {
    id: 10,
    name: 'FORMAL DRESS SHIRT',
    price: 4795,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 24,
    description: 'Crisp formal shirt with sateen finish.',
    image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e0c6?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1624378515193-9e09c4e5e5c1?w=800&h=1000&fit=crop&q=90',
    slug: 'formal-dress-shirt',
    tags: ['core-collection', 'catalog'],
  },
  {
    id: 11,
    name: 'OXFORD BUTTON DOWN',
    price: 5195,
    category: 'SHIRTS',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 20,
    description: 'Classic Oxford weave with button-down collar.',
    image: 'https://images.unsplash.com/photo-1624378515193-9e09c4e5e5c1?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1624378515193-9e09c4e5e5c1?w=800&h=1000&fit=crop&q=90'),
    slug: 'oxford-button-down',
    tags: ['catalog'],
  },
  {
    id: 12,
    name: 'CASUAL STRIPED SHIRT',
    price: 4595,
    category: 'SHIRTS',
    size: ['XS', 'S', 'M'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Striped casual shirt with relaxed drape.',
    image: 'https://images.unsplash.com/photo-1594938291221-94f313b0e0c6?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1594938291221-94f313b0e0c6?w=800&h=1000&fit=crop&q=90'),
    slug: 'casual-striped-shirt',
    tags: ['catalog'],
  },
  {
    id: 13,
    name: 'LINEN RELAXED SHIRT',
    price: 5495,
    category: 'SHIRTS',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 16,
    description: 'Lightweight linen shirt ideal for resort looks.',
    image: 'https://images.unsplash.com/photo-1624378515193-9e09c4e5e5c1?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1624378515193-9e09c4e5e5c1?w=800&h=1000&fit=crop&q=90'),
    slug: 'linen-relaxed-shirt',
    tags: ['catalog'],
  },
  {
    id: 14,
    name: 'CLASSIC FIT POLO',
    price: 4295,
    category: 'POLOS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 30,
    description: 'Piqué knit polo with embroidered monogram.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    slug: 'classic-fit-polo',
    tags: ['core-collection', 'catalog'],
  },
  {
    id: 15,
    name: 'PREMIUM PIMA POLO',
    price: 4995,
    category: 'POLOS',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 22,
    description: 'Pima cotton polo with luxe hand-feel.',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90'),
    slug: 'premium-pima-polo',
    tags: ['catalog'],
  },
  {
    id: 16,
    name: 'PERFORMANCE POLO',
    price: 4695,
    category: 'POLOS',
    size: ['XS', 'S', 'M', 'L'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Moisture-wicking polo built for motion.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90'),
    slug: 'performance-polo',
    tags: ['catalog'],
  },
  {
    id: 17,
    name: 'SLIM STRAIGHT JEANS',
    price: 7495,
    category: 'JEANS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 40,
    description: 'Indigo denim with slight stretch.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    slug: 'slim-straight-jeans',
    tags: ['core-collection', 'denim'],
  },
  {
    id: 18,
    name: 'BLACK DENIM JEANS',
    price: 8195,
    category: 'JEANS',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 21,
    description: 'Clean black denim with matte hardware.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90'),
    slug: 'black-denim-jeans',
    tags: ['denim', 'catalog'],
  },
  {
    id: 19,
    name: 'VINTAGE WASH JEANS',
    price: 7695,
    category: 'JEANS',
    size: ['XS', 'S', 'M', 'L', 'XL'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Vintage wash with subtle fading.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90'),
    slug: 'vintage-wash-jeans',
    tags: ['denim', 'catalog'],
  },
  {
    id: 20,
    name: 'DARK WASH JEANS',
    price: 8795,
    category: 'JEANS',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 19,
    description: 'Dark rinse denim with sharp lines.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90'),
    slug: 'dark-wash-jeans',
    tags: ['denim', 'catalog'],
  },
  {
    id: 21,
    name: 'CLASSIC CHINO PANTS',
    price: 6795,
    category: 'PANTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 33,
    description: 'Tailored chinos with stretch twill.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    slug: 'classic-chino-pants',
    tags: ['core-collection', 'catalog'],
  },
  {
    id: 22,
    name: 'UTILITY CARGO PANTS',
    price: 7295,
    category: 'PANTS',
    size: ['XS', 'S', 'M'],
    availability: 'IN STOCK',
    stock: 17,
    description: 'Cargo pants with articulated knees.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90'),
    slug: 'utility-cargo-pants',
    tags: ['catalog'],
  },
  {
    id: 23,
    name: 'FORMAL TROUSER PANTS',
    price: 7895,
    category: 'PANTS',
    size: ['L', 'XL', 'XXL'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Formal trousers with crease retention.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90'),
    slug: 'formal-trouser-pants',
    tags: ['catalog'],
  },
  {
    id: 24,
    name: 'SLIM FIT DRESS PANTS',
    price: 8395,
    category: 'PANTS',
    size: ['M', 'L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 15,
    description: 'Streamlined dress pants for tailored looks.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90'),
    slug: 'slim-fit-dress-pants',
    tags: ['catalog'],
  },
  {
    id: 25,
    name: 'CARGO UTILITY SHORTS',
    price: 4795,
    category: 'SHORTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 28,
    description: 'Durable cargo shorts with deep pockets.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90'),
    slug: 'cargo-utility-shorts',
    tags: ['catalog'],
  },
  {
    id: 26,
    name: 'CHINO CLASSIC SHORTS',
    price: 4295,
    category: 'SHORTS',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 19,
    description: 'Clean chino shorts with 8" inseam.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90'),
    slug: 'chino-classic-shorts',
    tags: ['catalog'],
  },

  {
    id: 27,
    name: 'BEACH SWIM SHORTS',
    price: 3795,
    category: 'SHORTS',
    size: ['S', 'M', 'L', 'XL', 'XXL'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Quick-dry swim shorts with mesh lining.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90'),
    slug: 'beach-swim-shorts',
    tags: ['catalog'],
  },
  {
    id: 28,
    name: 'TACTICAL UTILITY CARGO',
    price: 8795,
    category: 'CARGOS',
    size: ['M', 'L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 23,
    description: 'Reinforced cargo pants for everyday ventures.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90'),
    slug: 'tactical-utility-cargo',
    tags: ['catalog'],
  },
  {
    id: 29,
    name: 'MILITARY STYLE CARGO',
    price: 9195,
    category: 'CARGOS',
    size: ['XS', 'S', 'M'],
    availability: 'IN STOCK',
    stock: 13,
    description: 'Military-inspired cargo with tapered leg.',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&h=1000&fit=crop&q=90'),
    slug: 'military-style-cargo',
    tags: ['catalog'],
  },
  {
    id: 30,
    name: 'URBAN CARGO PANTS',
    price: 8595,
    category: 'CARGOS',
    size: ['L', 'XL'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Urban tapered cargo with reflective trims.',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=1000&fit=crop&q=90'),
    slug: 'urban-cargo-pants',
    tags: ['catalog'],
  },
  {
    id: 31,
    name: 'ATHLETIC PERFORMANCE JERSEY',
    price: 5795,
    category: 'JERSEY',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 26,
    description: 'Breathable athletic jersey for training days.',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=1000&fit=crop&q=90'),
    slug: 'athletic-performance-jersey',
    tags: ['catalog'],
  },
  {
    id: 32,
    name: 'SPORT MESH JERSEY',
    price: 5295,
    category: 'JERSEY',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 18,
    description: 'Mesh jersey with moisture control panels.',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=1000&fit=crop&q=90'),
    slug: 'sport-mesh-jersey',
    tags: ['catalog'],
  },
  {
    id: 33,
    name: 'TRAINING JERSEY',
    price: 6095,
    category: 'JERSEY',
    size: ['XS', 'S', 'M', 'L'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Stretch jersey tuned for high-impact workouts.',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=1000&fit=crop&q=90'),
    slug: 'training-jersey',
    tags: ['catalog'],
  },
  {
    id: 34,
    name: 'PREMIUM ZIP HOODIE',
    price: 12995,
    category: 'HOODIES',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 32,
    description: 'Heavyweight zip hoodie with brushed interior.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
    slug: 'premium-zip-hoodie',
    tags: ['latest-drop', 'knits'],
  },
  {
    id: 35,
    name: 'OVERSIZED HOODIE',
    price: 11995,
    category: 'HOODIES',
    size: ['M', 'L', 'XL', 'XXL'],
    availability: 'IN STOCK',
    stock: 25,
    description: 'Oversized hoodie with tonal embroidery.',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop&q=90'),
    slug: 'oversized-hoodie',
    tags: ['catalog'],
  },
  {
    id: 36,
    name: 'FLEECE HOODIE',
    price: 13995,
    category: 'HOODIES',
    size: ['XS', 'S', 'M', 'L'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Plush fleece hoodie for winter layering.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=1000&fit=crop&q=90'),
    slug: 'fleece-hoodie',
    tags: ['catalog'],
  },
  {
    id: 37,
    name: 'PULLOVER HOODIE',
    price: 10995,
    category: 'HOODIES',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 29,
    description: 'Classic pullover hoodie with kangaroo pocket.',
    image: 'https://images.unsplash.com/photo-1602810318691-0b8e4af75b4c?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1602810318691-0b8e4af75b4c?w=800&h=1000&fit=crop&q=90'),
    slug: 'pullover-hoodie',
    tags: ['catalog'],
  },
  {
    id: 38,
    name: 'CLASSIC CREW SWEATSHIRT',
    price: 8995,
    category: 'SWEATSHIRTS',
    size: ['M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 31,
    description: 'Crew sweatshirt with premium loopback fleece.',
    image: 'https://images.unsplash.com/photo-1521223890152-f405c10c5f92?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop&q=90',
    slug: 'classic-crew-sweatshirt',
    tags: ['latest-drop', 'knits'],
  },
  {
    id: 39,
    name: 'PREMIUM SWEATSHIRT',
    price: 10495,
    category: 'SWEATSHIRTS',
    size: ['S', 'M', 'L', 'XL'],
    availability: 'IN STOCK',
    stock: 22,
    description: 'Structured sweatshirt with tonal branding.',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop&q=90',
    hoverImage: 'https://images.unsplash.com/photo-1521223890152-f405c10c5f92?w=800&h=1000&fit=crop&q=90',
    slug: 'premium-sweatshirt',
    tags: ['core-collection', 'knits'],
  },
  {
    id: 40,
    name: 'OVERSIZED SWEATSHIRT',
    price: 9495,
    category: 'SWEATSHIRTS',
    size: ['L', 'XL', 'XXL'],
    availability: 'OUT OF STOCK',
    stock: 0,
    description: 'Oversized crew with exaggerated sleeves.',
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=90',
    hoverImage: defaultHover('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&h=1000&fit=crop&q=90'),
    slug: 'oversized-sweatshirt',
    tags: ['catalog'],
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

export const latestDropProductIds = [1, 6, 34, 38];
export const coreCollectionProductIds = [2, 7, 10, 14, 17, 21, 35, 39];

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
            <p className="text-[10px] tracking-[0.18em] text-brand">CATALOG</p>
            <h2 className="text-2xl font-semibold text-gray-900">
              Dummy Product Inventory
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

