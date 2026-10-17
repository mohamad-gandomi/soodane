import React from 'react';
import { formatMoney } from '@/lib/utils';

interface CartSummaryCardProps {
  oldTotal: number;
  discountTotal: number;
  totalReward: number;
  subtotal: number;
}

export function CartSummaryCard({
  oldTotal,
  discountTotal,
  totalReward,
  subtotal,
}: CartSummaryCardProps) {
  return (
    <section className="mt-5 p-3.5 rounded-[11px] border border-sn-line bg-white">
      <h2 className="text-[12px] font-bold text-sn-text mb-3">خلاصه سبد</h2>

      <div className="flex flex-col gap-2.5 text-[10px]">
        <div className="flex justify-between text-[#77867e]">
          <span>مبلغ کالاها</span>
          <b className="text-[#40564a]">{formatMoney(oldTotal)}</b>
        </div>

        {discountTotal > 0 && (
          <div className="flex justify-between text-[#77867e]">
            <span>تخفیف کالاها</span>
            <b className="text-sn-danger">− {formatMoney(discountTotal)}</b>
          </div>
        )}

        {totalReward > 0 && (
          <div className="flex justify-between text-sn-green font-bold">
            <span>پاداشی که دریافت می‌کنید</span>
            <b>+ {formatMoney(totalReward)}</b>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-sn-line pt-3 mt-1 text-[12px] font-black text-sn-text">
          <span>مبلغ قابل پرداخت</span>
          <b>{formatMoney(subtotal)}</b>
        </div>

        <div className="flex items-center justify-end gap-1.5 mt-2.5 text-[9.5px] text-[#718279]">
          <span>قیمت و موجودی کالاها پیش از ادامه بررسی می‌شود.</span>
          <svg
            className="w-3.5 h-3.5 text-sn-green shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      </div>
    </section>
  );
}
