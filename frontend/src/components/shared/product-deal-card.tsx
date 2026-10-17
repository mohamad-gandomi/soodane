import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatMoney, toFa, calculateDiscount } from '@/lib/utils';
import { QuantityControl } from './quantity-control';

interface ProductDealCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export function ProductDealCard({
  product,
  quantity,
  onQuantityChange,
}: ProductDealCardProps) {
  const discountPercent = calculateDiscount(product.price ?? 0, product.oldPrice);

  return (
    <article className="min-w-[280px] max-w-[280px] rounded-[16px] bg-white p-3 shadow-sm border border-sn-line/60 flex flex-col justify-between shrink-0 select-none">
      {/* Top Section: Image on Right, Copy on Left in RTL */}
      <div className="grid grid-cols-[76px_1fr] gap-2.5 items-center">
        {/* Right Image */}
        <Link href={`/products/${product.slug}`} className="block">
          <div className="h-[76px] w-[76px] rounded-[10px] bg-[#f8faf9] flex items-center justify-center overflow-hidden shrink-0 border border-sn-line/30">
            <img
              src={product.image || '/assets/products/oil.jpg'}
              alt={product.images?.[0]?.altText || product.name}
              draggable={false}
              className="h-full w-full object-contain p-1 pointer-events-none"
            />
          </div>
        </Link>

        {/* Left Copy */}
        <div className="flex flex-col overflow-hidden">
          <Link
            href={`/products/${product.slug}`}
            className="text-[12px] font-bold text-sn-text truncate hover:text-sn-green transition-colors"
          >
            {product.name}
          </Link>
          <p className="text-[9px] text-[#83918a] my-1">
            {product.categories?.[0] || 'سوپرمارکت'} · موجود در انبار
          </p>
          <div className="mt-0.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-[5px] bg-[#edf8f2] text-sn-green text-[8.5px] font-bold">
              پاداش خرید: + {toFa(product.reward)} تومان
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex items-center justify-between border-t border-[#eef1ef] pt-2.5 mt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12.5px] font-black text-sn-text">
            {formatMoney(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-[9.5px] text-[#a3aaa6] line-through">
              {toFa(product.oldPrice)}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="text-[8px] font-bold text-sn-green bg-sn-pale px-1 rounded-[4px]">
              تخفیف {toFa(discountPercent)}٪
            </span>
          )}
        </div>

        <QuantityControl value={quantity} onChange={onQuantityChange} />
      </div>
    </article>
  );
}
