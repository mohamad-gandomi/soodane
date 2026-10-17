import React from 'react';
import { WalletTransaction } from '@/types/wallet';
import { toFa } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TransactionRowProps {
  transaction: WalletTransaction;
}

export function TransactionRow({ transaction }: TransactionRowProps) {
  const isPositive = transaction.amount > 0;
  const statusTag = transaction.statusTag || (isPositive ? 'فعال' : 'مصرف‌شده');

  // Select appropriate icon based on category
  const renderIcon = () => {
    switch (transaction.category) {
      case 'معرفی':
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#eaf7ef] text-sn-green shrink-0">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </span>
        );
      case 'مصرف':
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#f4f6f5] text-[#55695e] shrink-0">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </span>
        );
      case 'اصلاح':
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#e8f4f8] text-[#197587] shrink-0">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
          </span>
        );
      case 'خرید':
      default:
        return (
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#eaf7ef] text-sn-green shrink-0">
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-2z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
          </span>
        );
    }
  };

  return (
    <article className="flex items-center justify-between gap-3 p-3 rounded-[12px] border border-[#e5ebe7] bg-white transition-colors">
      <div className="flex items-center gap-2.5 min-w-0">
        {renderIcon()}

        <div className="min-w-0">
          <b className="block text-[11px] font-bold text-sn-text truncate leading-snug">
            {transaction.title || 'پاداش کیف پول'}
          </b>
          <p className="mt-0.5 text-[9.5px] text-[#86958d] truncate leading-tight">
            {transaction.copy || 'ثبت در سامانه'}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span
          className={cn(
            'text-[12px] font-black',
            isPositive ? 'text-sn-green' : 'text-sn-text'
          )}
        >
          {isPositive ? `+ ${toFa(transaction.amount)}` : `− ${toFa(Math.abs(transaction.amount))}`}{' '}
          <span className="text-[10px] font-normal">تومان</span>
        </span>

        <span
          className={cn(
            'mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold inline-block text-center',
            statusTag === 'فعال' && 'bg-[#e8f7ee] text-[#19754a]',
            statusTag === 'مصرف‌شده' && 'bg-[#f1f3f2] text-[#6b7a72]',
            statusTag === 'بازگشتی' && 'bg-[#e6f4ea] text-[#1e8e3e]'
          )}
        >
          {statusTag}
        </span>
      </div>
    </article>
  );
}
