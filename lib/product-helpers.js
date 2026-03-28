/**
 * Standard size order for display (smallest to largest).
 */
const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];

/**
 * Get sorted list of size names from stock_by_size (keys of the object).
 * @param {Record<string, number> | null | undefined} stockBySize
 * @returns {string[]}
 */
export function getSizesFromStockBySize(stockBySize) {
  if (!stockBySize || typeof stockBySize !== 'object') return [];
  return Object.keys(stockBySize).filter(Boolean).sort((a, b) => {
    const i = SIZE_ORDER.indexOf(a);
    const j = SIZE_ORDER.indexOf(b);
    if (i !== -1 && j !== -1) return i - j;
    if (i !== -1) return -1;
    if (j !== -1) return 1;
    return String(a).localeCompare(String(b));
  });
}

/**
 * Get sizes with stock for product page selector: [{ size, stock }, ...].
 * @param {Record<string, number> | null | undefined} stockBySize
 * @returns {{ size: string, stock: number }[]}
 */
export function getSizesWithStock(stockBySize) {
  const sizes = getSizesFromStockBySize(stockBySize);
  return sizes.map((size) => ({
    size,
    stock: Number(stockBySize[size]) || 0,
  }));
}

