'use client';

import React, { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CATEGORY_NAMES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
  onlyDiscount: boolean;
  onlyReward: boolean;
  onApply: (filters: {
    categories: string[];
    minPrice: string;
    maxPrice: string;
    onlyDiscount: boolean;
    onlyReward: boolean;
  }) => void;
  onReset: () => void;
}

export function FilterSheet({
  isOpen,
  onClose,
  selectedCategories,
  minPrice,
  maxPrice,
  onlyDiscount,
  onlyReward,
  onApply,
  onReset,
}: FilterSheetProps) {
  const [draftCategories, setDraftCategories] = useState<string[]>(selectedCategories);
  const [draftMin, setDraftMin] = useState(minPrice);
  const [draftMax, setDraftMax] = useState(maxPrice);
  const [draftOnlyDiscount, setDraftOnlyDiscount] = useState(onlyDiscount);
  const [draftOnlyReward, setDraftOnlyReward] = useState(onlyReward);

  useEffect(() => {
    setDraftCategories(selectedCategories);
    setDraftMin(minPrice);
    setDraftMax(maxPrice);
    setDraftOnlyDiscount(onlyDiscount);
    setDraftOnlyReward(onlyReward);
  }, [selectedCategories, minPrice, maxPrice, onlyDiscount, onlyReward, isOpen]);

  const toggleCategory = (catKey: string) => {
    setDraftCategories((prev) =>
      prev.includes(catKey)
        ? prev.filter((k) => k !== catKey)
        : [...prev, catKey]
    );
  };

  const handleApply = () => {
    onApply({
      categories: draftCategories,
      minPrice: draftMin,
      maxPrice: draftMax,
      onlyDiscount: draftOnlyDiscount,
      onlyReward: draftOnlyReward,
    });
    onClose();
  };

  const handleReset = () => {
    setDraftCategories([]);
    setDraftMin('');
    setDraftMax('');
    setDraftOnlyDiscount(false);
    setDraftOnlyReward(false);
    onReset();
    onClose();
  };

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="فیلتر پیشرفته کالاها">
      <div className="flex flex-col gap-4 pt-1">
        {/* Categories selector */}
        <div>
          <p className="text-[10px] font-extrabold text-sn-text mb-2.5">
            دسته‌بندی‌ها
          </p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORY_NAMES)
              .filter(([key]) => key !== 'all')
              .map(([key, label]) => {
                const checked = draftCategories.includes(key);
                return (
                  <label
                    key={key}
                    className={cn(
                      'flex items-center gap-1.5 h-8 px-3 rounded-full border border-[#dfe8e2] text-[9.5px] cursor-pointer transition-colors',
                      checked
                        ? 'border-[#a8d7b9] bg-[#edf8f1] text-sn-green font-bold'
                        : 'text-[#65766e]'
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(key)}
                      className="accent-sn-green w-3.5 h-3.5 rounded"
                    />
                    <span>{label}</span>
                  </label>
                );
              })}
          </div>
        </div>

        {/* Price range */}
        <div>
          <p className="text-[10px] font-extrabold text-sn-text mb-2.5">
            بازه قیمت (تومان)
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="text"
              inputMode="numeric"
              placeholder="از قیمت"
              value={draftMin}
              onChange={(e) => setDraftMin(e.target.value.replace(/\D/g, ''))}
            />
            <Input
              type="text"
              inputMode="numeric"
              placeholder="تا قیمت"
              value={draftMax}
              onChange={(e) => setDraftMax(e.target.value.replace(/\D/g, ''))}
            />
          </div>
        </div>

        {/* Quick toggles */}
        <div className="flex flex-col border-t border-sn-line/60 pt-1">
          <label className="flex items-center justify-between h-10 border-b border-[#eff2f0] text-[10px] font-medium text-[#52665b] cursor-pointer">
            <span>فقط کالاهای تخفیف‌دار</span>
            <input
              type="checkbox"
              checked={draftOnlyDiscount}
              onChange={(e) => setDraftOnlyDiscount(e.target.checked)}
              className="accent-sn-green w-4 h-4 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between h-10 text-[10px] font-medium text-[#52665b] cursor-pointer">
            <span>دارای پاداش خرید</span>
            <input
              type="checkbox"
              checked={draftOnlyReward}
              onChange={(e) => setDraftOnlyReward(e.target.checked)}
              className="accent-sn-green w-4 h-4 rounded cursor-pointer"
            />
          </label>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-[100px_1fr] gap-2 pt-2 border-t border-sn-line">
          <Button variant="secondary" onClick={handleReset}>
            حذف همه
          </Button>
          <Button variant="default" onClick={handleApply}>
            اعمال فیلتر
          </Button>
        </div>
      </div>
    </Sheet>
  );
}
