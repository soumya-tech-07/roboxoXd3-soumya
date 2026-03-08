'use client';

export default function ProductSizeSelector({ sizesWithStock, selectedSize, onSizeSelect, onSizeGuideOpen }) {
  const list = Array.isArray(sizesWithStock) && sizesWithStock.length > 0
    ? sizesWithStock.filter((x) => (x.stock || 0) > 0)
    : [{ size: 'S', stock: 1 }, { size: 'M', stock: 1 }, { size: 'L', stock: 1 }, { size: 'XL', stock: 1 }];

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
        {list.map(({ size, stock }) => {
          const lowStock = (stock || 0) > 0 && (stock || 0) < 5;
          const isSelected = selectedSize === size;
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSizeSelect(size)}
              className={`py-3 text-sm border transition-all flex flex-col items-center justify-center gap-0.5 ${
                isSelected
                  ? 'border-black bg-black text-white cursor-pointer'
                  : 'border-gray-300 text-gray-500 hover:border-black cursor-pointer'
              }`}
            >
              <span>{size}</span>
              {lowStock && (
                <span className={`text-[10px] font-medium ${isSelected ? 'text-white/90' : 'text-red-600'}`}>
                  {stock} left
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

