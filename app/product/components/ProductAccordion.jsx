'use client';

import { useState } from 'react';

const accordionSections = [
  { id: 'measurements', title: 'PRODUCT MEASUREMENTS' },
  { id: 'composition', title: 'COMPOSITION & CARE' },
  { id: 'shipping', title: 'SHIPPING, EXCHANGES AND RETURNS' },
];

export default function ProductAccordion({ product }) {
  const [openAccordion, setOpenAccordion] = useState('');

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? '' : id);
  };

  // Extract product data with fallbacks
  const modelInfo = product?.modelInfo || { size: '', height: '' };
  const materials = product?.materials || [];
  const composition = product?.composition || '';
  const care = product?.care || '';

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
                  {modelInfo.size && (
                    <p>Model is wearing size: {modelInfo.size}</p>
                  )}
                  {modelInfo.height && (
                    <p>Model height: {modelInfo.height}</p>
                  )}
                  {!modelInfo.size && !modelInfo.height && (
                    <p className="text-gray-500">Model information not available</p>
                  )}
                </div>
              )}

              {section.id === 'composition' && (
                <div className="text-sm text-gray-900 space-y-2">
                  {materials.length > 0 && (
                    <div>
                      <strong>Materials:</strong>
                      <ul className="list-disc list-inside ml-2 mt-1">
                        {materials.map((material, index) => (
                          <li key={index}>{material}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {composition && (
                    <p>
                      <strong>Composition:</strong> {composition}
                    </p>
                  )}
                  {care && (
                    <div>
                      <strong>Care:</strong>
                      <p className="mt-1 whitespace-pre-line">{care}</p>
                    </div>
                  )}
                  {!materials.length && !composition && !care && (
                    <p className="text-gray-500">Product details not available</p>
                  )}
                </div>
              )}

              {section.id === 'shipping' && (
                <div className="text-sm text-gray-900 space-y-2">
                  <p>Free shipping on orders above ₹2499</p>
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

