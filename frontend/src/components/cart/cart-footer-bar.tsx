import React from 'react';
import Link from 'next/link';
import { formatMoney } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartFooterBarProps {
  payableAmount: number;
  actionText?: string;
  actionHref: string;
  disabled?: boolean;
}

export function CartFooterBar({
  payableAmount,
  actionText = 'تأیید و ادامه',
  actionHref,
  disabled = false,
}: CartFooterBarProps) {
  return (
    <footer className="fixed bottom-0 right-1/2 translate-x-1/2 z-40 w-full max-w-app flex items-center justify-between gap-3 p-3.5 pb-[max(12px,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-[12px] border-t border-sn-line shadow-[0_-4px_16px_rgba(23,51,38,0.08)]">
      <div className="shrink-0 text-right">
        <small className="block text-[9.5px] text-[#8e9d95] font-normal leading-none mb-1">
          مبلغ قابل پرداخت
        </small>
        <strong className="block text-[15px] font-black text-sn-text leading-tight">
          {formatMoney(payableAmount)}
        </strong>
      </div>

      <Link href={actionHref} className={`flex-1 ${disabled ? 'pointer-events-none' : ''}`}>
        <Button
          disabled={disabled}
          className="w-full h-[48px] rounded-[10px] bg-sn-green hover:bg-[#116949] text-white font-bold text-[13px] shadow-none"
        >
          {actionText}
        </Button>
      </Link>
    </footer>
  );
}
