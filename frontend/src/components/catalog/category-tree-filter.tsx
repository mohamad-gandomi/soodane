'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Folder, ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { Category } from '@/types/product';
import { cn, toFa } from '@/lib/utils';

interface CategoryTreeFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onToggleCategory: (slug: string) => void;
  onClearCategories?: () => void;
}

export function CategoryTreeFilter({
  categories,
  selectedCategories,
  onToggleCategory,
  onClearCategories,
}: CategoryTreeFilterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Category maps
  const catMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => {
      map.set(c.id, c);
      if (c.slug) map.set(c.slug, c);
    });
    return map;
  }, [categories]);

  const childrenMap = useMemo(() => {
    const map = new Map<string, Category[]>();
    categories.forEach((c) => {
      const pId = c.parentId || 'ROOT';
      const list = map.get(pId) || [];
      list.push(c);
      map.set(pId, list);
    });
    map.forEach((list) => {
      list.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    });
    return map;
  }, [categories]);

  // Auto-expand parents of selected categories on mount or change
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const nextExp = new Set<string>();
      selectedCategories.forEach((selKey) => {
        let curr = catMap.get(selKey);
        while (curr && curr.parentId) {
          nextExp.add(curr.parentId);
          curr = catMap.get(curr.parentId);
        }
      });
      setExpandedIds((prev) => {
        const merged = new Set(prev);
        nextExp.forEach((id) => merged.add(id));
        return merged;
      });
    }
  }, [selectedCategories, catMap]);

  const toggleExpand = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  };

  const matchesSearch = (cat: Category): boolean => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    if (cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q)) return true;
    const children = childrenMap.get(cat.id) || [];
    return children.some(matchesSearch);
  };

  const rootCategories = (childrenMap.get('ROOT') || []).filter(matchesSearch);

  return (
    <div className="flex flex-col gap-2 w-full" dir="rtl">
      {/* Header with selected count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-extrabold text-sn-text">
            دسته‌بندی‌ها
          </p>
          {selectedCategories.length > 0 && (
            <span className="text-[9.5px] font-bold text-sn-green bg-[#edf8f1] border border-[#a8d7b9] px-2 py-0.5 rounded-full">
              {toFa(selectedCategories.length)} انتخاب شده
            </span>
          )}
        </div>

        {selectedCategories.length > 0 && onClearCategories && (
          <button
            type="button"
            onClick={onClearCategories}
            className="text-[10px] text-sn-muted hover:text-red-600 transition-colors cursor-pointer"
          >
            پاک کردن انتخاب‌ها
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="جست‌وجوی بین دسته‌بندی‌ها..."
          className="w-full h-8.5 rounded-[10px] border border-sn-line bg-[#f8faf9] pl-7 pr-8 text-[11px] text-sn-text placeholder:text-[#97a59d] focus:outline-none focus:border-sn-green focus:bg-white transition-all font-sans text-right"
        />
        <Search className="w-3.5 h-3.5 text-sn-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sn-muted hover:text-sn-text p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tree Scroll Container */}
      <div className="max-h-[290px] overflow-y-auto rounded-[14px] border border-sn-line/80 bg-[#fafcfb] p-2 space-y-1 overscroll-contain scrollbar-none">
        {rootCategories.length === 0 ? (
          <div className="py-6 text-center text-xs text-sn-muted">
            دسته‌بندی با این عنوان یافت نشد.
          </div>
        ) : (
          rootCategories.map((root) => {
            const isExpanded = expandedIds.has(root.id) || Boolean(searchTerm.trim());
            const isChecked = selectedCategories.includes(root.slug) || selectedCategories.includes(root.id);
            const level2Children = (childrenMap.get(root.id) || []).filter(matchesSearch);
            const hasLevel2 = level2Children.length > 0;

            return (
              <div key={root.id} className="space-y-1">
                {/* Level 1 Item */}
                <div
                  onClick={() => onToggleCategory(root.slug)}
                  className={cn(
                    'flex items-center justify-between px-2.5 py-2 rounded-[10px] cursor-pointer text-[11.5px] transition-all select-none border',
                    isChecked
                      ? 'bg-[#edf8f1] border-[#a8d7b9] text-sn-green font-bold shadow-2xs'
                      : 'bg-white border-sn-line/60 text-[#303e37] hover:bg-[#f3f7f5]'
                  )}
                >
                  {/* Right side: Expand Chevron + Folder Icon + Checkbox & Name */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    {hasLevel2 ? (
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(root.id, e)}
                        className="p-1 -mr-1 rounded-md hover:bg-sn-line/50 text-[#71847a] hover:text-sn-text transition-colors shrink-0 cursor-pointer"
                        title={isExpanded ? 'بستن زیرشاخه‌ها' : 'مشاهده زیرشاخه‌ها'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-sn-text" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-[#71847a]" />
                        )}
                      </button>
                    ) : (
                      <span className="w-5 shrink-0" />
                    )}

                    <Folder
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isChecked ? 'text-sn-green' : 'text-[#8da095]'
                      )}
                    />

                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleCategory(root.slug)}
                      onClick={(e) => e.stopPropagation()}
                      className="accent-sn-green w-3.5 h-3.5 rounded cursor-pointer shrink-0 ml-0.5"
                    />

                    <span className="truncate">{root.name}</span>
                  </div>

                  {/* Left side: Level Badge */}
                  <span className="text-[9px] bg-[#f0f4f2] text-[#6d8076] border border-[#e1e9e4] px-1.5 py-0.2 rounded-full font-sans shrink-0">
                    سطح ۱
                  </span>
                </div>

                {/* Level 2 Children */}
                {hasLevel2 && isExpanded && (
                  <div className="pr-4 border-r-2 border-dashed border-[#d8e3dc] mr-2.5 space-y-1 pt-0.5">
                    {level2Children.map((sub) => {
                      const isSubChecked = selectedCategories.includes(sub.slug) || selectedCategories.includes(sub.id);
                      const level3Children = (childrenMap.get(sub.id) || []).filter(matchesSearch);
                      const hasLevel3 = level3Children.length > 0;
                      const isSubExpanded = expandedIds.has(sub.id) || Boolean(searchTerm.trim());

                      return (
                        <div key={sub.id} className="space-y-1">
                          {/* Level 2 Item */}
                          <div
                            onClick={() => onToggleCategory(sub.slug)}
                            className={cn(
                              'flex items-center justify-between px-2.5 py-1.5 rounded-[8px] cursor-pointer text-[11px] transition-all select-none border',
                              isSubChecked
                                ? 'bg-[#edf8f1] border-[#a8d7b9] text-sn-green font-bold shadow-2xs'
                                : 'bg-white border-sn-line/50 text-[#3f5047] hover:bg-[#f3f7f5]'
                            )}
                          >
                            {/* Right: Expand Chevron + Folder + Checkbox + Title */}
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              {hasLevel3 ? (
                                <button
                                  type="button"
                                  onClick={(e) => toggleExpand(sub.id, e)}
                                  className="p-1 -mr-1 rounded-md hover:bg-sn-line/50 text-[#71847a] hover:text-sn-text transition-colors shrink-0 cursor-pointer"
                                  title={isSubExpanded ? 'بستن زیرشاخه‌ها' : 'مشاهده زیرشاخه‌ها'}
                                >
                                  {isSubExpanded ? (
                                    <ChevronDown className="w-3 h-3 text-sn-text" />
                                  ) : (
                                    <ChevronRight className="w-3 h-3 text-[#71847a]" />
                                  )}
                                </button>
                              ) : (
                                <span className="w-4 shrink-0" />
                              )}

                              <Folder
                                className={cn(
                                  'w-3.5 h-3.5 shrink-0 transition-colors',
                                  isSubChecked ? 'text-sn-green' : 'text-[#8da095]'
                                )}
                              />

                              <input
                                type="checkbox"
                                checked={isSubChecked}
                                onChange={() => onToggleCategory(sub.slug)}
                                onClick={(e) => e.stopPropagation()}
                                className="accent-sn-green w-3.5 h-3.5 rounded cursor-pointer shrink-0 ml-0.5"
                              />

                              <span className="truncate">{sub.name}</span>
                            </div>

                            {/* Left: Level Badge */}
                            <span className="text-[9px] bg-[#f0f4f2] text-[#6d8076] border border-[#e1e9e4] px-1.5 py-0.2 rounded-full font-sans shrink-0">
                              سطح ۲
                            </span>
                          </div>

                          {/* Level 3 Children */}
                          {hasLevel3 && isSubExpanded && (
                            <div className="pr-4 border-r-2 border-dashed border-[#d8e3dc] mr-2 space-y-1 pt-0.5">
                              {level3Children.map((subSub) => {
                                const isSubSubChecked =
                                  selectedCategories.includes(subSub.slug) || selectedCategories.includes(subSub.id);

                                return (
                                  <div
                                    key={subSub.id}
                                    onClick={() => onToggleCategory(subSub.slug)}
                                    className={cn(
                                      'flex items-center justify-between px-2 py-1.5 rounded-[7px] cursor-pointer text-[10.5px] transition-all select-none border',
                                      isSubSubChecked
                                        ? 'bg-[#edf8f1] border-[#a8d7b9] text-sn-green font-bold shadow-2xs'
                                        : 'bg-white border-sn-line/40 text-[#4c5f55] hover:bg-[#f3f7f5]'
                                    )}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                                      <span className="w-3 shrink-0" />
                                      <Folder
                                        className={cn(
                                          'w-3 h-3 shrink-0 transition-colors',
                                          isSubSubChecked ? 'text-sn-green' : 'text-[#8da095]'
                                        )}
                                      />
                                      <input
                                        type="checkbox"
                                        checked={isSubSubChecked}
                                        onChange={() => onToggleCategory(subSub.slug)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="accent-sn-green w-3 h-3 rounded cursor-pointer shrink-0 ml-0.5"
                                      />
                                      <span className="truncate">{subSub.name}</span>
                                    </div>

                                    <span className="text-[8.5px] bg-[#f0f4f2] text-[#6d8076] border border-[#e1e9e4] px-1.5 py-0.2 rounded-full font-sans shrink-0">
                                      سطح ۳
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
