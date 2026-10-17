import React from 'react';
import { formatMoney } from '@/lib/utils';

interface WalletRewardToggleProps {
  useReward: boolean;
  onToggle: (checked: boolean) => void;
  availableBalance?: number;
  deductAmount?: number;
  isFullyCovered?: boolean;
}

export function WalletRewardToggle({
  useReward,
  onToggle,
  availableBalance = 380000,
  deductAmount = 0,
  isFullyCovered = false,
}: WalletRewardToggleProps) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-[13px] font-bold text-sn-text">استفاده از پاداش</h2>
        <span className="text-[10px] text-[#8e9d95]">کیف پول پاداش</span>
      </div>

      <div className="rounded-[14px] bg-[#f0f8f4] border border-[#d8ebe0] p-3.5">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#dcebe1]">
          <span className="text-[11.5px] text-[#556b60]">موجودی قابل استفاده</span>
          <span className="text-[14px] font-black text-sn-text">
            {formatMoney(availableBalance)}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2.5">
          <span className="text-[12px] font-bold text-sn-text">
            استفاده از پاداش در این سفارش
          </span>
          <div dir="ltr" className="flex items-center">
            <button
              type="button"
              role="switch"
              aria-checked={useReward}
              onClick={() => onToggle(!useReward)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
                useReward ? 'bg-sn-green' : 'bg-[#cbd5cf]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                  useReward ? 'translate-x-[22px]' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#718279]">
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
        {useReward ? (
          isFullyCovered ? (
            <span className="text-sn-green font-bold">
              کل مبلغ سفارش از موجودی پاداش تسویه می‌شود (نیازی به پرداخت نقدی نیست).
            </span>
          ) : (
            <span>
              مبلغ {formatMoney(deductAmount)} از موجودی پاداش کسر می‌شود.
            </span>
          )
        ) : (
          <span>امکان پرداخت کامل سفارش از طریق موجودی پاداش کیف پول وجود دارد.</span>
        )}
      </div>
    </section>
  );
}
