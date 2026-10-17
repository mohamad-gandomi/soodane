'use client';

import React from 'react';
import Link from 'next/link';
import { QuantityControl } from '@/components/shared/quantity-control';
import { Button } from '@/components/ui/button';

interface ProductBuyBarProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  onAddToCart: () => void;
  cartHref?: string;
}

export function ProductBuyBar({
  quantity,
  onQuantityChange,
  onAddToCart,
  cartHref = '/cart',
}: ProductBuyBarProps) {
  return (
    <footer className="fixed bottom-0 right-1/2 translate-x-1/2 z-40 w-full max-w-app flex items-center gap-2.5 p-3.5 pb-[max(12px,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-[12px] border-t border-sn-line shadow-[0_-4px_16px_rgba(23,51,38,0.08)]">
      <div className="h-[45px] flex items-center rounded-[9px] border border-sn-line px-1">
        <QuantityControl
          value={quantity}
          onChange={onQuantityChange}
          className="h-[37px] min-w-[80px]"
          min={1}
        />
      </div>

      <Link href={cartHref} className="flex-1" onClick={onAddToCart}>
        <Button className="w-full h-[45px] text-[12px] font-black">
          افزودن به سبد
        </Button>
      </Link>
    </footer>
  );
}
