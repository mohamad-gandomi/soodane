'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatMoney, toFa, calculateDiscount } from '@/lib/utils';
import { QuantityControl } from '@/components/shared/quantity-control';
import { useCart } from '@/context/cart-context';

interface RecommendedProductsProps {
  products: Product[];
}

export function RecommendedProducts({ products }: RecommendedProductsProps) {
  const { getItemQuantity, setQuantity } = useCart();

  return (
    <section className="mt-6 mb-8">
      {/* Header: Title on right, View All on left */}
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[14px] font-black text-sn-text">پیشنهاد برای شما</h2>
        <Link
          href="/products"
          className="text-[10.5px] font-bold text-sn-green hover:underline"
        >
          مشاهده همه
        </Link>
      </div>

      {/* Vertical List of Full-Width Cards (حد اکثر ۴ محصول) */}
      <div className="flex flex-col gap-3">
        {products.slice(0, 4).map((product) => {
          const qty = getItemQuantity(product.id);
          const discountPercent = calculateDiscount(
            product.price ?? 0,
            product.oldPrice
          );

          return (
            <article
              key={product.id}
              className="rounded-[16px] border border-sn-line bg-white p-3.5 flex flex-col gap-2.5 shadow-sm hover:border-sn-green/30 transition-all"
            >
              {/* Top Row: Image on the RIGHT (col 1 in RTL); Title, Rating, Badges on LEFT (col 2 in RTL) */}
              <div className="grid grid-cols-[88px_1fr] gap-3 items-start">
                {/* 1. Product Image on the RIGHT */}
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="h-[88px] w-[88px] rounded-[12px] bg-[#f8faf9] flex items-center justify-center overflow-hidden shrink-0 border border-sn-line/30">
                    <img
                      src={product.image || '/assets/products/rice.png'}
                      alt={product.images?.[0]?.altText || `تصویر ${product.name}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>

                {/* 2. Text Info on the LEFT */}
                <div className="flex flex-col overflow-hidden">
                  <Link
                    href={`/products/${product.slug}`}
                    className="text-[13px] font-bold text-sn-text leading-snug hover:text-sn-green transition-colors line-clamp-1"
                  >
                    {product.name}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-[10px] text-sn-muted mt-1">
                    <span className="text-amber-500 font-bold">★ ۴.۸</span>
                    <span>(۱۲۵)</span>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] bg-sn-pale text-sn-green text-[9px] font-bold">
                      پاداش خرید + {toFa(product.reward)} تومان
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] bg-[#f0f4f2] text-[#718279] text-[8.5px] font-medium">
                      موجود
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Price + Discount on right; Quantity/Add on left */}
              <div className="flex items-center justify-between border-t border-[#edf0ee] pt-2.5 mt-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[13.5px] font-black text-sn-text">
                    {formatMoney(product.price)}
                  </span>

                  {product.oldPrice && (
                    <span className="text-[10px] text-[#a3aaa6] line-through">
                      {toFa(product.oldPrice)}
                    </span>
                  )}

                  {discountPercent > 0 && (
                    <span className="text-[8.5px] font-bold text-[#2c7b5c] bg-[#eef8f3] px-1.5 py-0.5 rounded-[5px]">
                      تخفیف {toFa(discountPercent)}٪
                    </span>
                  )}
                </div>

                <QuantityControl
                  value={qty}
                  onChange={(val) => setQuantity(product, val)}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
