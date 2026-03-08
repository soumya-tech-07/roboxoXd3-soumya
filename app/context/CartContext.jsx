'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useAuthModal } from './AuthModalContext';

const supabase = createClient();

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();
  const { openLogin } = useAuthModal();

  // Load cart from Supabase when user is authenticated
  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return;
    
    if (isAuthenticated && user) {
      loadCartFromSupabase();
    } else {
      // IMMEDIATELY clear cart when user logs out or token expires
      setCart([]);
      setIsCartOpen(false); // Also close cart sidebar
    }
  }, [isAuthenticated, user, authLoading]);

  const loadCartFromSupabase = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_cart_with_products', {
        p_user_id: user.id,
      });

      if (error) {
        // Handle 401 errors - session expired
        if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
          console.log('⚠️ Session expired while loading cart');
          setCart([]);
          setIsCartOpen(false);
          showError('Session expired. Please login again');
          openLogin();
          return;
        }
        throw error;
      }

      // Transform to match our cart format
      const transformedCart = data.map((item) => ({
        id: item.cart_item_id,
        productId: item.product_id,
        size: item.size,
        quantity: item.quantity,
        product: {
          name: item.product_name,
          slug: item.product_slug,
          price: item.product_price,
          image: item.product_image,
        },
      }));

      setCart(transformedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      // Clear cart on any error
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, size = null, quantity = 1, maxQuantity = null) => {
    // Wait for auth to be ready
    if (authLoading) {
      showError('Please wait, loading...');
      return { success: false, error: 'Loading' };
    }

    // Check if user is authenticated - STRICT CHECK
    if (!isAuthenticated || !user) {
      showError('Please login to add items to cart');
      openLogin();
      // Clear any stale cart data
      setCart([]);
      return { success: false, error: 'Not authenticated' };
    }

    // Prevent multiple simultaneous requests
    if (loading) {
      return { success: false, error: 'Operation in progress' };
    }

    // Enforce stock limit when maxQuantity is provided
    const existingItem = cart.find(
      (item) => item.productId === productId && item.size === size
    );
    let effectiveQuantity = quantity;
    if (maxQuantity != null && maxQuantity !== undefined) {
      if (maxQuantity <= 0) {
        showError('This size is out of stock');
        return { success: false, error: 'Out of stock' };
      }
      if (existingItem) {
        const newTotal = Math.min(existingItem.quantity + quantity, maxQuantity);
        effectiveQuantity = newTotal - existingItem.quantity;
        if (effectiveQuantity <= 0) {
          showError(`Only ${maxQuantity} left. You already have the maximum in cart.`);
          return { success: false, error: 'Max quantity reached' };
        }
      } else {
        effectiveQuantity = Math.min(quantity, maxQuantity);
      }
    }

    try {
      setLoading(true);

      // Double-check user still exists (in case token expired during operation)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setCart([]);
        setIsCartOpen(false);
        showError('Session expired. Please login again');
        openLogin();
        return { success: false, error: 'Session expired' };
      }

      if (existingItem) {
        // Update quantity (use new total that respects max)
        const newQuantity = maxQuantity != null
          ? Math.min(existingItem.quantity + quantity, maxQuantity)
          : existingItem.quantity + quantity;
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: newQuantity })
          .eq('id', existingItem.id);

        if (error) {
          // Handle 401 errors
          if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
            setCart([]);
            showError('Session expired. Please login again');
            openLogin();
            return { success: false, error: 'Session expired' };
          }
          throw error;
        }
        showSuccess(newQuantity < existingItem.quantity + quantity ? `Only ${maxQuantity} left — cart updated` : 'Cart updated');
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            size: size,
            quantity: effectiveQuantity,
          })
          .select()
          .single();

        if (error) {
          // Handle 401 errors
          if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
            setCart([]);
            showError('Session expired. Please login again');
            openLogin();
            return { success: false, error: 'Session expired' };
          }
          throw error;
        }
        showSuccess(effectiveQuantity < quantity && maxQuantity != null ? `Only ${maxQuantity} left — added ${effectiveQuantity} to cart` : 'Added to cart');
      }

      // Reload cart
      await loadCartFromSupabase();
      
      // Return success indicator
      return { success: true };
    } catch (error) {
      console.error('Error adding to cart:', error);
      // Handle 401 errors
      if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
        setCart([]);
        showError('Session expired. Please login again');
        openLogin();
        return { success: false, error: 'Session expired' };
      }
      showError(error.message || 'Failed to add item to cart');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId, size = null) => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const item = cart.find(
        (item) => item.productId === productId && item.size === size
      );

      if (item?.id) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', item.id);

        if (error) throw error;
        showSuccess('Removed from cart');
        await loadCartFromSupabase();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      showError(error.message || 'Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, size, quantity) => {
    if (!isAuthenticated || !user) return;

    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    try {
      setLoading(true);
      const item = cart.find(
        (item) => item.productId === productId && item.size === size
      );

      if (item?.id) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', item.id);

        if (error) throw error;
        await loadCartFromSupabase();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      showError(error.message || 'Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
      setCart([]);
      showSuccess('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      showError(error.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const getCartItem = (productId, size = null) => {
    return cart.find(
      (item) => item.productId === productId && item.size === size
    );
  };

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = (products) => {
    return cart.reduce((total, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        return total + product.price * item.quantity;
      }
      return total;
    }, 0);
  };

  const openCart = () => {
    if (!isAuthenticated) {
      showError('Please login to view your cart');
      openLogin();
      return;
    }
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartItem,
        getCartCount,
        getCartTotal,
        isCartOpen,
        openCart,
        closeCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
