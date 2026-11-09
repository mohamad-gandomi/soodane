'use client';

import React from 'react';
import { Category } from '@/types/product';
import { cn } from '@/lib/utils';

export const CATEGORY_ICONS: Record<string, string> = {
  restaurant: '🍔',
  supermarket: '🛒',
  cafe: '☕',
  pastry: '🍰',
  bakery: '🥖',
  fruit: '🍎',
  protein: '🥩',
  juice: '🍹',
  grocery: '🧺',
  'living-room': '🛋️',
  'dining-room': '🍽️',
  'dining-tables': '🪵',
  'dining-chairs': '🪑',
  'sofas-and-armchairs': '🛋️',
  'coffee-tables': '☕',
  'wooden-decor': '🏺',
  khwarbar: '🌾',
  karobar: '🌾',
  tea: '🫖',
  'shwyndh-w-bhdashty': '🧼',
  sobhaneh: '🍳',
  'dsr-w-shyryny': '🧁',
  arqyjat: '🌿',
  'knsrwjat-w-nwdl': '🥫',
  'aarayshy-w-bhdashty': '🧴',
  'chashny-w-afzwdny': '🧂',
  more: '•••',
};

interface CatalogCategoriesScrollProps {
  categories: Category[];
  activeRootSlug: string | null;
  onSelectCategory: (slug: string | null) => void;
}

export function CatalogCategoriesScroll({
  categories,
  activeRootSlug,
  onSelectCategory,
}: CatalogCategoriesScrollProps) {
  return (
    <div className="mb-3 pt-1">
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none overscroll-contain px-0.5">
        {/* All Products Item */}
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className="flex flex-col items-center shrink-0 text-center group cursor-pointer"
        >
          <div
            className={cn(
              'w-[60px] h-[60px] rounded-[16px] border flex items-center justify-center transition-all group-active:scale-95',
              !activeRootSlug
                ? 'border-sn-green ring-2 ring-sn-green/30 bg-[#eff9f3] text-sn-green shadow-xs'
                : 'border-sn-line bg-[#f6f7f7] text-[#4d5c54] group-hover:bg-[#edf0ef]'
            )}
          >
            <span className="text-[24px] select-none">🛍️</span>
          </div>
          <span
            className={cn(
              'mt-1.5 text-[10px] font-semibold max-w-[62px] truncate leading-tight transition-colors select-none',
              !activeRootSlug
                ? 'text-sn-green font-bold'
                : 'text-[#333b37] group-hover:text-sn-green'
            )}
          >
            همه کالاها
          </span>
        </button>

        {/* Root categories */}
        {categories.map((cat) => {
          const isActive = activeRootSlug === cat.slug;
          const fallbackIcon =
            CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS[cat.name] || '📦';

          return (
            <button
              key={cat.id || cat.slug}
              type="button"
              onClick={() => onSelectCategory(cat.slug)}
              className="flex flex-col items-center shrink-0 text-center group cursor-pointer"
            >
              <div
                className={cn(
                  'w-[60px] h-[60px] rounded-[16px] border overflow-hidden flex items-center justify-center transition-all group-active:scale-95',
                  isActive
                    ? 'border-sn-green ring-2 ring-sn-green/30 bg-[#eff9f3] shadow-xs'
                    : 'border-sn-line bg-[#f6f7f7] group-hover:bg-[#edf0ef]'
                )}
              >
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    loading="lazy"
                    className="h-full w-full object-cover select-none pointer-events-none"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-[24px] select-none">{fallbackIcon}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-1.5 text-[10px] font-semibold max-w-[62px] truncate leading-tight transition-colors select-none',
                  isActive
                    ? 'text-sn-green font-bold'
                    : 'text-[#333b37] group-hover:text-sn-green'
                )}
              >
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
