'use client';

import { useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function CartSidebar() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    isCartOpen,
    closeCart,
  } = useCart();

  // Close cart sidebar when user logs out or token expires
  useEffect(() => {
    if (!isAuthenticated || !user) {
      closeCart();
    }
  }, [isAuthenticated, user, closeCart]);

  // Cart items already have product data from CartContext
  const cartItems = useMemo(() => {
    return cart.filter((item) => item.product); // Filter out any items with missing products
  }, [cart]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      if (item.product?.price) {
        return total + item.product.price * item.quantity;
      }
      return total;
    }, 0);
  }, [cartItems]);

  // Handle ESC key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, closeCart]);

  const handleQuantityChange = (productId, size, newQuantity) => {
    updateQuantity(productId, size, newQuantity);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ease-out ${
          isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleOverlayClick}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-80 sm:w-96 lg:w-[480px] bg-white z-[101] transform transition-transform duration-300 ease-out shadow-2xl ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto flex flex-col`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-wide uppercase">
              SHOPPING BAG
            </h2>
            <p className="text-xs text-gray-600 tracking-wide mt-1">
              {cartItems.length} {cartItems.length === 1 ? 'ITEM' : 'ITEMS'}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length > 0 ? (
            <div className="p-6 space-y-6">
              {/* Cart Items */}
              {cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${item.size || 'no-size'}-${index}`}
                  className="flex gap-4 pb-6 border-b border-gray-200 last:border-b-0"
                >
                  {/* Product Image */}
                  <Link
                    href={`/product/${item.product.slug}`}
                    onClick={closeCart}
                    className="relative w-24 h-32 sm:w-28 sm:h-36 bg-gray-100 overflow-hidden flex-shrink-0"
                  >
                    <Image
                      src={item.product.image || 'https://placehold.co/800x1200/e5d4e8/666666?text=Image'}
                      alt={item.product.name}
                      fill
                      unoptimized={item.product.image?.startsWith('https://')}
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="112px"
                    />
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex-1">
                      <Link
                        href={`/product/${item.product.slug}`}
                        onClick={closeCart}
                        className="block mb-2"
                      >
                        <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-1 truncate">
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
                      <p className="text-sm font-semibold text-gray-900 mt-2">
                        ₹ {item.product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
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
                        className="text-xs text-gray-500 hover:text-brand underline transition-colors cursor-pointer"
                        aria-label="Remove item"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-300 mb-6"
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
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  YOUR BAG IS EMPTY
                </h2>
                <p className="text-sm text-gray-600 mb-8 tracking-wide">
                  Start adding items to your shopping bag
                </p>
                <button
                  onClick={closeCart}
                  className="inline-block px-6 py-3 bg-brand text-white text-sm tracking-wider hover:bg-brand/90 transition-colors cursor-pointer"
                >
                  CONTINUE SHOPPING
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary - Sticky Footer */}
        {cartItems.length > 0 && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-700 mb-2">
                <span>Subtotal</span>
                <span>₹ {cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700 mb-2">
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
                closeCart();
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
              className="w-full py-3 border border-gray-300 text-sm tracking-wide text-gray-700 hover:border-brand hover:text-brand transition-colors mb-3 cursor-pointer"
            >
              CLEAR CART
            </button>

            <button
              onClick={closeCart}
              className="block w-full text-center text-xs text-gray-600 hover:text-brand underline cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

