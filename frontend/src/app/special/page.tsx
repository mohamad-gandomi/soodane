'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { BottomNav } from '@/components/layout/bottom-nav';
import { QuantityControl } from '@/components/shared/quantity-control';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { flashDealsService } from '@/services/flash-deals.service';
import { useCart } from '@/context/cart-context';
import { FlashDeal } from '@/types/flash-deal';
import { Product } from '@/types/product';
import { formatMoney, toFa, calculateDiscount } from '@/lib/utils';

type SortOption = 'default' | 'discount' | 'reward' | 'cheapest' | 'expensive';

export default function SpecialPage() {
  const [deal, setDeal] = useState<FlashDeal | null>(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('همه');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const { totalCount, getItemQuantity, setQuantity } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        const active = await flashDealsService.getActiveDeal();
        setDeal(active);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Real countdown timer
  useEffect(() => {
    if (!deal?.endDate) return;

    function updateRemaining() {
      const targetTime = new Date(deal!.endDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, Math.floor((targetTime - now) / 1000));

      if (diff <= 0) {
        setIsExpired(true);
        setCountdown('منقضی شده');
        return;
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      const pad = (n: number) => (n < 10 ? '۰' + toFa(n) : toFa(n));
      setCountdown(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);
    return () => clearInterval(interval);
  }, [deal]);

  const rawItems = deal?.items || [];
  const hasActiveDeal = !loading && deal && !isExpired && rawItems.length > 0;

  // Build full categories list from items + standard categories matching mockup
  const categoriesList = useMemo(() => {
    const set = new Set<string>();
    rawItems.forEach((it) => {
      const c = it.categoryName || it.product?.category?.name;
      if (c) set.add(c);
    });
    // Ensure standard mockup categories appear
    ['سوپرمارکت', 'خانه و آشپزخانه', 'زیبایی', 'دیجیتال'].forEach((c) => set.add(c));
    return ['همه', ...Array.from(set)];
  }, [rawItems]);

  // Filter and sort items
  const processedItems = useMemo(() => {
    let list = [...rawItems];

    if (selectedCategory !== 'همه') {
      list = list.filter((it) => {
        const c = it.categoryName || it.product?.category?.name || 'سوپرمارکت';
        return c === selectedCategory;
      });
    }

    if (sortOption === 'discount') {
      list.sort((a, b) => Number(b.discountPercentage || 0) - Number(a.discountPercentage || 0));
    } else if (sortOption === 'reward') {
      list.sort((a, b) => Number(b.cashbackAmount || 0) - Number(a.cashbackAmount || 0));
    } else if (sortOption === 'cheapest') {
      list.sort((a, b) => Number(a.specialPrice || 0) - Number(b.specialPrice || 0));
    } else if (sortOption === 'expensive') {
      list.sort((a, b) => Number(b.specialPrice || 0) - Number(a.specialPrice || 0));
    }

    return list;
  }, [rawItems, selectedCategory, sortOption]);

  const sortLabels: Record<SortOption, string> = {
    default: 'پیش‌فرض',
    discount: 'بیشترین تخفیف',
    reward: 'بیشترین پاداش خرید',
    cheapest: 'ارزان‌ترین',
    expensive: 'گران‌ترین',
  };

  return (
    <AppShell>
      <TopPromo />

      {/* Header: Title on Right, Cart Icon with zero-badge on Left, NO back button */}
      <header className="sticky top-0 z-20 -mx-4 -mt-3.5 mb-3 flex items-center justify-between bg-white px-4 py-3 border-b border-[#eff2f0]/90">
        <h1 className="text-[20px] font-black text-sn-text tracking-tight">
          شگفت‌انگیز
        </h1>

        <Link
          href="/cart"
          className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[11px] border border-sn-line bg-white text-[#45584e] hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="سبد خرید"
        >
          <Icon name="cart" size={19} />
          {/* Badge: Shows ۰ when cart is empty as requested */}
          <span className="absolute -top-1.5 -left-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-sn-green px-1 text-[9.5px] font-black text-white border-2 border-white shadow-sm leading-none">
            {totalCount === 0 ? '۰' : toFa(totalCount)}
          </span>
        </Link>
      </header>

      {loading ? (
        <div className="py-20 text-center text-sn-muted text-xs">
          در حال بارگذاری پیشنهادهای شگفت‌انگیز...
        </div>
      ) : !hasActiveDeal ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-[16px] border border-sn-line my-4">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f4f7f5] text-sn-muted text-2xl mb-3">
            ⚡
          </span>
          <h2 className="text-[15px] font-bold text-sn-text">
            در حال حاضر پیشنهاد شگفت‌انگیزی فعال نیست
          </h2>
          <p className="mt-1.5 text-[11px] text-sn-muted leading-[1.9] max-w-[280px]">
            پیشنهادهای شگفت‌انگیز به‌صورت زمان‌دار و با تخفیف‌های ویژه ارائه می‌شوند. لطفاً بعداً بررسی کنید یا سایر کالاهای فروشگاه را مشاهده نمایید.
          </p>
          <Link href="/products" className="mt-5">
            <Button variant="default" className="h-10 px-6 text-[11.5px] font-bold">
              مشاهده محصولات فروشگاه
            </Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Campaign highlight banner with decorative background arch */}
          <section className="relative overflow-hidden p-4 rounded-[16px] bg-[#edf8f2] border border-[#dcebe2]/60">
            <span
              aria-hidden="true"
              className="absolute -left-12 -bottom-12 w-44 h-44 rounded-full border-[22px] border-[#d7ecdf]/80 pointer-events-none"
            />

            <div className="relative z-10">
              <small className="block text-[10px] font-bold text-sn-green">
                {deal.badgeText || 'پیشنهادهای محدود امروز'}
              </small>
              <h2 className="text-[20px] font-black text-sn-text my-1 leading-tight">
                {deal.title || 'تخفیف شگفت‌انگیز'}
              </h2>
              {deal.description && (
                <p className="text-[10px] text-[#6b7b73] m-0">
                  {deal.description}
                </p>
              )}
              <div className="mt-3.5 pt-2.5 border-t border-[#d4e7dc] flex items-center justify-between text-[11px]">
                <span className="text-[#51675c] font-medium">زمان باقی‌مانده</span>
                <b className="text-[15px] font-black text-sn-green tracking-widest" dir="ltr">
                  {countdown}
                </b>
              </div>
            </div>
          </section>

          {/* Horizontal Swipeable Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-4 scrollbar-none select-none -mx-4 px-4">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-[10px] text-[11px] font-bold px-4 py-1.5 shrink-0 transition-all border cursor-pointer ${
                    isActive
                      ? 'bg-[#edf8f2] border-sn-green text-sn-green shadow-none'
                      : 'bg-white border-sn-line text-[#607268] hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Meta count + Sort button row */}
          <div className="flex items-center justify-between my-3 text-[11px]">
            <span className="text-[#65776e] font-medium">
              {toFa(processedItems.length)} کالا در فروش ویژه
            </span>

            <button
              type="button"
              onClick={() => setIsSortOpen(true)}
              className="text-sn-green font-bold text-[11.5px] hover:underline cursor-pointer border-0 bg-transparent p-0 flex items-center gap-1"
            >
              مرتب‌سازی
              {sortOption !== 'default' && (
                <span className="text-[10px] text-[#556960] font-normal">
                  ({sortLabels[sortOption]})
                </span>
              )}
            </button>
          </div>

          {/* Product deals vertical grid */}
          <div className="grid gap-3 mb-6">
            {processedItems.map((item) => {
              const rawProd = (item.product as any) || {};
              const name = item.productName || rawProd.name || 'کالای شگفت‌انگیز';
              const slug = item.productSlug || rawProd.slug || '';
              const image = item.imageUrl || rawProd.images?.[0]?.url || rawProd.image || '/assets/products/oil.jpg';
              const originalPrice = Number(item.originalPrice ?? rawProd.basePrice ?? 0);
              const specialPrice = Number(item.specialPrice ?? rawProd.salePrice ?? 0);
              const reward = Number(item.cashbackAmount ?? rawProd.refereeRewardValue ?? 0);
              const categoryName = item.categoryName || rawProd.category?.name || 'سوپرمارکت';
              const stockQuantity =
                item.stockLimit !== null && item.stockLimit !== undefined
                  ? Math.max(0, item.stockLimit - (item.soldCount || 0))
                  : (rawProd.stockQuantity ?? 10);

              const productObj: Product = {
                id: item.productId || item.id,
                name,
                slug,
                description: rawProd.description || name,
                basePrice: originalPrice,
                price: specialPrice,
                oldPrice: originalPrice > specialPrice ? originalPrice : null,
                reward,
                image,
                categories: [categoryName],
                stockQuantity,
              };

              const qty = getItemQuantity(productObj.id);
              const discountPercent = calculateDiscount(
                productObj.price ?? 0,
                productObj.oldPrice
              );

              return (
                <article
                  key={item.id}
                  className="p-3.5 rounded-[16px] bg-white border border-sn-line/70 shadow-sm flex flex-col justify-between"
                >
                  {/* Top: Right Image, Left Info */}
                  <div className="grid grid-cols-[84px_1fr] gap-3 items-center">
                    {/* Right Image */}
                    <Link href={`/products/${productObj.slug}`} className="block shrink-0">
                      <div className="h-[84px] w-[84px] rounded-[12px] bg-[#f8faf9] flex items-center justify-center overflow-hidden border border-sn-line/40 p-1">
                        <img
                          src={productObj.image || '/assets/products/oil.jpg'}
                          alt={productObj.name}
                          className="h-full w-full object-contain pointer-events-none"
                        />
                      </div>
                    </Link>

                    {/* Left Info */}
                    <div className="flex flex-col overflow-hidden text-right">
                      <Link
                        href={`/products/${productObj.slug}`}
                        className="text-[13px] font-bold text-sn-text hover:text-sn-green transition-colors leading-snug line-clamp-2"
                      >
                        {productObj.name}
                      </Link>
                      <p className="text-[9.5px] text-[#83918a] my-1">
                        {productObj.categories?.[0] || 'سوپرمارکت'} · موجود در انبار
                      </p>
                      <div className="mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] bg-[#edf8f2] text-sn-green text-[9px] font-bold">
                          پاداش خرید + {toFa(productObj.reward)} تومان
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Right Prices, Left Quantity button */}
                  <div className="flex items-center justify-between border-t border-[#eef1ef] pt-3 mt-2.5">
                    {/* Right side: Prices & Discount */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13.5px] font-black text-sn-text">
                        {formatMoney(productObj.price)}
                      </span>
                      {productObj.oldPrice && (
                        <span className="text-[10px] text-[#a3aaa6] line-through">
                          {toFa(productObj.oldPrice)}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className="text-[8.5px] font-bold text-sn-green bg-sn-pale px-1.5 py-0.5 rounded-[4px]">
                          تخفیف {toFa(discountPercent)}٪
                        </span>
                      )}
                    </div>

                    {/* Left side: Quantity Control */}
                    <QuantityControl
                      value={qty}
                      onChange={(val) => setQuantity(productObj, val)}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* Sort Bottom Sheet Modal */}
      {isSortOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity"
            onClick={() => setIsSortOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto bg-white rounded-t-[24px] p-4 pb-8 shadow-2xl border-t border-sn-line">
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-[#d5ddd8] rounded-full mx-auto mb-3" />

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-sn-line/60">
              <h3 className="text-[14px] font-bold text-sn-text">مرتب‌سازی بر اساس</h3>
              <button
                type="button"
                onClick={() => setIsSortOpen(false)}
                className="text-[#889890] hover:text-sn-text text-[16px] font-bold p-1 leading-none cursor-pointer border-0 bg-transparent"
              >
                ✕
              </button>
            </div>

            {/* Options List */}
            <div className="flex flex-col gap-1 mt-2">
              {(
                [
                  { id: 'default', label: 'پیش‌فرض' },
                  { id: 'discount', label: 'بیشترین تخفیف' },
                  { id: 'reward', label: 'بیشترین پاداش خرید' },
                  { id: 'cheapest', label: 'ارزان‌ترین' },
                  { id: 'expensive', label: 'گران‌ترین' },
                ] as const
              ).map((opt) => {
                const isSelected = sortOption === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSortOption(opt.id);
                      setIsSortOpen(false);
                    }}
                    className={`flex items-center justify-between p-3 rounded-[12px] text-[12.5px] text-right transition-colors cursor-pointer border-0 ${
                      isSelected
                        ? 'bg-[#edf8f2] text-sn-green font-bold'
                        : 'bg-transparent text-sn-text hover:bg-slate-50 font-normal'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <span className="text-sn-green font-bold text-[14px]">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </AppShell>
  );
}
