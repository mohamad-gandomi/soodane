import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { calculateDiscount, formatMoney, toFa } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProductListCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductListCard({ product, onAddToCart }: ProductListCardProps) {
  const discountPercent = calculateDiscount(product.price ?? 0, product.oldPrice);

  return (
    <article className="grid grid-cols-[98px_1fr] gap-3.5 py-4 border-b border-sn-line last:border-b-0 items-stretch">
      {/* 1. Right Column (Image + Add Button) */}
      <div className="flex flex-col items-center justify-between gap-2">
        <Link
          href={`/products/${product.slug}`}
          className="h-[105px] w-[98px] rounded-[10px] bg-[#f5f8f6] flex items-center justify-center overflow-hidden hover:opacity-90 transition-opacity border border-sn-line/30 shrink-0"
        >
          <img
            src={product.image || '/assets/products/rice.png'}
            alt={product.images?.[0]?.altText || product.name}
            className="h-full w-full object-cover"
          />
        </Link>

        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="w-full h-[35px] rounded-[8px] bg-[rgba(23,129,90,0.09)] text-sn-green text-[11px] font-black hover:bg-[rgba(23,129,90,0.18)] active:scale-95 transition-all cursor-pointer"
        >
          + افزودن
        </button>
      </div>

      {/* 2. Left Column (Details + Price) */}
      <div className="flex flex-col justify-between overflow-hidden">
        <div>
          <Link href={`/products/${product.slug}`} className="group">
            <h2 className="text-[14px] font-bold text-sn-text group-hover:text-sn-green transition-colors line-clamp-1">
              {product.name}
            </h2>
            {product.shortDescription && (
              <p className="mt-1 text-[10px] text-sn-muted line-clamp-2 leading-[1.8]">
                {product.shortDescription}
              </p>
            )}
          </Link>
          <div className="mt-2">
            <Badge variant="default">
              پاداش خرید + {toFa(product.reward)} تومان
            </Badge>
          </div>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {discountPercent > 0 && (
            <Badge variant="discount">
              {toFa(discountPercent)}٪
            </Badge>
          )}
          {product.oldPrice && (
            <span className="text-[10px] text-[#a3aaa6] line-through">
              {toFa(product.oldPrice)}
            </span>
          )}
          <strong className="text-[14px] font-black text-sn-text">
            {formatMoney(product.price)}
          </strong>
        </div>
      </div>
    </article>
  );
}
