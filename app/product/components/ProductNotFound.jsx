'use client';

import Link from 'next/link';

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6 text-center">
      <div>
        <p className="text-[10px] tracking-[0.18em] text-gray-500 mb-2">
          PRODUCT
        </p>
        <h1 className="text-2xl font-semibold mb-4">Item not found</h1>
        <p className="text-sm text-gray-600 mb-6">
          The product you are looking for is unavailable or no longer exists.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-brand text-brand tracking-[0.2em] text-xs hover:bg-brand hover:text-white transition-colors"
        >
          CONTINUE SHOPPING
        </Link>
      </div>
    </div>
  );
}

