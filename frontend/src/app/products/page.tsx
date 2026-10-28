'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { TopHeader } from '@/components/layout/top-header';
import { BottomNav } from '@/components/layout/bottom-nav';
import { PromoSlider } from '@/components/home/promo-slider';
import { FilterBar } from '@/components/catalog/filter-bar';
import { FilterSheet } from '@/components/catalog/filter-sheet';
import { SortSheet, SORT_OPTIONS } from '@/components/catalog/sort-sheet';
import { ProductListCard } from '@/components/shared/product-list-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Icon } from '@/components/ui/icon';
import { productsService } from '@/services/products.service';
import { useCart } from '@/context/cart-context';
import { Category, Product } from '@/types/product';
import { categoriesService } from '@/services/categories.service';
import { matchesProductCategories } from '@/lib/catalog';
import { toFa } from '@/lib/utils';

function ProductsCatalogContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialCategory ? [initialCategory] : []
  );
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyReward, setOnlyReward] = useState(false);
  const [sortId, setSortId] = useState('bestselling');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const { getItemQuantity, setQuantity } = useCart();

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    Promise.all([
      productsService.getProducts(),
      categoriesService.getCategories(controller.signal).catch(() => [] as Category[]),
    ]).then(([items, categoryList]) => {
      if (!active) return;
      setProducts(items);
      setCategories(categoryList);
      setLoading(false);
    });
    return () => { active = false; controller.abort(); };
  }, []);

  useEffect(() => {
    setSelectedCategories(initialCategory ? [initialCategory] : []);
  }, [initialCategory]);

  const handleSelectQuickCategory = (catKey: string) => {
    if (catKey === 'all') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([catKey]);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.shortDescription &&
          p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = matchesProductCategories(p, selectedCategories, categories);

      const price = p.price ?? 0;
      const min = minPrice ? Number(minPrice) : null;
      const max = maxPrice ? Number(maxPrice) : null;
      const matchesMin = min === null || price >= min;
      const matchesMax = max === null || price <= max;

      const matchesDiscount = !onlyDiscount || (p.oldPrice && p.oldPrice > price);
      const matchesReward = !onlyReward || ((p.reward ?? 0) > 0);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMin &&
        matchesMax &&
        matchesDiscount &&
        matchesReward
      );
    });
  }, [
    products,
    searchQuery,
    selectedCategories,
    categories,
    minPrice,
    maxPrice,
    onlyDiscount,
    onlyReward,
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    switch (sortId) {
      case 'cheapest':
        return list.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
      case 'expensive':
        return list.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      case 'discount':
        return list.sort((a, b) => {
          const discA = (a.oldPrice ?? 0) - (a.price ?? 0);
          const discB = (b.oldPrice ?? 0) - (b.price ?? 0);
          return discB - discA;
        });
      case 'reward':
        return list.sort((a, b) => (b.reward ?? 0) - (a.reward ?? 0));
      default:
        return list;
    }
  }, [filteredProducts, sortId]);

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortId)?.label || 'مرتب‌سازی';

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    !!minPrice ||
    !!maxPrice ||
    onlyDiscount ||
    onlyReward;

  return (
    <>
      <PromoSlider catalogMode />

      {/* Live Search Input */}
      <div className="relative mb-3">
        <label className="flex h-[44px] w-full items-center gap-2 rounded-[10px] border border-sn-line bg-[#fafcfb] px-3 text-[#89978f] focus-within:border-sn-green">
          <Icon name="search" size={18} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در همه کالاها..."
            className="w-full bg-transparent text-[11px] text-sn-text placeholder:text-[#a0aaa5] outline-none border-0"
          />
        </label>
      </div>

      {/* Sticky Filter Bar */}
      <FilterBar
        categories={categories}
        activeCategories={selectedCategories}
        onSelectCategory={handleSelectQuickCategory}
        onOpenFilterSheet={() => setIsFilterOpen(true)}
        onOpenSortSheet={() => setIsSortOpen(true)}
        currentSortLabel={currentSortLabel}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results count text */}
      <p className="py-2.5 text-[9px] text-[#89978f]">
        {toFa(sortedProducts.length)} کالا
        {selectedCategories.length > 0 &&
          ` در ${selectedCategories.map(key => categories.find(category => category.slug === key || category.id === key)?.name || 'دسته‌بندی انتخاب‌شده').join('، ')}`}
      </p>

      {/* Products list */}
      {loading ? (
        <p role="status" className="py-12 text-center text-xs text-sn-muted">در حال دریافت کالاها...</p>
      ) : sortedProducts.length > 0 ? (
        <section className="flex flex-col gap-3 pb-4">
          {sortedProducts.map((product) => (
            <ProductListCard
              key={product.id}
              product={product}
              quantity={getItemQuantity(product.id)}
              onQuantityChange={quantity => setQuantity(product, quantity)}
            />
          ))}
        </section>
      ) : (
        <EmptyState message="کالایی با این فیلتر یا عبارت پیدا نشد." />
      )}

      {/* Filter Bottom Sheet */}
      <FilterSheet
        categories={categories}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        selectedCategories={selectedCategories}
        minPrice={minPrice}
        maxPrice={maxPrice}
        onlyDiscount={onlyDiscount}
        onlyReward={onlyReward}
        onApply={(f) => {
          setSelectedCategories(f.categories);
          setMinPrice(f.minPrice);
          setMaxPrice(f.maxPrice);
          setOnlyDiscount(f.onlyDiscount);
          setOnlyReward(f.onlyReward);
        }}
        onReset={() => {
          setSelectedCategories([]);
          setMinPrice('');
          setMaxPrice('');
          setOnlyDiscount(false);
          setOnlyReward(false);
        }}
      />

      {/* Sort Bottom Sheet */}
      <SortSheet
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        currentSortId={sortId}
        onSelectSort={(newSort) => setSortId(newSort)}
      />
    </>
  );
}

export default function ProductsPage() {
  return (
    <AppShell>
      <TopPromo />
      <TopHeader title="همه کالاها" backHref="/" />
      <Suspense
        fallback={
          <div className="py-12 text-center text-sn-muted text-xs">
            در حال بارگذاری کاتالوگ محصولات...
          </div>
        }
      >
        <ProductsCatalogContent />
      </Suspense>
      <BottomNav />
    </AppShell>
  );
}
