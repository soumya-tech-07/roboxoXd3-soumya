'use client';

import { useState } from 'react';

const accordionSections = [
  { id: 'measurements', title: 'PRODUCT MEASUREMENTS' },
  { id: 'composition', title: 'COMPOSITION, CARE & ORIGIN' },
  { id: 'availability', title: 'CHECK IN-STORE AVAILABILITY' },
  { id: 'shipping', title: 'SHIPPING, EXCHANGES AND RETURNS' },
];

export default function ProductAccordion() {
  const [openAccordion, setOpenAccordion] = useState('');

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  return (
    <div className="border-t border-gray-200">
      {accordionSections.map((section) => (
        <div key={section.id} className="border-b border-gray-200">
          <button
            onClick={() => toggleAccordion(section.id)}
            className="w-full py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <span className="text-xs tracking-wider font-medium text-gray-900">
              {section.title}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${
                openAccordion === section.id ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openAccordion === section.id && (
            <div className="pb-4 px-4">
              {section.id === 'measurements' && (
                <div className="text-sm text-gray-900 space-y-2">
                  <p>Model is wearing size: M</p>
                  <p>Model height: 175 cm / 5&apos;9&quot;</p>
                </div>
              )}

              {section.id === 'composition' && (
                <div className="text-sm text-gray-900 space-y-2">
                  <p>
                    <strong>Composition:</strong> 100% Polyester
                  </p>
                  <p>
                    <strong>Care:</strong> Machine wash cold
                  </p>
                  <p>
                    <strong>Origin:</strong> Made in India
                  </p>
                </div>
              )}

              {section.id === 'availability' && (
                <div className="text-sm text-gray-900">
                  <p className="mb-3">
                    Check if this item is available in your nearest store
                  </p>
                  <button className="text-xs underline hover:no-underline cursor-pointer">
                    FIND STORES
                  </button>
                </div>
              )}

              {section.id === 'shipping' && (
                <div className="text-sm text-gray-900 space-y-2">
                  <p>Free shipping on orders above ₹2999</p>
                  <p>Easy returns within 30 days</p>
                  <p>Standard delivery: 5-7 business days</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

