'use client';

export default function ProductInfo({ badge, name, price, description, sku }) {
  return (
    <div className="mb-6">
      {badge && (
        <span className="text-xs tracking-[0.2em] text-gray-800 mb-2 block">
          {badge}
        </span>
      )}
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 leading-snug mb-3">
        {name}
      </h1>
      <p className="text-2xl font-light text-gray-900 mb-1">{price}</p>
      <p className="text-[10px] text-gray-400 tracking-[0.2em] leading-tight mb-4">
        MRP INCL. OF ALL TAXES
      </p>

      {/* Product Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        {description}
      </p>

      {/* Product ID */}
      <p className="text-xs text-gray-500 tracking-[0.15em] mb-6">
        PRODUCT ID: {sku}
      </p>
    </div>
  );
}

