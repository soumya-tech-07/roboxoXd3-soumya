import { createPublicClient } from '@/lib/supabase/public';
import ProductCard from './ProductCard';

const DEFAULT_WOMENS_BG = '/images/womens.jpeg';
const DEFAULT_WOMENS_HEADING = 'WOMEN';

export default async function WomensSection() {
  const supabase = createPublicClient();

  const [{ data: sectionConfig }, { data: productsData, error: productsError }] =
    await Promise.all([
      supabase
        .from('section_backgrounds')
        .select('background_url, heading')
        .eq('section_key', 'womens')
        .eq('is_active', true)
        .maybeSingle(),
      supabase
        .from('products')
        .select('*')
        .contains('tags', ['womens'])
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8),
    ]);

  const bgUrl = sectionConfig?.background_url?.trim() || DEFAULT_WOMENS_BG;
  const heading = sectionConfig?.heading?.trim() || DEFAULT_WOMENS_HEADING;

  if (productsError) {
    console.error('Error fetching womens products:', productsError);
    return (
      <section className="py-8 sm:py-12 md:py-16 scroll-mt-20 relative overflow-hidden">
        <div className="absolute inset-0  z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <h1 className="text-brand mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl" style={{ fontFamily: 'Gliker, sans-serif' }}>{heading}</h1>
          <p className="text-white/80 text-sm">
            Products couldn’t be loaded. Please reload.
          </p>
        </div>
      </section>
    );
  }

  const womensProducts = (productsData || []).map((p) => {
    const gallery = Array.isArray(p.gallery)
      ? p.gallery.filter((url) => url && !url.toLowerCase().includes('.heic'))
      : [];
    const mainImages = [p.image_url, p.hover_image_url].filter(Boolean);
    const images = gallery.length ? gallery : mainImages;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price || 0),
      gallery: images,
      image: images[0],
      hoverImage: images[1] || images[0],
    };
  });

  return (
    <section
      id="womens-section"
      className="py-8 sm:py-12 md:py-16 scroll-mt-20 relative overflow-hidden"
      style={{
        backgroundImage: `url('${bgUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Light overlay for text readability */}
      <div className="absolute inset-0  z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <h1 className="text-brand mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl" style={{ fontFamily: 'Gliker, sans-serif' }}>{heading}</h1>
        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {womensProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              aspectRatio="aspect-3/4"
              textColor="text-gray-700"
              priceColor="text-gray-700"
              showHoverImage={true}
            />
          ))}
        </div>

        {/* Discover More Button */}
        {/* <div className="flex justify-center mt-8 sm:mt-12">
          <Link href="/new-in">
            <button className="px-4 sm:px-6 py-2 text-brand border-2 border-brand text-xs sm:text-sm tracking-wider font-medium hover:bg-brand cursor-pointer hover:text-white transition-colors duration-300">
              DISCOVER MORE
            </button>
          </Link>
        </div> */}
      </div>
    </section>
  );
}

