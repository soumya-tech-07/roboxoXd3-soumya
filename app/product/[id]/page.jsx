'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ensurePublicImageUrl } from '@/lib/image-helpers';
import SizeGuideModal from '../../components/SizeguideModal';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
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
  const [dbProduct, setDbProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const productIdentifier = useMemo(() => {
    const value = Array.isArray(params?.id) ? params?.id[0] : params?.id;
    return value ?? '';
  }, [params]);

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productIdentifier) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Try to fetch by slug first, then by ID
        let query = supabase
          .from('products')
          .select('*')
          .eq('slug', productIdentifier)
          .eq('is_active', true)
          .single();

        let { data, error } = await query;

        // If not found by slug, try by ID
        if (error && error.code === 'PGRST116') {
          const id = parseInt(productIdentifier);
          if (!isNaN(id)) {
            query = supabase
              .from('products')
              .select('*')
              .eq('id', id)
              .eq('is_active', true)
              .single();
            
            const result = await query;
            data = result.data;
            error = result.error;
          }
        }

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching product:', error);
        }

        setDbProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productIdentifier]);

  // Use database product (Supabase) - fallback to static catalog only if not found
  const catalogProduct = dbProduct || 
    getProductBySlug(productIdentifier) ||
    PRODUCT_CATALOG.find(
      (item) => String(item.id) === String(productIdentifier),
    );

  const derivedProduct = useMemo(() => {
    if (!catalogProduct) return null;

    // Use database product if available (has Supabase URLs), otherwise use catalog
    const isDbProduct = !!dbProduct;
    
    let gallery = [];
    if (isDbProduct) {
      // Use gallery from database (Supabase URLs)
      gallery = dbProduct.gallery && Array.isArray(dbProduct.gallery) 
        ? dbProduct.gallery
            .filter(url => url && !url.includes('.heic'))
            .map(url => ensurePublicImageUrl(url))
        : [];
      
      // Fallback to main images if gallery is empty
      if (gallery.length === 0) {
        const mainImages = [
          dbProduct.image_url,
          dbProduct.hover_image_url
        ].filter(Boolean).map(url => ensurePublicImageUrl(url));
        gallery = mainImages;
      }
    } else {
      // Use catalog product gallery
      gallery = catalogProduct.gallery?.length
      ? catalogProduct.gallery.map(url => ensurePublicImageUrl(url))
      : Array.from(
          new Set(
            [catalogProduct.image, catalogProduct.hoverImage]
              .filter(Boolean)
              .map(url => ensurePublicImageUrl(url)),
          ),
        );
    }

    const sizes = isDbProduct 
      ? (dbProduct.sizes && Array.isArray(dbProduct.sizes) ? dbProduct.sizes : ['S', 'M', 'L', 'XL'])
      : (catalogProduct.size?.length ? catalogProduct.size : ['S', 'M', 'L', 'XL']);

    return {
      name: catalogProduct.name,
      price: `₹ ${Number(catalogProduct.price).toLocaleString('en-IN')}`,
      sku:
        catalogProduct.sku ??
        `RL-${String(catalogProduct.id).padStart(4, '0')}`,
      images: gallery.length
        ? gallery
        : ['https://placehold.co/800x1200/e5d4e8/666666?text=Image'],
      sizes,
      description:
        catalogProduct.description ||
        'Premium garment crafted for comfort and durability.',
      category: catalogProduct.category ?? 'APPAREL',
      materials: isDbProduct 
        ? (dbProduct.materials && Array.isArray(dbProduct.materials) ? dbProduct.materials : [])
        : (catalogProduct.materials || []),
      composition: catalogProduct.composition || '',
      care: catalogProduct.care || '',
      origin: catalogProduct.origin || '',
      modelInfo: catalogProduct.modelInfo || { size: '', height: '' },
    };
  }, [catalogProduct, dbProduct]);

  const [selectedSize, setSelectedSize] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, openCart, loading: cartLoading } = useCart();
  const { showError } = useToast();

  const isWishlisted = catalogProduct ? isInWishlist(catalogProduct.id) : false;

  const handleAddToCart = () => {
    if (!catalogProduct || !derivedProduct) return;

    // Prevent clicks while loading
    if (cartLoading) {
      showError('Please wait...');
      return;
    }

    if (!selectedSize && derivedProduct.sizes.length > 0) {
      showError('Please select a size');
      return;
    }

    addToCart(catalogProduct.id, selectedSize || null, 1);
  };

  const handleBuyNow = async () => {
    if (!catalogProduct || !derivedProduct) return;

    // Prevent clicks while loading
    if (cartLoading) {
      showError('Please wait...');
      return;
    }

    if (!selectedSize && derivedProduct.sizes.length > 0) {
      showError('Please select a size');
      return;
    }

    // Add to cart and open cart sidebar
    const result = await addToCart(catalogProduct.id, selectedSize || null, 1);
    
    // Open cart sidebar after successful add
    if (result?.success) {
      setTimeout(() => {
        openCart();
      }, 500);
    }
  };

  const handleWishlistToggle = () => {
    if (!catalogProduct) return;

    // Prevent clicks while loading
    if (wishlistLoading) {
      showError('Please wait...');
      return;
    }

    toggleWishlist(catalogProduct.id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

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
        productCategory={catalogProduct?.category || product.category}
      />

      <ProductBreadcrumb />

      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Side - Image Gallery */}
          <ProductImageGallery
            images={product.images}
            productName={product.name}
          />

          {/* Right Side - Product Info */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <ProductInfo
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
                onWishlistToggle={handleWishlistToggle}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                disabled={cartLoading || wishlistLoading}
              />
            </div>

            <ProductAccordion product={catalogProduct} />
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
