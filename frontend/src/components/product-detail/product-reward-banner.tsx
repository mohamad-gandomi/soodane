import React from 'react';
import { formatMoney } from '@/lib/utils';

interface ProductRewardBannerProps {
  buyerReward: number;
  referrerReward?: number | null;
}

export function ProductRewardBanner({
  buyerReward,
  referrerReward,
}: ProductRewardBannerProps) {
  return (
    <section className="mt-5">
      <h2 className="text-[14px] font-bold text-sn-text mb-2.5">پاداش این محصول</h2>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[#f5faf7] border border-sn-line/50">
          <i className="w-8 h-8 rounded-[9px] bg-[#dff1e5] text-sn-green flex items-center justify-center not-italic font-bold text-base shrink-0">
            ✦
          </i>
          <div className="flex-1">
            <b className="block text-[11px] font-bold text-sn-text">پاداش خرید شما</b>
            <p className="mt-0.5 text-[9.5px] text-[#72827a] leading-[1.8]">
              با خرید این محصول،{' '}
              <span className="text-sn-green font-bold">
                {formatMoney(buyerReward)}
              </span>{' '}
              پاداش در کیف پولتان دریافت می‌کنید.
            </p>
          </div>
        </div>

        {referrerReward && referrerReward > 0 && (
          <div className="flex items-center gap-3 p-3 rounded-[10px] bg-[#faf8f2] border border-[#eadaa0]/40">
            <i className="w-8 h-8 rounded-[9px] bg-[#fdf2cc] text-[#937217] flex items-center justify-center not-italic font-bold text-base shrink-0">
              👥
            </i>
            <div className="flex-1">
              <b className="block text-[11px] font-bold text-[#624b0e]">
                پاداش معرفی مستقیم
              </b>
              <p className="mt-0.5 text-[9.5px] text-[#7d6b38] leading-[1.8]">
                اگر دوستی با کد شما این محصول را بخرد،{' '}
                <span className="font-bold text-[#624b0e]">
                  {formatMoney(referrerReward)}
                </span>{' '}
                پاداش مستقیم می‌گیرید.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
