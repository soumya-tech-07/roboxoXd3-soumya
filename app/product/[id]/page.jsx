'use client';

import { useMemo, useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { ensurePublicImageUrl } from '@/lib/image-helpers';
import SizeGuideModal from '../../components/SizeguideModal';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import RelatedProducts from '../components/RelatedProducts';
import ProductBreadcrumb from '../components/ProductBreadcrumb';
import ProductNotFound from '../components/ProductNotFound';
import ProductImageGallery from '../components/ProductImageGallery';
import ProductInfo from '../components/ProductInfo';
import ProductSizeSelector from '../components/ProductSizeSelector';
import ProductActionButtons from '../components/ProductActionButtons';
import ProductAccordion from '../components/ProductAccordion';
import ProductShareContact from '../components/ProductShareContact';

const supabase = createClient();

const PLACEHOLDER_ICON = 'https://placehold.co/100x100/e5d4e8/666666?text=Icon';

export default function ProductPage() {
  const params = useParams();
  const [dbProduct, setDbProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const productIdentifier = useMemo(() => {
    const value = Array.isArray(params?.id) ? params?.id[0] : params?.id;
    return value ?? '';
  }, [params]);

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productIdentifier) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      try {
        setLoading(true);
        setNotFound(false);
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

        if (error && error.code === 'PGRST116') {
          setDbProduct(null);
          setNotFound(true);
          return;
        }

        if (error) {
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

  const derivedProduct = useMemo(() => {
    // IMPORTANT: No static ProductCatalog fallback (can show stale prices).
    if (!dbProduct) return null;
    
    let gallery = [];
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

    const sizes =
      dbProduct.sizes && Array.isArray(dbProduct.sizes) ? dbProduct.sizes : ['S', 'M', 'L', 'XL'];

    return {
      name: dbProduct.name,
      price: `₹ ${Number(dbProduct.price).toLocaleString('en-IN')}`,
      sku:
        dbProduct.sku ??
        `RL-${String(dbProduct.id).padStart(4, '0')}`,
      images: gallery.length
        ? gallery
        : ['https://placehold.co/800x1200/e5d4e8/666666?text=Image'],
      sizes,
      description:
        dbProduct.description ||
        'Premium garment crafted for comfort and durability.',
      category: dbProduct.category ?? 'APPAREL',
      materials:
        dbProduct.materials && Array.isArray(dbProduct.materials) ? dbProduct.materials : [],
      composition: dbProduct.composition || '',
      care: dbProduct.care || '',
      origin: dbProduct.origin || '',
      modelInfo: { size: dbProduct.model_size || '', height: dbProduct.model_height || '' },
    };
  }, [dbProduct]);

  const [selectedSize, setSelectedSize] = useState('');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const { isInWishlist, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const { addToCart, openCart, loading: cartLoading } = useCart();
  const { showError } = useToast();

  const isWishlisted = dbProduct ? isInWishlist(dbProduct.id) : false;

  const handleAddToCart = () => {
    if (!dbProduct || !derivedProduct) return;

    // Prevent clicks while loading
    if (cartLoading) {
      showError('Please wait...');
      return;
    }

    if (!selectedSize && derivedProduct.sizes.length > 0) {
      showError('Please select a size');
      return;
    }

    addToCart(dbProduct.id, selectedSize || null, 1);
  };

  const handleBuyNow = async () => {
    if (!dbProduct || !derivedProduct) return;

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
    const result = await addToCart(dbProduct.id, selectedSize || null, 1);
    
    // Open cart sidebar after successful add
    if (result?.success) {
      setTimeout(() => {
        openCart();
      }, 500);
    }
  };

  const handleWishlistToggle = () => {
    if (!dbProduct) return;

    // Prevent clicks while loading
    if (wishlistLoading) {
      showError('Please wait...');
      return;
    }

    toggleWishlist(dbProduct.id);
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
        productCategory={product.category}
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

            <ProductShareContact />
          </div>
        </div>

        {/* Related Products Section */}
        <RelatedProducts
          currentProductId={dbProduct?.id}
          category={product.category}
        />
      </div>
    </div>
  );
}
