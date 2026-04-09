import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { ensurePublicImageUrl } from '@/lib/image-helpers';

function getOriginFromHeaders(h) {
  const proto = h.get('x-forwarded-proto') || 'https';
  const host = h.get('x-forwarded-host') || h.get('host');
  if (!host) return '';
  return `${proto}://${host}`;
}

async function fetchProductByIdentifier(identifier) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  // Try slug first
  let { data, error } = await supabase
    .from('products')
    .select('id, name, description, slug, image_url, hover_image_url, gallery')
    .eq('slug', identifier)
    .eq('is_active', true)
    .single();

  // If not found by slug, try numeric ID
  if (error && error.code === 'PGRST116') {
    const id = parseInt(identifier, 10);
    if (!Number.isNaN(id)) {
      const res = await supabase
        .from('products')
        .select('id, name, description, slug, image_url, hover_image_url, gallery')
        .eq('id', id)
        .eq('is_active', true)
        .single();
      data = res.data;
      error = res.error;
    }
  }

  if (error) return null;
  return data || null;
}

export default async function Head({ params }) {
  const h = await headers();
  const origin = getOriginFromHeaders(h);

  const identifier = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const product = identifier ? await fetchProductByIdentifier(String(identifier)) : null;

  const brandName = 'Retro Louve';
  const title = product?.name ? `${product.name} | ${brandName}` : brandName;
  const description = (product?.description || '').trim()
    ? product.description.trim().slice(0, 180)
    : 'Shop the latest drops from Retro Louve.';

  // Prefer product image in social previews; fall back to brand logo.
  const gallery = Array.isArray(product?.gallery) ? product.gallery : [];
  const productImageCandidate =
    gallery.find((u) => u && !String(u).toLowerCase().includes('.heic')) ||
    product?.image_url ||
    product?.hover_image_url ||
    '';
  const productImage = productImageCandidate ? ensurePublicImageUrl(productImageCandidate) : '';

  const brandImagePath = '/images/4.png';
  const brandImage = origin ? `${origin}${brandImagePath}` : brandImagePath;

  const primaryImage = productImage || brandImage;
  const url = origin && identifier ? `${origin}/product/${identifier}` : '';

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />

      <meta property="og:type" content="product" />
      {url ? <meta property="og:url" content={url} /> : null}
      <meta property="og:site_name" content={brandName} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={primaryImage} />
      <meta property="og:image:alt" content={product?.name ? `${product.name} — ${brandName}` : `${brandName} logo`} />

      {/* Provide a secondary stable image as a fallback hint */}
      {productImage ? <meta property="og:image" content={brandImage} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={primaryImage} />
    </>
  );
}

