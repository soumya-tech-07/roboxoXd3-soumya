'use client';

export default function ProductSizeSelector({ sizes, selectedSize, onSizeSelect, onSizeGuideOpen }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <label className="text-sm tracking-wide text-gray-900">
          SELECT SIZE
        </label>
        <button
          type="button"
          className="text-xs text-gray-900 underline hover:no-underline cursor-pointer"
          onClick={onSizeGuideOpen}
        >
          SIZE GUIDE
        </button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={`py-3 text-sm border transition-all cursor-pointer ${
              selectedSize === size
                ? 'border-black bg-black text-white'
                : 'border-gray-300 hover:border-black'
            }`}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
}

