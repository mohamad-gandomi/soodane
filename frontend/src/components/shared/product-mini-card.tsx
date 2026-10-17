import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { formatMoney, toFa } from '@/lib/utils';
import { QuantityControl } from './quantity-control';

interface ProductMiniCardProps {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
}

export function ProductMiniCard({
  product,
  quantity,
  onQuantityChange,
}: ProductMiniCardProps) {
  return (
    <article className="min-w-[148px] max-w-[148px] overflow-hidden rounded-[11px] border border-sn-line bg-white flex flex-col justify-between shrink-0 hover:border-sn-green/30 transition-colors">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="h-[94px] w-full bg-[#f4f8f5] flex items-center justify-center overflow-hidden">
          <img
            src={product.image || '/assets/products/rice.png'}
            alt={product.images?.[0]?.altText || product.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>

      <div className="p-2.5 flex-1 flex flex-col justify-between">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="block text-[11px] font-bold text-sn-text leading-tight truncate hover:text-sn-green transition-colors"
          >
            {product.name}
          </Link>
          <small className="block mt-1 text-[8px] text-sn-green font-bold">
            پاداش خرید + {toFa(product.reward)} تومان
          </small>
        </div>

        <div className="mt-2.5 pt-1.5 flex flex-col gap-2">
          <strong className="text-[12px] font-extrabold text-sn-text">
            {formatMoney(product.price)}
          </strong>
          <QuantityControl
            value={quantity}
            onChange={onQuantityChange}
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
