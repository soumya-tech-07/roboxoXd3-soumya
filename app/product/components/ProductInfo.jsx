'use client';

import { useMemo, useState } from 'react';

function normalizeText(value) {
  if (!value) return '';
  if (Array.isArray(value)) return value.filter(Boolean).join('\n');
  return String(value).trim();
}

function isBlankContent(value) {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  return false;
}

function TabBody({ content }) {
  if (content == null) return null;
  if (typeof content === 'string') {
    return (
      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    );
  }
  return (
    <div className="text-sm text-gray-600 leading-relaxed">
      {content}
    </div>
  );
}

export default function ProductInfo({
  badge,
  name,
  price,
  description,
  sku,
  composition,
  materials,
  measurements,
  care,
  modelSize,
  modelHeight,
}) {
  const [activeKey, setActiveKey] = useState('description');

  const tabs = useMemo(() => {
    const items = [];

    const descriptionText = normalizeText(description);
    items.push({
      key: 'description',
      label: 'DESCRIPTION',
      title: 'Description',
      content: descriptionText,
    });

    const compositionText = normalizeText(composition);
    const materialsList = Array.isArray(materials) ? materials.map((m) => normalizeText(m)).filter(Boolean) : [];
    const hasComposition = !!compositionText;
    const hasMaterials = materialsList.length > 0;
    if (hasComposition || hasMaterials) {
      items.push({
        key: 'composition',
        label: 'COMPOSITION',
        title: 'Composition',
        content: (
          <div className="space-y-4">
            {hasMaterials && (
              <div>
                <div className="text-xs tracking-[0.18em] text-gray-500 mb-2">MATERIALS</div>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {materialsList.map((m, idx) => (
                    <li key={`${m}-${idx}`}>{m}</li>
                  ))}
                </ul>
              </div>
            )}
            {hasComposition && (
              <div>
                <div className="text-xs tracking-[0.18em] text-gray-500 mb-2">COMPOSITION</div>
                <p className="text-gray-700 whitespace-pre-line">{compositionText}</p>
              </div>
            )}
          </div>
        ),
      });
    }

    const modelLines = [];
    const modelSizeText = normalizeText(modelSize);
    const modelHeightText = normalizeText(modelHeight);
    if (modelSizeText) modelLines.push(`Model wears: ${modelSizeText}`);
    if (modelHeightText) modelLines.push(`Model height: ${modelHeightText}`);

    const measurementsText = normalizeText(measurements);
    const measurementsContent = [measurementsText, modelLines.join('\n')].filter(Boolean).join('\n\n');

    if (measurementsContent) {
      items.push({
        key: 'measurements',
        label: 'MEASUREMENTS',
        title: 'Measurements',
        content: measurementsContent,
      });
    }

    const careText = normalizeText(care);
    if (careText) {
      items.push({
        key: 'care',
        label: 'PRODUCT CARE',
        title: 'Product care',
        content: careText,
      });
    }

    return items.filter((t) => t.key === 'description' || !isBlankContent(t.content));
  }, [description, composition, materials, measurements, care, modelSize, modelHeight]);

  const safeActiveKey = tabs.some((t) => t.key === activeKey)
    ? activeKey
    : (tabs[0]?.key ?? 'description');

  const selectedTab = tabs.find((t) => t.key === safeActiveKey) ?? tabs[0] ?? null;

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

      {/* Product ID */}
      <p className="text-xs text-gray-500 tracking-[0.15em] mb-6">
        PRODUCT ID: {sku}
      </p>

      {/* Details Tabs */}
      {tabs.length > 0 && (
        <div className="border-t border-gray-200 pt-5">
          <div className="border-b border-gray-200 -mx-6 px-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-end gap-5 sm:gap-6 whitespace-nowrap min-w-max">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveKey(t.key)}
                  className={[
                    'pb-3 text-[11px] sm:text-xs tracking-[0.18em] transition-colors cursor-pointer shrink-0',
                    safeActiveKey === t.key ? 'text-gray-900 font-semibold' : 'text-gray-500 hover:text-gray-800',
                  ].join(' ')}
                >
                  <span className="relative inline-block">
                    {t.label}
                    <span
                      className={[
                        'absolute left-0 -bottom-3 h-[2px] bg-gray-900 transition-all duration-200',
                        safeActiveKey === t.key ? 'w-full opacity-100' : 'w-0 opacity-0',
                      ].join(' ')}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedTab && (
            <div className="pt-5">
              <TabBody content={selectedTab.content} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

