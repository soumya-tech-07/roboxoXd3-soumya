'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import SizeGuideModal from '../../components/SizeguideModal';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import {
  PRODUCT_CATALOG,
  getProductBySlug,
} from '../../components/ProductCatalog';
import RelatedProducts from '../components/RelatedProducts';
import ProductBreadcrumb from '../components/ProductBreadcrumb';
import ProductNotFound from '../components/ProductNotFound';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductSizeSelector from '../components/ProductSizeSelector';
import ProductActionButtons from '../components/ProductActionButtons';
import ProductAccordion from '../components/ProductAccordion';
import ProductShareContact from '../components/ProductShareContact';

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
      category: catalogProduct.category ?? 'APPAREL',
    };
  }, [catalogProduct]);

  const [selectedSize, setSelectedSize] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const isWishlisted = catalogProduct ? isInWishlist(catalogProduct.id) : false;

  const handleAddToCart = () => {
    if (!catalogProduct || !derivedProduct) return;

    if (!selectedSize && derivedProduct.sizes.length > 0) {
      alert('Please select a size');
      return;
    }

    addToCart(catalogProduct.id, selectedSize || null, 1);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // TODO: Navigate to checkout page
  };

  if (!derivedProduct) {
    return <ProductNotFound />;
  }

  const product = derivedProduct;

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40">
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productName={product.name}
      />

      <ProductBreadcrumb />

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Image Gallery */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
            badge={product.badge}
          />

          {/* Right Side - Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductInfo
              badge={product.badge}
              name={product.name}
              price={product.price}
              description={product.description}
              sku={product.sku}
            />

            <div className="border-t border-gray-200 pt-6 mb-6">
              <ProductSizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSizeSelect={setSelectedSize}
                onSizeGuideOpen={() => setIsSizeGuideOpen(true)}
              />

              <ProductActionButtons
                isWishlisted={isWishlisted}
                onWishlistToggle={() =>
                  catalogProduct && toggleWishlist(catalogProduct.id)
                }
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>

            <ProductAccordion />
            <ProductShareContact />
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts
          currentProductId={catalogProduct?.id}
          category={product.category}
        />
      </div>
    </div>
  );
}
