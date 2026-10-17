'use client';

import React from 'react';

interface WelcomeStepProps {
  userName?: string;
  onFinish: () => void;
}

export function WelcomeStep({ userName, onFinish }: WelcomeStepProps) {
  return (
    <div className="flex flex-col text-center pt-5">
      {/* Big green circle checkmark */}
      <div className="w-[66px] h-[66px] mx-auto mb-6 rounded-full bg-sn-green text-white flex items-center justify-center shadow-md shadow-sn-green/15">
        <svg
          className="w-8 h-8 text-white stroke-[2.5]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div>
        <p className="text-[13px] font-bold text-sn-green mb-2.5">
          حساب شما آماده است
        </p>
        <h1 className="text-[25px] font-extrabold text-[#1d3028] leading-[1.4] tracking-tight">
          به سودانه خوش آمدید!
        </h1>
        <p className="mt-3 text-[13px] text-[#718078] leading-[2] max-w-[340px] mx-auto">
          حالا می‌توانید خرید کنید، پاداش بگیرید و دوستانتان را مستقیم دعوت کنید.
        </p>
      </div>

      {/* Wallet announcement card */}
      <div className="mt-6 mb-7 p-4 rounded-[10px] border border-[#dfe6e2] bg-white text-right leading-[1.8] shadow-xs">
        <strong className="block text-[13px] font-bold text-[#1d3028]">
          کیف پول پاداش شما فعال شد
        </strong>
        <p className="mt-1 text-[11.5px] text-[#718078]">
          پاداش خریدهای تأییدشده در اینجا ثبت می‌شود.
        </p>
      </div>

      <button
        type="button"
        onClick={onFinish}
        className="min-h-[51px] w-full rounded-[10px] bg-sn-green hover:bg-[#0f6847] text-[14px] font-extrabold text-white transition-all active:scale-[0.99] flex items-center justify-center cursor-pointer shadow-sm"
      >
        پایان
      </button>
    </div>
  );
}
