'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { TopHeader } from '@/components/layout/top-header';
import { CartItemRow } from '@/components/cart/cart-item-row';
import { CartSummaryCard } from '@/components/cart/cart-summary-card';
import { CartFooterBar } from '@/components/cart/cart-footer-bar';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { toFaDigits } from '@/lib/utils';

export default function CartPage() {
  const {
    items,
    totalCount,
    subtotal,
    oldTotal,
    discountTotal,
    totalReward,
    setQuantity,
    removeFromCart,
  } = useCart();

  return (
    <AppShell hasBottomNav={false} className="pb-[95px]">
      <TopPromo />

      <TopHeader title="سبد خرید" backHref="/">
        {totalCount > 0 && (
          <span className="text-[12px] text-[#8e9d95] font-medium whitespace-nowrap">
            {toFaDigits(totalCount)} کالا
          </span>
        )}
      </TopHeader>

      {items.length > 0 ? (
        <div className="flex flex-col gap-2.5">
          {items.map((item) => (
            <CartItemRow
              key={item.product.id}
              product={item.product}
              quantity={item.quantity}
              onQuantityChange={(qty) => setQuantity(item.product, qty)}
              onRemove={() => removeFromCart(item.product.id)}
            />
          ))}

          <CartSummaryCard
            oldTotal={oldTotal}
            discountTotal={discountTotal}
            totalReward={totalReward}
            subtotal={subtotal}
          />
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center">
          <EmptyState
            message="سبد خرید شما در حال حاضر خالی است."
            icon="🛒"
          />
          <Link href="/products" className="mt-4">
            <Button variant="default">مشاهده همه کالاها</Button>
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <CartFooterBar
          payableAmount={subtotal}
          actionHref="/checkout"
          actionText="تأیید و ادامه"
        />
      )}
    </AppShell>
  );
}
