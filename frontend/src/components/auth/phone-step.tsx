'use client';

import React from 'react';
import { toEnglishDigits } from '@/services/auth.service';

interface PhoneStepProps {
  phone: string;
  onChangePhone: (val: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

export function PhoneStep({
  phone,
  onChangePhone,
  onSubmit,
  isLoading = false,
}: PhoneStepProps) {
  // Format input as 09xx xxx xxxx
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawDigits = toEnglishDigits(e.target.value).replace(/\D/g, '');
    if (rawDigits.startsWith('98') && rawDigits.length >= 12) {
      rawDigits = '0' + rawDigits.slice(2);
    }
    if (rawDigits.length > 11) {
      rawDigits = rawDigits.slice(0, 11);
    }
    onChangePhone(rawDigits);
  };

  const normalizePhone = (raw: string) => {
    let digits = toEnglishDigits(raw).replace(/\D/g, '');
    if (digits.startsWith('98') && digits.length === 12) {
      digits = '0' + digits.slice(2);
    } else if (digits.startsWith('9') && digits.length === 10) {
      digits = '0' + digits;
    }
    return digits;
  };

  const cleanDigits = normalizePhone(phone);
  const isValid = cleanDigits.startsWith('09') && cleanDigits.length === 11;

  // Format display in Persian/English
  const formatDisplay = (digits: string) => {
    const d = digits.startsWith('09') ? digits : digits.startsWith('9') ? '0' + digits : digits;
    if (d.length <= 4) return d;
    if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`;
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7, 11)}`;
  };

  return (
    <div className="flex flex-col">
      <div className="text-right">
        <p className="text-[12px] font-extrabold text-sn-green mb-2.5">
          به سودانه خوش آمدید
        </p>
        <h1 className="text-[24px] font-bold text-[#1d3028] leading-[1.55] tracking-tight">
          خرید کنید، پاداش بگیرید
        </h1>
        <p className="mt-2.5 text-[13px] text-[#718078] leading-[2]">
          برای ورود یا ساخت حساب، شماره موبایل‌تان را وارد کنید.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid && !isLoading) onSubmit();
        }}
        className="mt-6 flex flex-col"
        noValidate
      >
        <label className="text-[12px] font-medium text-[#41564c] mb-2" htmlFor="phone-input">
          شماره موبایل
        </label>

        {/* LTR Field: Prefix (+98) on left, Input on right */}
        <div
          dir="ltr"
          className="h-[53px] flex items-center border border-[#dfe6e2] rounded-[10px] bg-white transition-all focus-within:border-sn-green"
        >
          <span
            dir="rtl"
            className="flex items-center px-3.5 h-full border-r border-[#dfe6e2] text-[#687a72] text-[13px] font-medium select-none"
          >
            +۹۸
          </span>
          <input
            id="phone-input"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            dir="ltr"
            placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
            value={formatDisplay(cleanDigits)}
            onChange={handlePhoneChange}
            className="flex-1 h-full px-3.5 bg-transparent text-[#1d3028] text-[15px] font-medium tracking-wider placeholder:text-[#b5beb9] outline-none"
            autoFocus
          />
        </div>

        <p className="min-h-[18px] mt-2 mb-5 text-[11px] text-[#89958f]">
          شماره‌ای که به نام خودتان است را وارد کنید.
        </p>

        <button
          type="submit"
          disabled={!isValid || isLoading}
          className={`min-h-[51px] rounded-[10px] text-[13px] font-extrabold text-white transition-all active:scale-[0.99] flex items-center justify-center ${
            isValid && !isLoading
              ? 'bg-sn-green hover:bg-[#0f6847] cursor-pointer shadow-sm'
              : 'bg-[#d6dfda] cursor-default'
          }`}
        >
          {isLoading ? 'در حال ارسال کد...' : 'دریافت کد تأیید'}
        </button>
      </form>

      <p className="mt-4 text-center text-[10px] text-[#929d97] leading-relaxed select-none">
        با ادامه، قوانین و حریم خصوصی سودانه را می‌پذیرید.
      </p>
    </div>
  );
}
