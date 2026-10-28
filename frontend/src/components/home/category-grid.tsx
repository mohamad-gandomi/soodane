'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Category } from '@/types/product';
import { categoriesService } from '@/services/categories.service';

const CATEGORY_ICONS: Record<string, string> = {
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
  more: '•••',
};

const FEATURED_TAGS: Record<string, string> = {
  restaurant: 'کاربردی',
  supermarket: 'کاربردی',
  cafe: 'کاربردی',
  protein: 'کاربردی',
};

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await categoriesService.getCategories();
        setCategories(data.filter(category => !category.parentId));
      } catch {
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[14px] font-black text-sn-text">دسته‌بندی‌ها</h2>
      </div>

      <div className="grid grid-cols-5 gap-y-3 gap-x-2">
        {categories.slice(0, 9).map((cat) => {
          const fallbackIcon =
            CATEGORY_ICONS[cat.slug] || CATEGORY_ICONS[cat.name] || '📦';
          const tag = FEATURED_TAGS[cat.slug];

          return (
            <Link
              key={cat.id || cat.slug}
              href={`/products?category=${encodeURIComponent(cat.slug)}`}
              className="relative flex flex-col items-center text-center group"
            >
              {tag && (
                <span className="absolute -top-[7px] -right-[2px] z-10 px-[7px] py-[3px] rounded-[9px] bg-[#30323a] text-white text-[8px] font-medium leading-none select-none shadow-sm pointer-events-none">
                  {tag}
                </span>
              )}
              <div className="w-full aspect-square rounded-[16px] border border-sn-line bg-[#f6f7f7] overflow-hidden flex items-center justify-center group-hover:bg-[#edf0ef] group-active:scale-95 transition-all">
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
                  <span className="text-[28px] select-none">{fallbackIcon}</span>
                )}
              </div>
              <span className="mt-[7px] text-[10px] font-semibold text-[#333b37] group-hover:text-sn-green transition-colors truncate max-w-[62px] leading-tight select-none">
                {cat.name}
              </span>
            </Link>
          );
        })}

        {/* 10th Item: مشاهده همه */}
        <Link
          href="/products"
          className="relative flex flex-col items-center text-center group"
        >
          <div className="w-full aspect-square rounded-[16px] border border-sn-line bg-[#f6f7f7] overflow-hidden flex items-center justify-center group-hover:bg-[#edf0ef] group-active:scale-95 transition-all">
            <span className="text-[20px] font-bold text-[#5e6462] tracking-[2px] select-none pointer-events-none">
              •••
            </span>
          </div>
          <span className="mt-[7px] text-[10px] font-semibold text-[#333b37] group-hover:text-sn-green transition-colors truncate max-w-[62px] leading-tight select-none">
            مشاهده همه
          </span>
        </Link>
      </div>
    </section>
  );
}
