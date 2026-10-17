'use client';

import React from 'react';
import { Sheet } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export interface SortOption {
  id: string;
  label: string;
}

export const SORT_OPTIONS: SortOption[] = [
  { id: 'bestselling', label: 'پرفروش‌ترین' },
  { id: 'newest', label: 'جدیدترین' },
  { id: 'cheapest', label: 'ارزان‌ترین' },
  { id: 'expensive', label: 'گران‌ترین' },
  { id: 'discount', label: 'بیشترین تخفیف' },
  { id: 'reward', label: 'بیشترین پاداش' },
];

interface SortSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentSortId: string;
  onSelectSort: (sortId: string) => void;
}

export function SortSheet({
  isOpen,
  onClose,
  currentSortId,
  onSelectSort,
}: SortSheetProps) {
  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="مرتب‌سازی بر اساس">
      <div className="flex flex-col gap-2 pt-1">
        {SORT_OPTIONS.map((opt) => {
          const isSelected = currentSortId === opt.id || currentSortId === opt.label;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectSort(opt.id);
                onClose();
              }}
              className={cn(
                'relative flex items-center justify-between w-full p-3.5 rounded-[10px] border border-sn-line bg-white text-right transition-colors cursor-pointer',
                isSelected && 'border-[#9fd0b5] bg-[#fbfefc]'
              )}
            >
              <b className="text-[11px] font-bold text-sn-text">{opt.label}</b>

              {/* Radio circle */}
              <div className="relative h-[18px] w-[18px] rounded-full border border-[#b7c9bf] flex items-center justify-center shrink-0">
                {isSelected && (
                  <span className="h-2.5 w-2.5 rounded-full bg-sn-green" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Sheet>
  );
}
