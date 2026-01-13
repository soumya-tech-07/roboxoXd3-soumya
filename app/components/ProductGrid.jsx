// components/ProductGrid.jsx
import ProductCard from './ProductCard';

export default function ProductGrid({ products }) {
  return (
    <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          aspectRatio="aspect-[3/4]"
          showHoverImage={false}
          className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
          imageClassName="bg-black/95"
        />
      ))}
    </div>
  );
}