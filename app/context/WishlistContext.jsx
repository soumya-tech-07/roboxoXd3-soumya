'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useAuthModal } from './AuthModalContext';

const supabase = createClient();

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();
  const { openLogin } = useAuthModal();

  // Load wishlist from Supabase when user is authenticated
  useEffect(() => {
    // Wait for auth to finish loading before checking authentication
    if (authLoading) return;
    
    if (isAuthenticated && user) {
      loadWishlistFromSupabase();
    } else {
      // IMMEDIATELY clear wishlist when user logs out or token expires
      setWishlist([]);
    }
  }, [isAuthenticated, user, authLoading]);

  const loadWishlistFromSupabase = async () => {
    if (!user) {
      setWishlist([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_wishlist_with_products', {
        p_user_id: user.id,
      });

      if (error) {
        // Handle 401 errors - session expired
        if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
          console.log('⚠️ Session expired while loading wishlist');
          setWishlist([]);
          showError('Session expired. Please login again');
          openLogin();
          return;
        }
        throw error;
      }

      // Transform to array of product IDs
      const productIds = data.map((item) => item.product_id);
      setWishlist(productIds);
    } catch (error) {
      console.error('Error loading wishlist:', error);
      // Clear wishlist on any error
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (productId) => {
    // Wait for auth to be ready
    if (authLoading) {
      showError('Please wait, loading...');
      return;
    }

    // Check if user is authenticated - STRICT CHECK
    if (!isAuthenticated || !user) {
      showError('Please login to add items to wishlist');
      openLogin();
      // Clear any stale wishlist data
      setWishlist([]);
      return;
    }

    // Prevent multiple simultaneous requests
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // Double-check user still exists (in case token expired during operation)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setWishlist([]);
        showError('Session expired. Please login again');
        openLogin();
        return;
      }

      // Check if already in wishlist
      if (wishlist.includes(productId)) {
        showInfo('Already in wishlist');
        return;
      }

      const { error } = await supabase.from('wishlist_items').insert({
        user_id: user.id,
        product_id: productId,
      });

      if (error) {
        // Handle 401 errors
        if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
          setWishlist([]);
          showError('Session expired. Please login again');
          openLogin();
          return;
        }
        throw error;
      }

      setWishlist((prev) => [...prev, productId]);
      showSuccess('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Handle 401 errors
      if (error.code === 'PGRST301' || error.message?.includes('JWT') || error.message?.includes('unauthorized')) {
        setWishlist([]);
        showError('Session expired. Please login again');
        openLogin();
        return;
      }
      if (error.code === '23505') {
        // Unique constraint violation - already in wishlist
        showInfo('Already in wishlist');
      } else {
        showError(error.message || 'Failed to add to wishlist');
      }
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      setWishlist((prev) => prev.filter((id) => id !== productId));
      showSuccess('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showError(error.message || 'Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = async (productId) => {
    // Wait for auth to be ready
    if (authLoading) {
      showError('Please wait, loading...');
      return;
    }

    // Prevent multiple simultaneous requests
    if (loading) {
      return;
    }

    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        loading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
}
