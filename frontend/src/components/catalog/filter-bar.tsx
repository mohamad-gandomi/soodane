'use client';

import React from 'react';
import { Icon } from '@/components/ui/icon';
import { Category } from '@/types/product';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  categories: Category[];
  activeCategories: string[];
  onSelectCategory: (catId: string) => void;
  onOpenFilterSheet: () => void;
  onOpenSortSheet: () => void;
  currentSortLabel: string;
  hasActiveFilters: boolean;
}

export function FilterBar({
  categories,
  activeCategories,
  onSelectCategory,
  onOpenFilterSheet,
  onOpenSortSheet,
  currentSortLabel,
  hasActiveFilters,
}: FilterBarProps) {
  return (
    <nav className="sticky top-[58px] z-10 -mx-4 flex items-center gap-2 overflow-hidden bg-white px-4 py-2.5 border-b border-sn-line">
      {/* Filter trigger button */}
      <button
        type="button"
        onClick={onOpenFilterSheet}
        className={cn(
          'flex h-8 shrink-0 items-center gap-1 rounded-[8px] border border-sn-line bg-white px-2.5 text-[9px] font-bold text-[#607168] hover:bg-slate-50 transition-colors cursor-pointer',
          hasActiveFilters && 'border-sn-green text-sn-green bg-sn-pale'
        )}
      >
        <Icon name="filter" size={14} />
        <span>فیلتر</span>
      </button>

      {/* Sort trigger button */}
      <button
        type="button"
        onClick={onOpenSortSheet}
        className="flex h-8 shrink-0 items-center rounded-[8px] border border-sn-line bg-white px-2.5 text-[9px] font-bold text-[#607168] hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <span>{currentSortLabel}</span>
      </button>

      {/* Divider */}
      <span className="h-6 w-[1px] shrink-0 bg-sn-line" />

      {/* Horizontal scrollable category chips */}
      <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-none">
        {[{ id: 'all', slug: 'all', name: 'همه' }, ...categories].map(category => {
          const key = category.slug;
          const label = category.name;
          const isActive =
            key === 'all'
              ? activeCategories.length === 0
              : activeCategories.includes(key);

          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelectCategory(key)}
              className={cn(
                'h-[30px] shrink-0 rounded-full border border-[#dde7e1] bg-[#f6f9f7] px-2.5 text-[8.5px] font-medium text-[#65776d] whitespace-nowrap transition-colors cursor-pointer',
                isActive &&
                  'border-[#a8d7b9] bg-[#eaf7ef] text-sn-green font-extrabold'
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
