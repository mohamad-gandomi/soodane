'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatMoney, toFa } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { QuantityControl } from '@/components/shared/quantity-control';

interface CartItemRowProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onRemove: () => void;
}

export function CartItemRow({
  product,
  quantity,
  onQuantityChange,
  onRemove,
}: CartItemRowProps) {
  const itemTotal = (product.price ?? 0) * quantity;

  return (
    <article className="p-3 rounded-[11px] border border-sn-line bg-white grid grid-cols-[67px_1fr] gap-2.5 items-center">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="h-[67px] w-[67px] rounded-[9px] bg-[#f2f8f4] flex items-center justify-center overflow-hidden border border-sn-line/30 shrink-0">
          <img
            src={product.image || '/assets/products/rice.png'}
            alt={product.images?.[0]?.altText || product.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="flex flex-col justify-between overflow-hidden">
        <Link
          href={`/products/${product.slug}`}
          className="text-[12px] font-bold text-sn-text truncate hover:text-sn-green transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-[9px] text-[#84918a] my-0.5">
          سوپرمارکت · موجود در انبار
        </p>
        <Badge variant="default" className="w-fit">
          پاداش + {toFa(product.reward)} تومان
        </Badge>
      </div>

      <div className="col-span-2 flex items-center justify-between border-t border-[#eef1ef] pt-2.5 mt-0.5">
        <QuantityControl value={quantity} onChange={onQuantityChange} />

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-black text-sn-text">
            {formatMoney(itemTotal)}
          </span>

          <button
            type="button"
            onClick={onRemove}
            className="w-7 h-7 rounded-[7px] flex items-center justify-center text-[#a18f8f] hover:text-sn-danger hover:bg-sn-danger/10 transition-colors cursor-pointer"
            aria-label="حذف از سبد"
          >
            <Icon name="trash" size={16} />
          </button>
        </div>
      </div>
    </article>
  );
}
