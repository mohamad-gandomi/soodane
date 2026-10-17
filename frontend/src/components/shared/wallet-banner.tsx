import React from 'react';
import Link from 'next/link';
import { toFa } from '@/lib/utils';

interface WalletBannerProps {
  balance?: number;
  expireNotice?: string;
  href?: string;
}

export function WalletBanner({
  balance = 0,
  expireNotice,
  href = '/rewards',
}: WalletBannerProps) {
  return (
    <section className="relative overflow-hidden my-4 p-4 rounded-[13px] bg-gradient-to-br from-[#0d6b48] to-[#249c70] text-white flex items-center justify-between shadow-sm">
      {/* Decorative background shape matching designer's mock */}
      <span
        aria-hidden="true"
        className="absolute -left-7 -bottom-12 w-[120px] h-[120px] rounded-full border-[20px] border-white/10 pointer-events-none"
      />

      <div className="relative z-10">
        <small className="block text-[9px] text-white/80">
          موجودی پاداش شما
        </small>
        <strong className="block mt-1 text-[22px] font-black tracking-tight">
          {toFa(balance)} <span className="text-[10px] font-normal">تومان</span>
        </strong>
        {expireNotice && (
          <small className="block mt-1 text-[9.5px] text-white/85 font-medium leading-none">
            {expireNotice}
          </small>
        )}
      </div>

      <Link
        href={href}
        className="relative z-10 rounded-[7px] bg-white/15 px-2.5 py-1.5 text-[9px] font-bold text-white hover:bg-white/25 active:scale-95 transition-all"
      >
        کیف پول
      </Link>
    </section>
  );
}
