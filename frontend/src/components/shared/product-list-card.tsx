'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { calculateDiscount, formatMoney, toFa } from '@/lib/utils';
import { QuantityControl } from './quantity-control';

interface ProductListCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

export function ProductListCard({ product, quantity, onQuantityChange }: ProductListCardProps) {
  const discountPercent = calculateDiscount(product.price ?? 0, product.oldPrice);
  const available = product.manageStock !== true || product.stockQuantity > 0;
  const variable = product.productType === 'VARIABLE';
  const maxQuantity = product.manageStock === true ? Math.min(10, product.stockQuantity) : 10;

  return (
    <article className="rounded-[16px] border border-sn-line bg-white p-3.5 flex flex-col gap-2.5 shadow-sm hover:border-sn-green/30 transition-colors">
      <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 items-start">
        <Link href={`/products/${product.slug}`} className="block">
          <div className="h-[88px] w-[88px] rounded-[12px] bg-[#f8faf9] overflow-hidden border border-sn-line/30">
            <img
              src={product.image || '/assets/products/rice.png'}
              alt={product.images?.[0]?.altText || product.name}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
        </Link>
        <div className="min-w-0">
          <Link href={`/products/${product.slug}`} className="text-[13px] font-bold text-sn-text leading-snug hover:text-sn-green transition-colors line-clamp-2">
            {product.name}
          </Link>
          {product.shortDescription && <p className="mt-1 text-[10px] leading-relaxed text-sn-muted line-clamp-1">{product.shortDescription}</p>}
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {(product.reward ?? 0) > 0 && (
              <span className="inline-flex px-2 py-0.5 rounded-[5px] bg-sn-pale text-sn-green text-[9px] font-bold">
                پاداش خرید + {toFa(product.reward)} تومان
              </span>
            )}
            <span className="inline-flex px-2 py-0.5 rounded-[5px] bg-[#f0f4f2] text-[#718279] text-[8.5px] font-medium">
              {variable ? 'انتخاب گزینه‌ها' : available ? 'موجود' : 'ناموجود'}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#edf0ee] pt-2.5 mt-1">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <strong className="text-[13.5px] font-black text-sn-text">{formatMoney(product.price)}</strong>
          {discountPercent > 0 && (
            <>
              <span className="text-[10px] text-[#a3aaa6] line-through">{toFa(product.oldPrice)}</span>
              <span className="text-[8.5px] font-bold text-[#2c7b5c] bg-[#eef8f3] px-1.5 py-0.5 rounded-[5px]">
                تخفیف {toFa(discountPercent)}٪
              </span>
            </>
          )}
        </div>
        {variable ? (
          <Link href={`/products/${product.slug}`} className="rounded-[7px] bg-sn-pale px-3 py-2 text-[9px] font-bold text-sn-green">انتخاب گزینه‌ها</Link>
        ) : available ? (
          <QuantityControl value={quantity} onChange={onQuantityChange} max={maxQuantity} />
        ) : <span className="text-[10px] text-sn-muted">فعلاً ناموجود</span>}
      </div>
    </article>
  );
}
