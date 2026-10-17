import React from 'react';
import { calculateDiscount, formatMoney, toFa } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface ProductPriceCardProps {
  price: number;
  oldPrice?: number | null;
}

export function ProductPriceCard({ price, oldPrice }: ProductPriceCardProps) {
  const discountPercent = calculateDiscount(price, oldPrice);

  return (
    <div className="mt-4 flex items-center justify-between p-3.5 rounded-[11px] border border-sn-line bg-white shadow-none">
      <div>
        <small className="block text-[9px] text-[#88958e]">قیمت محصول</small>
        {oldPrice && oldPrice > price && (
          <div className="flex items-center gap-2 mt-0.5">
            <small className="text-[10px] text-[#a0aaa5] line-through">
              {formatMoney(oldPrice)}
            </small>
            {discountPercent > 0 && (
              <Badge variant="discount">
                {toFa(discountPercent)}٪ تخفیف
              </Badge>
            )}
          </div>
        )}
      </div>

      <strong className="text-[19px] font-black text-sn-text">
        {formatMoney(price)}
      </strong>
    </div>
  );
}
