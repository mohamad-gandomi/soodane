'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { FlashDeal } from '@/types/flash-deal';
import { Product } from '@/types/product';
import { ProductDealCard } from '@/components/shared/product-deal-card';
import { useCart } from '@/context/cart-context';
import { toFa } from '@/lib/utils';

interface SpecialDealsPreviewProps {
  deal: FlashDeal;
}

export function SpecialDealsPreview({ deal }: SpecialDealsPreviewProps) {
  const { getItemQuantity, setQuantity } = useCart();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [countdown, setCountdown] = useState('');
  const [isExpired, setIsExpired] = useState(false);

  // Real countdown timer based on deal.endDate
  useEffect(() => {
    if (!deal?.endDate) return;

    function updateRemaining() {
      const targetTime = new Date(deal.endDate).getTime();
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
    const timer = setInterval(updateRemaining, 1000);
    return () => clearInterval(timer);
  }, [deal?.endDate]);

  if (isExpired || !deal.items || deal.items.length === 0) {
    return null;
  }

  // Desktop drag to scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsMouseDown(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const dealProducts: Product[] = deal.items.map((item) => {
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

    return {
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
  });

  return (
    <section className="mt-6 -mx-4 p-4 bg-[#edf8f2] border-y border-[#dcebe2]/50">
      {/* Header: Title on right, Countdown on left */}
      <div className="flex items-center justify-between mb-3.5">
        <div>
          <small className="text-[10px] font-bold text-sn-green block">
            {deal.badgeText || 'فروش ویژه'}
          </small>
          <h2 className="text-[18px] font-black text-sn-text leading-tight mt-0.5">
            {deal.title || 'تخفیف شگفت‌انگیز'}
          </h2>
        </div>

        <div className="text-[15px] font-black text-sn-green tracking-widest select-none" dir="ltr">
          {countdown}
        </div>
      </div>

      {/* Horizontal Swipeable & Draggable Cards Row */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-3 overflow-x-auto pb-2 scrollbar-none select-none ${
          isMouseDown ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {dealProducts.map((p) => (
          <ProductDealCard
            key={p.id}
            product={p}
            quantity={getItemQuantity(p.id)}
            onQuantityChange={(qty) => setQuantity(p, qty)}
          />
        ))}
      </div>

      {/* Bottom Centered Link */}
      <div className="mt-3 text-center">
        <Link
          href="/special"
          className="text-[11px] font-bold text-sn-green hover:underline inline-block py-1"
        >
          مشاهده همه فروش‌های ویژه
        </Link>
      </div>
    </section>
  );
}
