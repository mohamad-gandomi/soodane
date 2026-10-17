'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { BottomNav } from '@/components/layout/bottom-nav';
import { ReferralInviteCard } from '@/components/shared/referral-invite-card';
import { TransactionRow } from '@/components/rewards/transaction-row';
import { FriendsList } from '@/components/rewards/friends-list';
import { Sheet } from '@/components/ui/sheet';
import { walletService } from '@/services/wallet.service';
import { referralService } from '@/services/referral.service';
import { WalletTransaction } from '@/types/wallet';
import { ReferralStats } from '@/types/referral';
import { toFa, cn } from '@/lib/utils';

export default function RewardsPage() {
  const [balance, setBalance] = useState(0);
  const [totalPurchaseReward, setTotalPurchaseReward] = useState(0);
  const [totalReferralReward, setTotalReferralReward] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [expireNotice, setExpireNotice] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'friends'>('transactions');
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const b = await walletService.getBalance();
        setBalance(b.balance);
        setTotalPurchaseReward(b.totalPurchaseReward);
        setTotalReferralReward(b.totalReferralReward);
        setTotalEarned(b.totalEarned);
        if (b.expireNotice) {
          setExpireNotice(b.expireNotice);
        }

        const txs = await walletService.getTransactions(10, 0);
        setTransactions(txs);

        const ref = await referralService.getMyStats();
        setReferralStats(ref);
      } catch (err) {
        console.error('Error loading rewards data:', err);
      }
    }
    loadData();
  }, []);

  return (
    <AppShell>
      <TopPromo />

      {/* Header: Title 'پاداش' on right, Help '?' on left - NO back button */}
      <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-sn-line/50 bg-[#fbfdfc]/95 px-4 backdrop-blur-md">
        <h1 className="text-[17px] font-black text-sn-text">پاداش</h1>

        <button
          type="button"
          onClick={() => setIsHelpOpen(true)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-sn-line bg-white text-[13px] font-bold text-sn-muted hover:border-sn-green/40 hover:text-sn-text active:scale-95 transition-all cursor-pointer shadow-none"
          aria-label="راهنما"
        >
          ?
        </button>
      </header>

      <main className="px-3.5 pb-24">
        {/* Dark Green Wallet Card matching Image 1 */}
        <section className="relative overflow-hidden mt-3 p-4 rounded-[16px] bg-gradient-to-br from-[#105e3f] via-[#146b48] to-[#19754f] text-white shadow-sm">
          {/* Subtle ambient circle ornament */}
          <span
            aria-hidden="true"
            className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full border-[18px] border-white/5 pointer-events-none"
          />

          {/* Top row: موجودی قابل استفاده + دکمه تراکنش‌ها */}
          <div className="flex items-center justify-between relative z-10">
            <span className="text-[11px] font-medium text-[#c5edd8]">
              موجودی قابل استفاده
            </span>
            <Link
              href="/rewards/transactions"
              className="rounded-full bg-white/15 hover:bg-white/25 active:scale-95 px-3 py-1 text-[10.5px] font-bold text-white flex items-center gap-1 transition-all"
            >
              <span>تراکنش‌ها</span>
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
          </div>

          {/* Balance Amount */}
          <div className="my-2.5 relative z-10 flex items-baseline">
            <strong className="text-[26px] font-black tracking-tight leading-none">
              {toFa(balance)}
            </strong>
            <span className="text-[12px] font-normal mr-1.5 text-white/90">
              تومان
            </span>
          </div>

          {/* Expiration date notice with clock icon */}
          {expireNotice && (
            <div className="flex items-center gap-1.5 text-[11px] text-[#c5edd8] font-medium relative z-10">
              <svg
                className="w-3.5 h-3.5 text-[#c5edd8] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{expireNotice}</span>
            </div>
          )}
        </section>

        {/* Note below card: با دریافت پاداش جدید، تاریخ انقضای کیف پول شما تمدید می‌شود. */}
        <div className="mt-2.5 mb-3 p-2.5 rounded-[10px] bg-[#edf7f1] border border-[#d2edd9] flex items-center gap-2 text-[#2d6e4d] text-[10px] font-medium leading-relaxed">
          <svg
            className="w-3.5 h-3.5 text-sn-green shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span>با دریافت پاداش جدید، تاریخ انقضای کیف پول شما تمدید می‌شود.</span>
        </div>

        {/* 2 Metric Cards: مجموع پاداش خرید + مجموع پاداش معرفی */}
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {/* مجموع پاداش خرید */}
          <div className="bg-white border border-[#e5ebe7] rounded-[13px] p-3 flex flex-col justify-between gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#eaf7ef] text-sn-green">
              <svg
                className="w-3.5 h-3.5"
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
            <div>
              <span className="block text-[10px] text-sn-muted font-medium">
                مجموع پاداش خرید
              </span>
              <b className="block text-[13px] font-black text-sn-text mt-0.5">
                {toFa(totalPurchaseReward)}{' '}
                <span className="text-[10px] font-normal text-sn-muted">تومان</span>
              </b>
            </div>
          </div>

          {/* مجموع پاداش معرفی */}
          <div className="bg-white border border-[#e5ebe7] rounded-[13px] p-3 flex flex-col justify-between gap-2 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#eaf7ef] text-sn-green">
              <svg
                className="w-3.5 h-3.5"
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
            <div>
              <span className="block text-[10px] text-sn-muted font-medium">
                مجموع پاداش معرفی
              </span>
              <b className="block text-[13px] font-black text-sn-text mt-0.5">
                {toFa(totalReferralReward)}{' '}
                <span className="text-[10px] font-normal text-sn-muted">تومان</span>
              </b>
            </div>
          </div>
        </div>

        {/* Full-Width Total Card: کل پاداش دریافت‌شده */}
        <div className="bg-white border border-[#e5ebe7] rounded-[13px] p-3.5 flex items-center justify-between mb-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#eaf7ef] text-sn-green">
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
            </span>
            <span className="text-[11.5px] font-bold text-sn-text">
              کل پاداش دریافت‌شده
            </span>
          </div>

          <b className="text-[14px] font-black text-sn-green">
            {toFa(totalEarned)}{' '}
            <span className="text-[10px] font-normal text-sn-muted">تومان</span>
          </b>
        </div>

        {/* Tabs: تراکنش‌ها vs دوستان من */}
        <div className="grid grid-cols-2 rounded-[12px] bg-[#eef3f0] p-1 mb-3">
          <button
            type="button"
            onClick={() => setActiveTab('transactions')}
            className={cn(
              'h-9 rounded-[9px] text-[11.5px] font-bold transition-all cursor-pointer flex items-center justify-center',
              activeTab === 'transactions'
                ? 'bg-white text-sn-text shadow-sm'
                : 'text-sn-muted hover:text-sn-text'
            )}
          >
            تراکنش‌ها
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('friends')}
            className={cn(
              'h-9 rounded-[9px] text-[11.5px] font-bold transition-all cursor-pointer flex items-center justify-center',
              activeTab === 'friends'
                ? 'bg-white text-sn-text shadow-sm'
                : 'text-sn-muted hover:text-sn-text'
            )}
          >
            دوستان من
          </button>
        </div>

        {/* Tab 1: تراکنش‌ها */}
        {activeTab === 'transactions' && (
          <section className="mt-3">
            <div className="flex items-center justify-between mb-2 px-1">
              <h2 className="text-[12.5px] font-black text-sn-text">
                آخرین تراکنش‌ها
              </h2>
              {transactions.length > 0 && (
                <Link
                  href="/rewards/transactions"
                  className="text-[10px] font-bold text-sn-green hover:underline flex items-center gap-0.5"
                >
                  <span>همه تراکنش‌ها</span>
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </Link>
              )}
            </div>

            {transactions.length > 0 ? (
              <div className="flex flex-col gap-2">
                {transactions.slice(0, 5).map((tx) => (
                  <TransactionRow key={tx.id} transaction={tx} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-[12px] border border-sn-line my-2">
                <p className="text-[11.5px] font-bold text-sn-text">
                  هنوز تراکنشی ثبت نشده است
                </p>
                <p className="text-[9.5px] text-sn-muted mt-1">
                  با هر خرید یا معرفی دوستان، پاداش نقدی دریافت کنید.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Tab 2: دوستان من */}
        {activeTab === 'friends' && (
          <FriendsList friends={referralStats?.friends || []} />
        )}

        {/* Bottom Referral Invite Card */}
        {referralStats?.code && (
          <ReferralInviteCard
            code={referralStats.code}
            shareUrl={referralStats.shareUrl}
            title="دعوت از دوستان و دریافت پاداش"
            description="کد دعوت خود را با دوستان به اشتراک بگذارید و با هر خرید آن‌ها، پاداش دریافت کنید."
          />
        )}
      </main>

      {/* Help / FAQ Sheet */}
      <Sheet
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        title="راهنمای سیستم پاداش"
      >
        <div className="flex flex-col gap-3 py-2 text-sn-text text-[11px] leading-relaxed">
          <div className="p-3 rounded-[10px] bg-[#f8faf9] border border-sn-line">
            <b className="block text-[11.5px] font-bold text-sn-green mb-1">
              پاداش خرید چیست؟
            </b>
            <p className="text-sn-muted">
              با خرید کالاهای منتخب، درصدی از مبلغ فاکتور به عنوان پاداش نقدی به کیف پول شما بازگردانده می‌شود.
            </p>
          </div>

          <div className="p-3 rounded-[10px] bg-[#f8faf9] border border-sn-line">
            <b className="block text-[11.5px] font-bold text-sn-green mb-1">
              پاداش معرفی دوستان چگونه کار می‌کند؟
            </b>
            <p className="text-sn-muted">
              با ارسال کد یا لینک اختصاصی خود به دوستان، پس از ثبت‌نام و تکمیل اولین خرید آن‌ها، پاداش نقدی به کیف پول شما و دوستتان تعلق می‌گیرد.
            </p>
          </div>

          <div className="p-3 rounded-[10px] bg-[#f8faf9] border border-sn-line">
            <b className="block text-[11.5px] font-bold text-sn-green mb-1">
              تمدید اعتبار کیف پول:
            </b>
            <p className="text-sn-muted">
              با هر بار دریافت پاداش خرید یا معرفی جدید، تاریخ انقضای کل موجودی کیف پول شما به صورت خودکار تمدید می‌گردد.
            </p>
          </div>
        </div>
      </Sheet>

      <BottomNav />
    </AppShell>
  );
}
