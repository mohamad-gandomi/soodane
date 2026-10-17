'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { TransactionRow } from '@/components/rewards/transaction-row';
import { Sheet } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { walletService } from '@/services/wallet.service';
import { WalletTransaction } from '@/types/wallet';
import { toFa, cn } from '@/lib/utils';
import { toast } from 'sonner';

const FILTER_TYPES = [
  { id: 'all', label: 'همه' },
  { id: 'خرید', label: 'پاداش خرید' },
  { id: 'معرفی', label: 'معرفی مستقیم' },
  { id: 'مصرف', label: 'مصرف پاداش' },
  { id: 'اصلاح', label: 'اصلاحات' },
];

const DATE_OPTIONS = [
  { id: '7d', label: '۷ روز گذشته', days: 7 },
  { id: '30d', label: '۳۰ روز گذشته', days: 30 },
  { id: '90d', label: '۳ ماه گذشته', days: 90 },
  { id: 'all', label: 'همه زمان‌ها', days: 9999 },
];

function formatGroupDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'سایر تاریخ‌ها';
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const formatted = date.toLocaleDateString('fa-IR', {
    day: 'numeric',
    month: 'long',
  });

  return isToday ? `امروز، ${formatted}` : formatted;
}

export default function RewardTransactionsPage() {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDateOption, setSelectedDateOption] = useState(DATE_OPTIONS[1]); // 30 days
  const [tempDateOption, setTempDateOption] = useState(DATE_OPTIONS[1]);
  const [isDateSheetOpen, setIsDateSheetOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [walletData, list] = await Promise.all([
          walletService.getBalance(),
          walletService.getTransactions(100, 0),
        ]);
        setTotalEarned(walletData.totalEarned);
        setTransactions(list);
      } catch (err) {
        console.error('Error loading transactions:', err);
      }
    }
    loadData();
  }, []);

  // Filter transactions based on category & date
  const filteredTransactions = useMemo(() => {
    const now = Date.now();
    const maxAgeMs = selectedDateOption.days * 24 * 60 * 60 * 1000;

    return transactions.filter((tx) => {
      // Category filter
      if (selectedType !== 'all' && tx.category !== selectedType) {
        return false;
      }

      // Date filter
      const txTime = new Date(tx.createdAt).getTime();
      if (!isNaN(txTime) && now - txTime > maxAgeMs) {
        return false;
      }

      return true;
    });
  }, [transactions, selectedType, selectedDateOption]);

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const groups: { [dateLabel: string]: WalletTransaction[] } = {};
    filteredTransactions.forEach((tx) => {
      const groupLabel = formatGroupDate(tx.createdAt);
      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
      }
      groups[groupLabel].push(tx);
    });
    return Object.entries(groups).map(([date, items]) => ({ date, items }));
  }, [filteredTransactions]);

  // Export report as CSV
  const handleDownloadReport = () => {
    if (transactions.length === 0) {
      toast.info('تراکنشی برای دریافت گزارش وجود ندارد');
      return;
    }

    const headers = 'شناسه,عنوان,توضیحات,مبلغ (تومان),دسته‌بندی,وضعیت,تاریخ\n';
    const rows = filteredTransactions
      .map((t) =>
        `"${t.id}","${t.title || ''}","${t.copy || ''}",${t.amount},"${t.category || ''}","${t.statusTag || ''}","${new Date(t.createdAt).toLocaleDateString('fa-IR')}"`
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `soodane-rewards-report-${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('گزارش تراکنش‌ها دریافت شد');
  };

  return (
    <AppShell hasBottomNav={false}>
      <TopPromo />

      {/* Header: Back button on right, centered title 'همه تراکنش‌ها' */}
      <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-sn-line/50 bg-[#fbfdfc]/95 px-4 backdrop-blur-md">
        <Link
          href="/rewards"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 active:scale-95 transition-all shadow-none"
          aria-label="بازگشت"
        >
          <svg
            className="w-4 h-4 text-[#506459]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        <h1 className="text-[14px] font-black text-sn-text">همه تراکنش‌ها</h1>

        <div className="w-8" aria-hidden="true" />
      </header>

      <main className="px-3.5 pt-3 pb-16">
        {/* Top Summary Banner matching Image 3 */}
        <section className="p-3.5 rounded-[14px] bg-[#f0f9f4] border border-[#d2edd9] flex items-center justify-between mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div>
            <span className="block text-[11px] font-bold text-[#455c50]">
              کل پاداش دریافت‌شده
            </span>
            <b className="block text-[17px] font-black text-sn-green mt-0.5">
              {toFa(totalEarned)} <span className="text-[11px] font-normal text-[#455c50]">تومان</span>
            </b>
          </div>

          <button
            type="button"
            onClick={handleDownloadReport}
            className="h-8 px-3 rounded-[8px] border border-[#b2ddc4] bg-white text-sn-green text-[10.5px] font-bold flex items-center gap-1.5 shadow-sm hover:bg-[#f6fcf8] active:scale-95 transition-all cursor-pointer"
          >
            <svg
              className="w-3.5 h-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>دریافت گزارش</span>
          </button>
        </section>

        {/* Category Filter Chips (scrollable horizontal row) */}
        <div className="flex gap-2 my-3 overflow-x-auto pb-1 scrollbar-none">
          {FILTER_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedType(t.id)}
              className={cn(
                'h-[32px] shrink-0 rounded-full border px-3.5 text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer',
                selectedType === t.id
                  ? 'border-[#8ed0a8] bg-[#eaf7ef] text-sn-green font-black shadow-none'
                  : 'border-[#dde7e1] bg-[#f6f9f7] text-[#65776d] hover:bg-[#edf2ef]'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Date Filter Selector Button */}
        <button
          type="button"
          onClick={() => {
            setTempDateOption(selectedDateOption);
            setIsDateSheetOpen(true);
          }}
          className="w-full flex items-center justify-between p-3 rounded-[11px] border border-sn-line bg-white text-right mb-2 cursor-pointer hover:border-sn-green/40 transition-colors shadow-none"
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#f2f6f4] text-[#55695e]">
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <div>
              <b className="block text-[11px] font-bold text-sn-text leading-tight">
                فیلتر تاریخ
              </b>
              <p className="mt-0.5 text-[9.5px] text-[#86958d] leading-tight">
                {selectedDateOption.label}
              </p>
            </div>
          </div>

          <svg
            className="w-4 h-4 text-[#86958d] shrink-0 select-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>

        {/* Count Meta text */}
        <p className="text-[9.5px] text-[#86958d] mb-3 px-1 font-medium">
          {toFa(filteredTransactions.length)} تراکنش در بازه انتخاب‌شده
        </p>

        {/* Grouped Transactions List matching Image 3 */}
        {groupedTransactions.length > 0 ? (
          <div className="flex flex-col gap-3">
            {groupedTransactions.map((group) => (
              <div key={group.date} className="flex flex-col gap-2">
                <h3 className="text-[11px] font-black text-[#5c6e64] px-1">
                  {group.date}
                </h3>
                {group.items.map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-[14px] border border-sn-line my-4">
            <p className="text-[12px] font-bold text-sn-text">
              تراکنشی در این بازه یافت نشد
            </p>
            <p className="text-[10px] text-sn-muted mt-1">
              فیلترهای انتخابی را تغییر دهید.
            </p>
          </div>
        )}

        {/* Date Filter Sheet */}
        <Sheet
          isOpen={isDateSheetOpen}
          onClose={() => setIsDateSheetOpen(false)}
          title="فیلتر تاریخ"
        >
          <div className="flex flex-col gap-2 my-4">
            {DATE_OPTIONS.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setTempDateOption(d)}
                className={cn(
                  'h-11 px-4 rounded-[10px] border text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer',
                  tempDateOption.id === d.id
                    ? 'border-sn-green bg-[#eaf7ef] text-sn-green font-black'
                    : 'border-[#dde7e1] text-sn-text hover:bg-[#f6f9f7]'
                )}
              >
                <span>{d.label}</span>
                {tempDateOption.id === d.id && <span className="text-sm">✓</span>}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-sn-line">
            <Button
              variant="secondary"
              onClick={() => setIsDateSheetOpen(false)}
            >
              انصراف
            </Button>
            <Button
              variant="default"
              onClick={() => {
                setSelectedDateOption(tempDateOption);
                setIsDateSheetOpen(false);
              }}
            >
              اعمال فیلتر
            </Button>
          </div>
        </Sheet>
      </main>
    </AppShell>
  );
}
