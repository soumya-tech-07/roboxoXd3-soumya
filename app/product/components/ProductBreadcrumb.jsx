'use client';

import Link from 'next/link';

export default function ProductBreadcrumb() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <nav className="text-xs text-gray-500">
        <Link href="/" className="hover:text-black">
          HOME
        </Link>
        <span className="mx-2">/</span>
        <span className="text-black">PRODUCT</span>
      </nav>
    </div>
  );
}

