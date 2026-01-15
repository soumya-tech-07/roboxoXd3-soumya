'use client';

import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

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

      // If token is expired or close to expiring, refresh it.
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

      // Refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        console.error('Error refreshing session:', error);
        // If refresh fails, the session might be expired
        if (error.message?.includes('refresh_token_not_found') || 
            error.message?.includes('invalid_grant') ||
            error.message?.includes('JWT')) {
          // Session expired, clear it
          setUser(null);
          setProfile(null);
          // Clear the session from storage
          await supabase.auth.signOut();
        }
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

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      router.push('/');
      return { error: null };
    } catch (error) {
      console.error('Error signing out:', error);
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

