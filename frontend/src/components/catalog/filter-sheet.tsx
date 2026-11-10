'use client';

import React, { useState, useEffect } from 'react';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/types/product';
import { CategoryTreeFilter } from '@/components/catalog/category-tree-filter';

interface FilterSheetProps {
  categories: Category[];
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
  categories,
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
        {/* Hierarchical Categories Tree Selector */}
        <CategoryTreeFilter
          categories={categories}
          selectedCategories={draftCategories}
          onToggleCategory={toggleCategory}
          onClearCategories={() => setDraftCategories([])}
        />

        {/* Price range */}
        <div>
          <p className="text-[10.5px] font-extrabold text-sn-text mb-2">
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
          <label className="flex items-center justify-between h-9.5 border-b border-[#eff2f0] text-[10.5px] font-medium text-[#52665b] cursor-pointer">
            <span>فقط کالاهای تخفیف‌دار</span>
            <input
              type="checkbox"
              checked={draftOnlyDiscount}
              onChange={(e) => setDraftOnlyDiscount(e.target.checked)}
              className="accent-sn-green w-4 h-4 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between h-9.5 text-[10.5px] font-medium text-[#52665b] cursor-pointer">
            <span>دارای سود مشارکت</span>
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
