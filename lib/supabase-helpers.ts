/**
 * Helper function to retry Supabase queries with automatic token refresh
 * This is useful when the session might have expired while the tab was in the background
 */
import { supabase } from './supabase';

export async function retryWithTokenRefresh<T>(
  queryFn: () => Promise<{ data: T | null; error: any }>,
  maxRetries: number = 1
): Promise<{ data: T | null; error: any }> {
  let lastError = null;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await queryFn();
      
      // If we got an error that might be related to authentication
      if (result.error) {
        const errorCode = result.error?.code || '';
        const errorMessage = result.error?.message || '';
        
        // Check if it's an auth-related error
        if (
          errorCode === 'PGRST301' || // JWT expired
          errorMessage.includes('JWT') ||
          errorMessage.includes('token') ||
          errorMessage.includes('expired') ||
          errorMessage.includes('unauthorized')
        ) {
          // Try to refresh the session
          if (attempt < maxRetries) {
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
              console.error('Failed to refresh session:', refreshError);
              lastError = result.error;
              continue;
            }
            // Retry the query after refreshing
            continue;
          }
        }
        
        // If it's not an auth error or we've exhausted retries, return the error
        return result;
      }
      
      // Success - return the result
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Check if it's an auth-related error
      if (
        error?.message?.includes('JWT') ||
        error?.message?.includes('token') ||
        error?.message?.includes('expired') ||
        error?.message?.includes('unauthorized')
      ) {
        // Try to refresh the session
        if (attempt < maxRetries) {
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            console.error('Failed to refresh session:', refreshError);
            continue;
          }
          // Retry the query after refreshing
          continue;
        }
      }
      
      // If it's not an auth error or we've exhausted retries, return the error
      return { data: null, error };
    }
  }
  
  return { data: null, error: lastError };
}

