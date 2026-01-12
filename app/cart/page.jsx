'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { PRODUCT_CATALOG } from '../components/ProductCatalog';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();

  // Get cart items with product details
  const cartItems = useMemo(() => {
    return cart.map((item) => {
      const product = PRODUCT_CATALOG.find((p) => p.id === item.productId);
      return {
        ...item,
        product,
      };
    }).filter((item) => item.product); // Filter out any items with missing products
  }, [cart]);

  const cartTotal = useMemo(() => {
    return getCartTotal(PRODUCT_CATALOG);
  }, [cart, getCartTotal]);

  const handleQuantityChange = (productId, size, newQuantity) => {
    updateQuantity(productId, size, newQuantity);
  };

  return (
    <div className="min-h-screen bg-white pt-24 sm:pt-32 lg:pt-40 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
            SHOPPING BAG
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 tracking-wide">
            {cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'}
          </p>
        </div>

        {/* Cart Content */}
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size || 'no-size'}-${index}`}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-6 border-b border-gray-200"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    className="relative w-full sm:w-32 h-48 sm:h-40 bg-gray-100 overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 128px"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        className="block mb-2"
                      >
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 uppercase tracking-wide mb-1">
                          {item.product.name}
                        </h3>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          {item.product.category}
                        </p>
                        {item.size && (
                          <p className="text-xs text-gray-500 mt-1">
                            Size: {item.size}
                          </p>
                        )}
                      </Link>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 mt-2">
                        ₹ {item.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-start gap-4 sm:flex-col sm:items-end">
                      <div className="flex items-center border border-gray-300">
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.size,
                              item.quantity - 1
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-4 py-2 text-sm min-w-[3rem] text-black text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              item.size,
                              item.quantity + 1
                            )
                          }
                          className="px-3 py-2 hover:bg-gray-100 text-gray-700 cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-xs text-gray-500 hover:text-brand underline sm:no-underline sm:hover:underline transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-gray-50 p-6 border border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide uppercase">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Subtotal</span>
                    <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Shipping</span>
                    <span className={cartTotal >= 2999 ? 'text-brand' : ''}>
                      {cartTotal >= 2999 ? 'FREE' : '₹ 99'}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 mt-3">
                    <div className="flex justify-between text-base font-semibold text-gray-900">
                      <span>TOTAL</span>
                      <span>
                        ₹{' '}
                        {(cartTotal + (cartTotal >= 2999 ? 0 : 99)).toLocaleString(
                          'en-IN'
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {cartTotal < 2999 && (
                  <p className="text-xs text-gray-600 mb-4 text-center">
                    Add ₹{' '}
                    {(2999 - cartTotal).toLocaleString('en-IN')} more for free
                    shipping
                  </p>
                )}

                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push('/');
                      return;
                    }
                    router.push('/checkout');
                  }}
                  className="w-full py-4 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors mb-3 cursor-pointer"
                >
                  PROCEED TO CHECKOUT
                </button>

                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full py-3 border border-gray-300 text-sm tracking-wide text-gray-700 hover:border-brand hover:text-brand transition-colors cursor-pointer"
                >
                  CLEAR CART
                </button>

                <Link
                  href="/new-in"
                  className="block text-center text-xs text-gray-600 hover:text-brand mt-4 underline"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16 sm:py-24">
            <div className="max-w-md mx-auto">
              <svg
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">
                YOUR BAG IS EMPTY
              </h2>
              <p className="text-sm text-gray-600 mb-8 tracking-wide">
                Start adding items to your shopping bag
              </p>
              <Link
                href="/new-in"
                className="inline-block px-6 py-3 bg-brand text-white text-xs sm:text-sm tracking-wider hover:bg-brand/90 transition-colors"
              >
                SHOP NOW
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

