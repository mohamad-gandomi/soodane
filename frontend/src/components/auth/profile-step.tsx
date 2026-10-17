'use client';

import React from 'react';
import { toEnglishDigits } from '@/services/auth.service';
import { BirthDateInput } from '@/components/shared/birth-date-input';

interface ProfileStepProps {
  firstName: string;
  lastName: string;
  birthDate?: string;
  nationalId?: string;
  onChangeFirstName: (val: string) => void;
  onChangeLastName: (val: string) => void;
  onChangeBirthDate?: (val: string) => void;
  onChangeNationalId?: (val: string) => void;
  onSubmit: () => void;
  onSkip: () => void;
  isLoading?: boolean;
}

export function ProfileStep({
  firstName,
  lastName,
  birthDate = '',
  nationalId = '',
  onChangeFirstName,
  onChangeLastName,
  onChangeBirthDate,
  onChangeNationalId,
  onSubmit,
  onSkip,
  isLoading = false,
}: ProfileStepProps) {
  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit && !isLoading) onSubmit();
  };

  return (
    <div className="flex flex-col text-right">
      <div className="text-right pt-2">
        <p className="text-[12px] font-extrabold text-sn-green mb-2.5">
          تکمیل حساب کاربری
        </p>
        <h1 className="text-[22px] font-bold text-[#1d3028] leading-[1.55] tracking-tight">
          خوشحالیم که اینجایید
        </h1>
        <p className="mt-2 text-[13px] text-[#718078] leading-[2]">
          برای ارائه تجربه بهتر، اطلاعات زیر را تکمیل کنید.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3.5" noValidate>
        {/* First & Last name side by side */}
        <div className="grid grid-cols-2 gap-2.5">
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-[#41564c]">
            <span>
              نام <b className="text-red-500 font-bold">*</b>
            </span>
            <input
              type="text"
              autoComplete="given-name"
              placeholder="مثلاً مریم"
              value={firstName}
              onChange={(e) => onChangeFirstName(e.target.value)}
              className="h-[47px] px-3 border border-[#dfe6e2] rounded-[9px] bg-white text-[13px] text-[#1d3028] outline-none transition-all focus:border-sn-green placeholder:text-[#b5beb9]"
              autoFocus
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-[#41564c]">
            <span>
              نام خانوادگی <b className="text-red-500 font-bold">*</b>
            </span>
            <input
              type="text"
              autoComplete="family-name"
              placeholder="مثلاً احمدی"
              value={lastName}
              onChange={(e) => onChangeLastName(e.target.value)}
              className="h-[47px] px-3 border border-[#dfe6e2] rounded-[9px] bg-white text-[13px] text-[#1d3028] outline-none transition-all focus:border-sn-green placeholder:text-[#b5beb9]"
            />
          </label>
        </div>

        {/* Birth date */}
        <BirthDateInput
          value={birthDate}
          onChange={(val) => onChangeBirthDate?.(val)}
        />

        {/* National ID */}
        <label className="flex flex-col gap-1.5 text-[12px] font-medium text-[#41564c]">
          <span>
            کد ملی <small className="text-[#98a39e] font-normal mr-1">اختیاری</small>
          </span>
          <input
            type="text"
            inputMode="numeric"
            dir="ltr"
            maxLength={10}
            placeholder="۰۱۲۳۴۵۶۷۸۹"
            value={nationalId}
            onChange={(e) => {
              const clean = toEnglishDigits(e.target.value).replace(/\D/g, '').slice(0, 10);
              onChangeNationalId && onChangeNationalId(clean);
            }}
            className="h-[47px] px-3 border border-[#dfe6e2] rounded-[9px] bg-white text-[13px] text-[#1d3028] outline-none transition-all focus:border-sn-green placeholder:text-[#b5beb9] text-center tracking-widest font-medium"
          />
        </label>

        <button
          type="submit"
          disabled={!canSubmit || isLoading}
          className={`mt-3 min-h-[51px] rounded-[10px] text-[13px] font-extrabold text-white transition-all active:scale-[0.99] flex items-center justify-center ${
            canSubmit && !isLoading
              ? 'bg-sn-green hover:bg-[#0f6847] cursor-pointer shadow-sm'
              : 'bg-[#d6dfda] cursor-default'
          }`}
        >
          {isLoading ? 'در حال ذخیره...' : 'تکمیل و ورود به سودانه'}
        </button>
      </form>

      <button
        type="button"
        onClick={onSkip}
        disabled={isLoading}
        className="mt-4 self-center text-[12px] text-sn-muted hover:text-sn-green underline underline-offset-4 transition-colors"
      >
        بعداً تکمیل می‌کنم
      </button>
    </div>
  );
}
