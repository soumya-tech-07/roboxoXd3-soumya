/**
 * Image helper functions to ensure images work even with expired tokens
 */

/**
 * Ensures an image URL is a public URL without auth tokens
 * If it's a Supabase storage URL, ensures it uses the public endpoint
 */
export function ensurePublicImageUrl(url: string | null | undefined): string {
  if (!url) {
    return 'https://placehold.co/800x1200/e5d4e8/666666?text=Image';
  }

  // If it's already a public URL (starts with http/https), return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // If it's a Supabase storage URL, ensure it's using the public endpoint
    // Remove any query parameters that might include auth tokens
    try {
      const urlObj = new URL(url);
      // Remove any auth-related query params
      urlObj.searchParams.delete('token');
      urlObj.searchParams.delete('apikey');
      urlObj.searchParams.delete('Authorization');
      return urlObj.toString();
    } catch {
      // If URL parsing fails, return original
      return url;
    }
  }

  // If it's a relative path, return as is
  return url;
}

/**
 * Gets a public URL for a Supabase storage file
 * This ensures the URL doesn't include auth tokens
 */
export function getPublicStorageUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bjsnoccotxcviuahthmz.supabase.co';
  // Construct public URL directly (no auth needed for public buckets)
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

