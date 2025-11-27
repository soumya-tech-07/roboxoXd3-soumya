'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SizeGuideModal from '../../components/SizeguideModal';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import {
  PRODUCT_CATALOG,
  getProductBySlug,
} from '../../components/ProductCatalog';

const PLACEHOLDER_ICON = 'https://placehold.co/100x100/e5d4e8/666666?text=Icon';

export default function ProductPage() {
  const params = useParams();
  const productIdentifier = useMemo(() => {
    const value = Array.isArray(params?.id) ? params?.id[0] : params?.id;
    return value ?? '';
  }, [params]);

  const catalogProduct =
    getProductBySlug(productIdentifier) ||
    PRODUCT_CATALOG.find(
      (item) => String(item.id) === String(productIdentifier),
    );

  const derivedProduct = useMemo(() => {
    if (!catalogProduct) return null;

    const gallery = catalogProduct.gallery?.length
      ? catalogProduct.gallery
      : Array.from(
          new Set(
            [catalogProduct.image, catalogProduct.hoverImage].filter(Boolean),
          ),
        );

    const sizes = catalogProduct.size?.length
      ? catalogProduct.size
      : ['S', 'M', 'L', 'XL'];

    const badge = catalogProduct.tags?.includes('latest-drop')
      ? 'NEW'
      : catalogProduct.tags?.includes('core-collection')
        ? 'CORE'
        : null;

    const characteristicsSource = (catalogProduct.tags || []).slice(0, 3);
    const characteristics =
      characteristicsSource.length > 0
        ? characteristicsSource.map((tag) => ({
            title: tag.replace(/-/g, ' ').toUpperCase(),
            image: PLACEHOLDER_ICON,
          }))
        : [
            {
              title: catalogProduct.category?.toUpperCase() ?? 'DETAILS',
              image: PLACEHOLDER_ICON,
            },
          ];

    return {
      name: catalogProduct.name,
      price: `₹ ${catalogProduct.price.toLocaleString('en-IN')}`,
      sku:
        catalogProduct.sku ??
        `RL-${String(catalogProduct.id).padStart(4, '0')}`,
      badge,
      images: gallery.length
        ? gallery
        : ['https://placehold.co/800x1200/e5d4e8/666666?text=Image'],
      sizes,
      description:
        catalogProduct.description ||
        'Premium garment crafted for comfort and durability.',
      fullDescription:
        catalogProduct.fullDescription ||
        `${catalogProduct.description}\n\nCrafted with meticulous attention to detail for everyday wear.`,
      characteristics,
      availability: catalogProduct.availability ?? 'IN STOCK',
      stock: catalogProduct.stock ?? 0,
      category: catalogProduct.category ?? 'APPAREL',
    };
  }, [catalogProduct]);

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState('');
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  
  const isWishlisted = catalogProduct ? isInWishlist(catalogProduct.id) : false;

  const handleAddToCart = () => {
    if (!catalogProduct || !derivedProduct) return;
    
    if (!selectedSize && derivedProduct.sizes.length > 0) {
      alert('Please select a size');
      return;
    }

    addToCart(catalogProduct.id, selectedSize || null, quantity);
    // Optional: Show success message or redirect to cart
  };

  if (!derivedProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
        <div>
          <p className="text-[10px] tracking-[0.18em] text-gray-500 mb-2">
            PRODUCT
          </p>
          <h1 className="text-2xl font-semibold mb-4">Item not found</h1>
          <p className="text-sm text-gray-600 mb-6">
            The product you are looking for is unavailable or no longer exists.
          </p>
          <Link
            href="/new-in"
            className="inline-flex items-center justify-center px-6 py-3 border border-brand text-brand tracking-[0.2em] text-xs hover:bg-brand hover:text-white transition-colors"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  const product = derivedProduct;

  const accordionSections = [
    { id: 'characteristics', title: 'CHARACTERISTICS' },
    { id: 'measurements', title: 'PRODUCT MEASUREMENTS' },
    { id: 'composition', title: 'COMPOSITION, CARE & ORIGIN' },
    { id: 'availability', title: 'CHECK IN-STORE AVAILABILITY' },
    { id: 'shipping', title: 'SHIPPING, EXCHANGES AND RETURNS' },
  ];

  return (
    <div className="min-h-screen bg-white pt-20 md:pt-24">
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productName={product.name}
        productImage={
          product.images?.[selectedImage] ?? product.images?.[0] ?? undefined
        }
      />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 py-4 mb-4">
          <Link href="/" className="hover:text-black transition-colors">HOME</Link>
          <span className="mx-2">/</span>
          <Link href="/apparel" className="hover:text-black transition-colors">APPAREL</Link>
          <span className="mx-2">/</span>
          <span className="text-black">{product.category}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 lg:gap-12 pb-16">
          {/* Left Side - Images with Vertical Thumbnails */}
          <div className="flex gap-4">
            {/* Vertical Thumbnails */}
            <div className="hidden lg:flex flex-col gap-2 shrink-0">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-20 bg-gray-100 overflow-hidden border transition-all ${
                    selectedImage === index
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Product ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative w-full aspect-2/3 bg-gray-50 overflow-hidden flex-1">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain"
                priority
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-white px-3 py-1 text-[10px] font-medium tracking-wider uppercase">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Thumbnails */}
          <div className="lg:hidden grid grid-cols-4 gap-2 mt-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative aspect-2/3 bg-gray-100 overflow-hidden border transition-all ${
                  selectedImage === index
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <Image
                  src={image}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Right Side - Product Info (Sticky) */}
          <div className="lg:sticky lg:top-20 lg:self-start lg:h-screen lg:overflow-y-auto">
            <div className="pb-8">
              {/* Product Title & Price */}
              <div className="mb-6">
                <h1 className="text-xl md:text-2xl font-normal text-gray-900 mb-3 leading-tight">
                  {product.name}
                </h1>
                <p className="text-lg font-normal text-gray-900 mb-1">{product.price}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                  {product.sku}
                </p>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs uppercase tracking-wider text-gray-900 font-medium">
                    Size
                  </label>
                  <button
                    type="button"
                    className="text-xs text-gray-900 underline hover:no-underline transition-all"
                    onClick={() => setIsSizeGuideOpen(true)}
                  >
                    Size guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 text-sm border transition-all font-light ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black text-gray-900'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <p className="text-xs text-gray-600 mb-4">
                    Selected size: <span className="font-medium">{selectedSize}</span>
                  </p>
                )}
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!selectedSize && product.sizes.length > 0}
                className={`w-full py-4 text-sm uppercase tracking-wider font-medium transition-all mb-3 ${
                  !selectedSize && product.sizes.length > 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                Add to bag
              </button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => catalogProduct && toggleWishlist(catalogProduct.id)}
                className="w-full py-3 border border-gray-300 text-sm uppercase tracking-wider font-medium text-gray-900 hover:border-black transition-all flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill={isWishlisted ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              </button>
            </div>

            {/* Product Description */}
            <div className="border-t border-gray-200 pt-6 mb-6">
              <p className="text-base leading-7 text-gray-900">
                {showFullDescription ? product.fullDescription : product.description}
              </p>
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-xs underline hover:no-underline mt-2 text-gray-900"
              >
                {showFullDescription ? 'View less' : 'View more'}
              </button>
            </div>

            {/* Accordion Sections */}
            <div className="border-t border-gray-200">
              {accordionSections.map((section) => (
                <div key={section.id} className="border-b border-gray-200">
                  <button
                    onClick={() =>
                      setOpenAccordion(openAccordion === section.id ? '' : section.id)
                    }
                    className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs tracking-wider font-medium text-gray-900">
                      {section.title}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        openAccordion === section.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {openAccordion === section.id && (
                    <div className="pb-4 px-4">
                      {section.id === 'characteristics' && (
                        <div className="grid grid-cols-3 gap-4">
                          {product.characteristics.map((char, index) => (
                            <div key={index} className="text-center">
                              <div className="relative w-20 h-20 mx-auto mb-2 bg-gray-100">
                                <Image
                                  src={char.image}
                                  alt={char.title}
                                  fill
                                  className="object-contain p-2"
                                />
                              </div>
                              <p className="text-xs text-gray-900">{char.title}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.id === 'measurements' && (
                        <div className="text-sm text-gray-900 space-y-2">
                          <p>Model is wearing size: M</p>
                          <p>Model height: 175 cm / 5&apos;9&quot;</p>
                        </div>
                      )}

                      {section.id === 'composition' && (
                        <div className="text-sm text-gray-900 space-y-2">
                          <p><strong>Composition:</strong> 100% Polyester</p>
                          <p><strong>Care:</strong> Machine wash cold</p>
                          <p><strong>Origin:</strong> Made in India</p>
                        </div>
                      )}

                      {section.id === 'availability' && (
                        <div className="text-sm text-gray-900">
                          <p className="mb-3">
                            Check if this item is available in your nearest store
                          </p>
                          <button className="text-xs underline hover:no-underline">
                            FIND STORES
                          </button>
                        </div>
                      )}

                      {section.id === 'shipping' && (
                        <div className="text-sm text-gray-900 space-y-2">
                          <p>Free shipping on orders above ₹2999</p>
                          <p>Easy returns within 30 days</p>
                          <p>Standard delivery: 5-7 business days</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Share & Contact */}
            <div className="mt-6 flex items-center gap-6 text-xs text-gray-900">
              <button className="flex items-center gap-2 hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                SHARE
              </button>
              <button className="flex items-center gap-2 hover:underline">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}