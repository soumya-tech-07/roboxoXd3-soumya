/**
 * Supabase Error Handler
 * 
 * Provides utilities to handle common Supabase auth errors gracefully
 */

/**
 * Checks if an error is an expected auth error that can be safely ignored
 */
export function isExpectedAuthError(error: any): boolean {
  if (!error) return false;
  
  const message = error.message || '';
  const status = error.status;
  
  return (
    message.includes('refresh_token_not_found') ||
    message.includes('invalid_grant') ||
    message.includes('JWT expired') ||
    message.includes('invalid refresh token') ||
    status === 400 ||
    status === 401
  );
}

/**
 * Clears Supabase auth data from localStorage
 */
export function clearAuthStorage(): void {
  if (typeof window === 'undefined') return;
  
  try {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    // Ignore storage errors
  }
}

/**
 * Handles auth errors by clearing invalid tokens
 */
export function handleAuthError(error: any): void {
  if (isExpectedAuthError(error)) {
    clearAuthStorage();
  }
}
