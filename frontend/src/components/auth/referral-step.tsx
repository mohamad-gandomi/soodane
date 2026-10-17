'use client';

import React, { useState } from 'react';

interface ReferralStepProps {
  referralCode: string;
  onChangeReferralCode: (val: string) => void;
  onSubmit: (code: string) => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function ReferralStep({
  referralCode,
  onChangeReferralCode,
  onSubmit,
  onSkip,
  isLoading = false,
}: ReferralStepProps) {
  const [hasReferral, setHasReferral] = useState<boolean | null>(null);

  const cleanCode = referralCode.trim().toUpperCase();
  const canContinue = hasReferral === false || (hasReferral === true && cleanCode.length >= 4);

  const handleNext = () => {
    if (hasReferral && cleanCode) {
      onSubmit(cleanCode);
    } else {
      onSkip();
    }
  };

  return (
    <div className="flex flex-col text-right">
      <div className="text-center pt-2">
        <p className="text-[12px] font-extrabold text-sn-green mb-2.5">
          یک قدم تا ساخت حساب
        </p>
        <h1 className="text-[22px] font-bold text-[#1d3028] leading-[1.55] tracking-tight">
          کد معرف دارید؟
        </h1>
        <p className="mt-2 text-[13px] text-[#718078] leading-[2]">
          اگر از طرف یک دوست دعوت شده‌اید، کد او را وارد کنید.
        </p>
      </div>

      {/* 2 Choices */}
      <div className="grid gap-2.5 mt-5" role="radiogroup" aria-label="وضعیت کد معرف">
        <button
          type="button"
          onClick={() => setHasReferral(true)}
          className={`w-full min-h-[65px] p-3.5 rounded-[10px] border text-right flex items-center gap-3 transition-all cursor-pointer ${
            hasReferral === true
              ? 'border-sn-green bg-[#fbfefd] shadow-xs'
              : 'border-[#dfe6e2] bg-white hover:border-[#cfd8d3]'
          }`}
        >
          <span
            className={`w-[17px] h-[17px] rounded-full border flex items-center justify-center shrink-0 ${
              hasReferral === true ? 'border-sn-green' : 'border-[#afbbb5]'
            }`}
          >
            {hasReferral === true && (
              <span className="w-[9px] h-[9px] rounded-full bg-sn-green" />
            )}
          </span>
          <div className="flex flex-col gap-1 flex-1">
            <strong className="text-[13px] font-bold text-[#31483d]">
              بله، کد معرف دارم
            </strong>
            <small className="text-[10px] text-[#87938d]">
              کد دعوت را وارد می‌کنم
            </small>
          </div>
        </button>

        <button
          type="button"
          onClick={() => {
            setHasReferral(false);
            onChangeReferralCode('');
          }}
          className={`w-full min-h-[65px] p-3.5 rounded-[10px] border text-right flex items-center gap-3 transition-all cursor-pointer ${
            hasReferral === false
              ? 'border-sn-green bg-[#fbfefd] shadow-xs'
              : 'border-[#dfe6e2] bg-white hover:border-[#cfd8d3]'
          }`}
        >
          <span
            className={`w-[17px] h-[17px] rounded-full border flex items-center justify-center shrink-0 ${
              hasReferral === false ? 'border-sn-green' : 'border-[#afbbb5]'
            }`}
          >
            {hasReferral === false && (
              <span className="w-[9px] h-[9px] rounded-full bg-sn-green" />
            )}
          </span>
          <div className="flex flex-col gap-1 flex-1">
            <strong className="text-[13px] font-bold text-[#31483d]">
              خیر، ادامه می‌دهم
            </strong>
            <small className="text-[10px] text-[#87938d]">
              می‌توانید بعداً هم کد معتبر وارد کنید
            </small>
          </div>
        </button>
      </div>

      {/* Expandable referral code input */}
      {hasReferral === true && (
        <div className="mt-4 flex flex-col">
          <label className="text-[12px] font-medium text-[#41564c] mb-2" htmlFor="referral-input">
            کد معرف
          </label>
          <div className="h-[52px] border border-[#dfe6e2] rounded-[10px] bg-white flex items-center px-3.5 transition-all focus-within:border-sn-green">
            <input
              id="referral-input"
              type="text"
              placeholder="مثلاً ABC123"
              dir="ltr"
              autoComplete="off"
              maxLength={12}
              value={referralCode}
              onChange={(e) =>
                onChangeReferralCode(
                  e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '').slice(0, 12)
                )
              }
              className="w-full bg-transparent text-[#1d3028] text-[14px] font-bold tracking-widest placeholder:text-[#b5beb9] outline-none font-en"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* Transparency Note */}
      <div className="my-4 p-3 rounded-[8px] bg-[#f6f8f7] text-[#72837a] text-[10px] leading-[1.9]">
        پاداش معرفی فقط برای دعوت مستقیم ثبت می‌شود و هیچ ساختار چندسطحی وجود ندارد.
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={!canContinue || isLoading}
        className={`min-h-[51px] rounded-[10px] text-[13px] font-extrabold text-white transition-all active:scale-[0.99] flex items-center justify-center ${
          canContinue && !isLoading
            ? 'bg-sn-green hover:bg-[#0f6847] cursor-pointer shadow-sm'
            : 'bg-[#d6dfda] cursor-default'
        }`}
      >
        {isLoading ? 'در حال ثبت...' : 'ادامه'}
      </button>
    </div>
  );
}
