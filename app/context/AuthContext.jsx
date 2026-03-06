'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

const supabase = createClient();

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  const userRef = useRef(user);

  // Update ref when user changes
  useEffect(() => {
    userRef.current = user;
  }, [user]);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const refreshSessionIfNeeded = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.expires_at) return;

      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = session.expires_at - now;

      // If token is expired, clear everything without reloading
      if (timeUntilExpiry <= 0) {
        console.log('⚠️ Token expired, clearing session...');
        setUser(null);
        setProfile(null);
        if (typeof window !== 'undefined') {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) localStorage.removeItem(key);
          });
          await supabase.auth.signOut().catch(() => {});
        }
        return;
      }

      // If token is close to expiring, refresh it.
      if (timeUntilExpiry < 60) {
        await refreshSession();
      }
    } catch (e) {
      console.error('Error checking session expiry:', e);
    }
  };

  // Function to refresh the session
  const refreshSession = async () => {
    try {
      // First, get the current session to check if it exists
      const { data: { session: currentSession } } = await supabase.auth.getSession();

      if (!currentSession) {
        // No session, nothing to refresh
        setUser(null);
        setProfile(null);
        return { session: null, error: null };
      }

      // Check if token is expired
      if (currentSession.expires_at) {
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = currentSession.expires_at - now;

        // If token is already expired, clear everything without reloading
        if (timeUntilExpiry <= 0) {
          console.log('⚠️ Token is expired, clearing session...');
          setUser(null);
          setProfile(null);
          if (typeof window !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('sb-')) localStorage.removeItem(key);
            });
            await supabase.auth.signOut().catch(() => {});
          }
          return { session: null, error: null };
        }
      }

      // Refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        // If refresh fails, the session might be expired
        if (error.message?.includes('refresh_token_not_found') ||
          error.message?.includes('invalid_grant') ||
          error.message?.includes('JWT') ||
          error.message?.includes('expired') ||
          error.status === 400) {
          // Session expired, clear everything silently (don't reload unless necessary)
          setUser(null);
          setProfile(null);
          // Clear the session from storage
          if (typeof window !== 'undefined') {
            Object.keys(localStorage).forEach(key => {
              if (key.startsWith('sb-')) {
                localStorage.removeItem(key);
              }
            });
            // Sign out silently without reload
            await supabase.auth.signOut().catch(() => {/* ignore */});
          }
          return { session: null, error: null }; // Return success to avoid console errors
        }
        console.error('Error refreshing session:', error);
        return { session: null, error };
      }

      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      return { session, error: null };
    } catch (error) {
      console.error('Error refreshing session:', error);
      return { session: null, error };
    }
  };

  useEffect(() => {
    // CRITICAL: Initialize auth synchronously to prevent race conditions
    // This ensures session is restored before any components try to fetch data
    let mounted = true;

    // Supabase auto-refresh can pause when the tab is hidden (browser throttling).
    // Explicitly stop/start it based on visibility to ensure it resumes reliably.
    const start = () => {
      try {
        supabase.auth.startAutoRefresh();
      } catch (e) {
        // Some environments may not support this; ignore.
      }
    };
    const stop = () => {
      try {
        supabase.auth.stopAutoRefresh();
      } catch (e) {
        // ignore
      }
    };

    start();

    // CRITICAL: Get initial session and wait for it to complete before allowing data fetching
    // This prevents race conditions where components fetch data before session is restored
    const initializeAuth = async () => {
      try {
        // Add an 8-second timeout: if the Supabase client is stuck waiting for a
        // token refresh (queuing all requests), getSession() will never resolve.
        // The timeout ensures loading is always set to false within a bounded time.
        const { data: { session }, error } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((resolve) =>
            setTimeout(
              () => resolve({ data: { session: null }, error: null }),
              8000
            )
          ),
        ]);

        if (!mounted) return;

        if (error) {
          // Silently handle expected auth errors (expired tokens, etc.)
          if (error.message?.includes('refresh_token_not_found') ||
              error.message?.includes('invalid_grant') ||
              error.status === 400) {
            setUser(null);
            setProfile(null);
            if (typeof window !== 'undefined') {
              Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-')) localStorage.removeItem(key);
              });
            }
            return;
          }
          console.error('Error getting session:', error);
          setUser(null);
          setProfile(null);
          return;
        }

        // Set user state immediately
        setUser(session?.user ?? null);

        // If we have a session, validate expiry then kick off profile fetch
        if (session?.user) {
          if (session.expires_at) {
            const now = Math.floor(Date.now() / 1000);
            const timeUntilExpiry = session.expires_at - now;

            if (timeUntilExpiry <= 0) {
              console.log('⚠️ Initial session expired, clearing...');
              setUser(null);
              setProfile(null);
              if (typeof window !== 'undefined') {
                Object.keys(localStorage).forEach(key => {
                  if (key.startsWith('sb-')) localStorage.removeItem(key);
                });
              }
              return;
            }
          }

          // IMPORTANT: Do NOT await fetchProfile here.
          // The Supabase client queues all DB queries while a token refresh is
          // in progress. Awaiting fetchProfile would block the finally{} block,
          // keeping authLoading = true forever. Fire it and let it resolve async.
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        // This runs immediately after fetchProfile is fired (not awaited),
        // so authLoading is set to false without waiting for the profile fetch.
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email || 'no user');

      // Handle token refresh failures - clear session without reloading the page.
      // window.location.reload() was removed because it caused infinite reload loops:
      // middleware may rotate the refresh token, invalidating the one in localStorage,
      // which triggered another reload on the next mount, repeating indefinitely.
      if (event === 'TOKEN_REFRESHED' && !session) {
        console.log('⚠️ Token refresh failed, clearing session...');
        setUser(null);
        setProfile(null);
        if (typeof window !== 'undefined') {
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) localStorage.removeItem(key);
          });
          await supabase.auth.signOut().catch(() => {});
        }
        setLoading(false);
        return;
      }

      // Handle signed out event
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('sb-auth-token');
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) localStorage.removeItem(key);
          });
        }
        setLoading(false);
        return;
      }

      setUser(session?.user ?? null);

      // IMPORTANT: Set loading to false BEFORE fetching profile.
      // fetchProfile uses the same Supabase client which queues all DB queries
      // while a token refresh is in progress. Awaiting it here would block
      // setLoading(false), keeping authLoading = true indefinitely on reload.
      setLoading(false);

      if (session?.user) {
        fetchProfile(session.user.id); // Fire and forget — non-blocking
      } else {
        setProfile(null);
      }
    });

    // Handle visibility change - refresh session when tab becomes visible
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'hidden') {
        stop();
        return;
      }

      // visible
      start();
      await refreshSessionIfNeeded();
    };

    // Handle window focus - refresh session when window regains focus
    const handleFocus = async () => {
      start();
      await refreshSessionIfNeeded();
    };

    const handleBlur = () => {
      stop();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    return () => {
      mounted = false;
      subscription.unsubscribe();
      stop();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const signUp = async (email, password, metadata = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: metadata.firstName || '',
            last_name: metadata.lastName || '',
          },
        },
      });

      if (error) throw error;

      // Profile will be auto-created by trigger, but let's fetch it
      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchProfile(data.user.id);
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // 1. Immediate Local Cleanup (Optimistic Logout)
      // We don't wait for the server to acknowledge because if it hangs, the user is stuck.

      // Clear all state
      setUser(null);
      setProfile(null);

      // Clear localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem('sb-auth-token');
          Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-')) {
              localStorage.removeItem(key);
            }
          });
          console.log('✅ Cleared all auth tokens from localStorage');
        } catch (storageError) {
          console.error('Error clearing localStorage:', storageError);
        }
      }

      // Redirect immediately
      router.push('/');

      // 2. Perform Server SignOut in background (with timeout)
      // We wrap this so it doesn't block the UI flow if the network is weird
      const serverSignOut = new Promise(async (resolve) => {
        try {
          // Give it max 2 seconds to be nice, otherwise ignore
          const { error } = await Promise.race([
            supabase.auth.signOut(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 2000))
          ]);
          resolve({ error });
        } catch (e) {
          console.warn('Server signOut timed out or failed (non-critical):', e);
          resolve({ error: e });
        }
      });

      // We don't await this promise to block the function return, 
      // but we let it run. or validly we could await it since we already cleared state.
      // To ensure strictly "fire and forget" UI feeling, we just return success.

      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
      // Ensure redirect happens even on error
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
      return { error };
    }
  };

  const resetPassword = async (email) => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/reset-password`,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return { data: null, error: { message: 'Not authenticated' } };

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        updatePassword,
        updateProfile,
        refreshSession,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

