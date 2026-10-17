'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toEnglishDigits } from '@/services/auth.service';
import { toFa } from '@/lib/utils';

interface OtpStepProps {
  phone: string;
  code: string;
  devCode?: string;
  onChangeCode: (val: string) => void;
  onSubmit: (codeToSubmit?: string) => void;
  onResend: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function OtpStep({
  phone,
  code,
  devCode,
  onChangeCode,
  onSubmit,
  onResend,
  onBack,
  isLoading = false,
}: OtpStepProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize countdown
  useEffect(() => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phone]);

  // Sync external code with internal digits if needed
  useEffect(() => {
    if (code) {
      const parts = code.split('').slice(0, 5);
      const newDigits = ['', '', '', '', ''];
      parts.forEach((d, i) => (newDigits[i] = d));
      setDigits(newDigits);
    }
  }, [code]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitChange = (index: number, value: string) => {
    const clean = toEnglishDigits(value).replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = clean;
    setDigits(newDigits);

    const fullCode = newDigits.join('');
    onChangeCode(fullCode);

    if (clean && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }

    if (fullCode.length === 5 && !isLoading) {
      onSubmit(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = toEnglishDigits(e.clipboardData.getData('text')).replace(/\D/g, '').slice(0, 5);
    if (!pasted) return;

    const newDigits = ['', '', '', '', ''];
    pasted.split('').forEach((d, i) => {
      newDigits[i] = d;
    });
    setDigits(newDigits);
    const fullCode = newDigits.join('');
    onChangeCode(fullCode);

    const focusIndex = Math.min(pasted.length, 4);
    inputRefs.current[focusIndex]?.focus();

    if (pasted.length === 5 && !isLoading) {
      onSubmit(fullCode);
    }
  };

  const handleAutoFillDevCode = () => {
    if (!devCode) return;
    const parts = devCode.split('').slice(0, 5);
    const newDigits = ['', '', '', '', ''];
    parts.forEach((d, i) => (newDigits[i] = d));
    setDigits(newDigits);
    onChangeCode(devCode);
    onSubmit(devCode);
  };

  const handleResendClick = () => {
    setCountdown(60);
    setDigits(['', '', '', '', '']);
    onChangeCode('');
    onResend();
    inputRefs.current[0]?.focus();
  };

  const fullCode = digits.join('');
  const isComplete = fullCode.length === 5;

  return (
    <div className="flex flex-col text-center">
      <div className="pt-2">
        <p className="text-[12px] font-extrabold text-sn-green mb-2.5">
          تأیید شماره موبایل
        </p>
        <h1 className="text-[22px] font-bold text-[#1d3028] leading-[1.55] tracking-tight">
          کد تأیید را وارد کنید
        </h1>
        <p className="mt-2 text-[13px] text-[#718078] leading-[2]">
          کد ۵ رقمی به شماره{' '}
          <span className="font-bold text-[#3d554a] tracking-wider" dir="ltr">
            {phone}
          </span>{' '}
          ارسال شد.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-2 text-[11px] text-sn-green underline underline-offset-4 hover:text-[#0f6847] transition-colors"
        >
          ویرایش شماره
        </button>
      </div>

      {/* Dev Mode Helper Callout */}
      {devCode && (
        <div className="mt-5 p-3 rounded-[10px] border border-amber-300 bg-amber-50/80 text-amber-900 text-right flex flex-col gap-1.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10.5px] font-bold text-amber-800">
              ⚡ حالت توسعه محلی (Local Dev)
            </span>
            <span className="font-black text-amber-950 text-[14px] tracking-widest px-2 py-0.5 rounded bg-amber-200/60" dir="ltr">
              {devCode}
            </span>
          </div>
          <p className="text-[10px] text-amber-700 leading-relaxed">
            پنل پیامک واقعی هنوز متصل نیست؛ این کد مستقیماً توسط بک‌اند شبیه‌سازی شده است.
          </p>
          <button
            type="button"
            onClick={handleAutoFillDevCode}
            disabled={isLoading}
            className="mt-1 h-[32px] w-full rounded-[6px] bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-all flex items-center justify-center cursor-pointer active:scale-98"
          >
            {isLoading ? 'در حال بررسی...' : 'درج خودکار کد و ورود سریع'}
          </button>
        </div>
      )}

      {/* 5 Digit Boxes in LTR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isComplete && !isLoading) onSubmit(fullCode);
        }}
        className="mt-6 flex flex-col"
        noValidate
      >
        <div dir="ltr" className="flex justify-center gap-2">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="tel"
              inputMode="numeric"
              maxLength={1}
              autoComplete={i === 0 ? 'one-time-code' : 'off'}
              value={digit}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              className="w-[48px] h-[54px] border border-[#dfe6e2] rounded-[9px] bg-white text-center text-[22px] font-extrabold text-sn-green outline-none transition-all focus:border-sn-green focus:ring-1 focus:ring-sn-green"
              aria-label={`رقم ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={!isComplete || isLoading}
          className={`mt-6 min-h-[51px] rounded-[10px] text-[13px] font-extrabold text-white transition-all active:scale-[0.99] flex items-center justify-center ${
            isComplete && !isLoading
              ? 'bg-sn-green hover:bg-[#0f6847] cursor-pointer shadow-sm'
              : 'bg-[#d6dfda] cursor-default'
          }`}
        >
          {isLoading ? 'در حال بررسی...' : 'تأیید و ادامه'}
        </button>
      </form>

      {/* Countdown and Resend */}
      <div className="mt-5 text-center text-[11px] text-[#89948e]">
        {countdown > 0 ? (
          <p>
            ارسال مجدد کد تا{' '}
            <strong className="text-[#53665c] font-bold tracking-wider" dir="ltr">
              ۰:{toFa(String(countdown).padStart(2, '0'))}
            </strong>{' '}
            دیگر
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResendClick}
            disabled={isLoading}
            className="text-sn-green font-bold underline underline-offset-4 hover:text-[#0f6847] transition-colors"
          >
            ارسال مجدد کد
          </button>
        )}
      </div>
    </div>
  );
}
