'use client';

import React, { useEffect, useRef, useState } from 'react';
import { toEnglishDigits } from '@/services/auth.service';
import { toFa, cn } from '@/lib/utils';

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
  const [value, setValue] = useState(code || '');
  const [countdown, setCountdown] = useState(60);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync external code prop with internal value
  useEffect(() => {
    if (code !== undefined && code !== value) {
      setValue(code);
    }
  }, [code]);

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

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // WebOTP API: native automatic SMS code reading on Android Chrome
  useEffect(() => {
    if (typeof window === 'undefined' || !('OTPCredential' in window) || !navigator.credentials) {
      return;
    }

    const ac = new AbortController();
    abortControllerRef.current = ac;

    navigator.credentials
      .get({
        otp: { transport: ['sms'] },
        signal: ac.signal,
      } as any)
      .then((content: any) => {
        const raw = content?.code || (typeof content === 'string' ? content : '') || '';
        const clean = toEnglishDigits(String(raw)).replace(/\D/g, '').slice(0, 5);
        if (clean) {
          setValue(clean);
          onChangeCode(clean);
          if (clean.length === 5 && !isLoading) {
            onSubmit(clean);
          }
        }
      })
      .catch(() => {
        // Silently ignore abort or user dismissal
      });

    return () => {
      ac.abort();
    };
  }, [phone]); // Only run on phone change, never abort on countdown or re-renders

  const handleInputChange = (raw: string) => {
    const clean = toEnglishDigits(raw).replace(/\D/g, '').slice(0, 5);
    setValue(clean);
    onChangeCode(clean);

    if (clean.length === 5 && !isLoading) {
      onSubmit(clean);
    }
  };

  const handleAutoFillDevCode = () => {
    if (!devCode) return;
    const clean = devCode.slice(0, 5);
    setValue(clean);
    onChangeCode(clean);
    onSubmit(clean);
  };

  const handleResendClick = () => {
    setCountdown(60);
    setValue('');
    onChangeCode('');
    onResend();
    inputRef.current?.focus();
  };

  const isComplete = value.length === 5;

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
          className="mt-2 text-[11px] text-sn-green underline underline-offset-4 hover:text-[#0f6847] transition-colors cursor-pointer"
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
            <span
              className="font-black text-amber-950 text-[14px] tracking-widest px-2 py-0.5 rounded bg-amber-200/60"
              dir="ltr"
            >
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

      {/* 5 Digit Unified Input for 100% reliable Android / iOS Autofill */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isComplete && !isLoading) onSubmit(value);
        }}
        className="mt-6 flex flex-col"
        noValidate
      >
        <div className="relative flex justify-center w-full max-w-[280px] mx-auto">
          {/* Actual underlying transparent input capturing native autofill and keystrokes */}
          <input
            ref={inputRef}
            type="tel"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={5}
            value={value}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
            aria-label="کد تأیید ۵ رقمی"
            autoFocus
          />

          {/* 5 Visual Digit Display Slots */}
          <div dir="ltr" className="flex justify-between w-full gap-2 pointer-events-none">
            {Array.from({ length: 5 }).map((_, i) => {
              const char = value[i] || '';
              const isCurrent = isFocused && i === Math.min(value.length, 4);

              return (
                <div
                  key={i}
                  className={cn(
                    'w-[48px] h-[54px] rounded-[10px] border bg-white flex items-center justify-center text-[24px] font-black text-sn-green transition-all shadow-2xs select-none',
                    char
                      ? 'border-sn-green bg-[#f7fbf9]'
                      : 'border-[#dfe6e2]',
                    isCurrent && 'ring-2 ring-sn-green/30 border-sn-green'
                  )}
                >
                  {char}
                </div>
              );
            })}
          </div>
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
            className="text-sn-green font-bold underline underline-offset-4 hover:text-[#0f6847] transition-colors cursor-pointer"
          >
            ارسال مجدد کد
          </button>
        )}
      </div>
    </div>
  );
}
