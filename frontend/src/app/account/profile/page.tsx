'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { useAuth } from '@/context/auth-context';
import { authService, toEnglishDigits } from '@/services/auth.service';
import { toast } from 'sonner';
import { BirthDateInput } from '@/components/shared/birth-date-input';
import { gregorianToShamsiString } from '@/lib/date-utils';

function formatPersianDigits(str: string): string {
  return String(str).replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

function formatDisplayPhone(rawPhone?: string): string {
  if (!rawPhone) return '-';
  const clean = rawPhone.replace(/\D/g, '');
  const fa = formatPersianDigits(clean);
  if (fa.length === 11) {
    return `${fa.slice(0, 4)} ${fa.slice(4, 7)} ${fa.slice(7)}`;
  }
  return fa;
}

export default function ProfilePage() {
  const { user, refreshProfile } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      if (user.birthDate) {
        setBirthDate(gregorianToShamsiString(user.birthDate));
      }
      if (user.nationalId) setNationalId(user.nationalId);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await authService.updateProfile({
        firstName,
        lastName,
        birthDate: birthDate || undefined,
        nationalId: nationalId ? toEnglishDigits(nationalId) : undefined,
      });
      await refreshProfile();
      setSaved(true);
      toast.success('اطلاعات هویتی با موفقیت ذخیره شد');
      setTimeout(() => setSaved(false), 3000);
    } catch {
      toast.error('خطا در ذخیره اطلاعات');
    } finally {
      setIsSaving(false);
    }
  };

  const displayPhone = formatDisplayPhone(user?.phone);

  return (
    <AppShell hasBottomNav={false}>
      <TopPromo />

      {/* Header */}
      <header className="grid grid-cols-[36px_1fr_36px] items-center mb-[23px] pt-1">
        <Link
          href="/account"
          className="w-[36px] h-[36px] grid place-items-center border border-[#e0e8e3] rounded-[9px] text-[#506459] hover:bg-slate-50 transition-colors"
          aria-label="بازگشت"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[18px] h-[18px]">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </Link>
        <h1 className="m-0 text-center text-[16px] font-semibold text-[#2a3b33]">
          اطلاعات شخصی
        </h1>
        <span />
      </header>

      {/* Profile Note */}
      <div className="flex items-center gap-[9px] p-[11px] rounded-[9px] bg-[#eff8f3] text-[#648072] text-[9px] leading-[1.8] mb-[23px]">
        <span className="w-[27px] h-[27px] flex-none grid place-items-center rounded-[7px] bg-[#dcefe4] text-sn-green text-[15px] font-bold">
          i
        </span>
        <p className="m-0">
          اطلاعات هویتی برای ارسال مطمئن سفارش و تکمیل حساب کاربری استفاده می‌شود.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid gap-[15px]">
        <div className="flex flex-col gap-[7px]">
          <label htmlFor="phone" className="text-[#465c51] text-[11px] font-medium">
            شماره موبایل
          </label>
          <input
            id="phone"
            value={displayPhone}
            dir="ltr"
            disabled
            className="h-[48px] border border-[#e0e8e3] rounded-[9px] outline-none bg-[#f7f8f8] text-[#89958f] px-[11px] text-[13px] font-medium text-center tracking-wider cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-2 gap-[10px]">
          <div className="flex flex-col gap-[7px]">
            <label htmlFor="first" className="text-[#465c51] text-[11px] font-medium">
              نام
            </label>
            <input
              id="first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="نام"
              className="h-[48px] border border-[#e0e8e3] rounded-[9px] outline-none bg-white px-[11px] text-[#30453a] text-[12px] focus:border-sn-green transition-colors placeholder:text-[#b1bbb6] placeholder:font-light"
            />
          </div>

          <div className="flex flex-col gap-[7px]">
            <label htmlFor="last" className="text-[#465c51] text-[11px] font-medium">
              نام خانوادگی
            </label>
            <input
              id="last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="نام خانوادگی"
              className="h-[48px] border border-[#e0e8e3] rounded-[9px] outline-none bg-white px-[11px] text-[#30453a] text-[12px] focus:border-sn-green transition-colors placeholder:text-[#b1bbb6] placeholder:font-light"
            />
          </div>
        </div>

        <BirthDateInput
          id="birth"
          value={birthDate}
          onChange={(shamsi) => setBirthDate(shamsi)}
        />

        <div className="flex flex-col gap-[7px]">
          <label htmlFor="national" className="text-[#465c51] text-[11px] font-medium flex items-center justify-between">
            <span>کد ملی</span>
            <small className="text-[#98a39e] text-[9px] font-normal">اختیاری</small>
          </label>
          <input
            id="national"
            value={nationalId}
            onChange={(e) => setNationalId(toEnglishDigits(e.target.value).replace(/\D/g, '').slice(0, 10))}
            placeholder="۰۱۲۳۴۵۶۷۸۹"
            inputMode="numeric"
            dir="ltr"
            maxLength={10}
            className="h-[48px] border border-[#e0e8e3] rounded-[9px] outline-none bg-white px-[11px] text-[#30453a] text-[13px] font-medium text-center tracking-widest focus:border-sn-green transition-colors placeholder:text-[#b1bbb6] placeholder:font-light"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`h-[47px] mt-[8px] border-0 rounded-[9px] text-white text-[11px] font-semibold transition-colors cursor-pointer ${
            saved
              ? 'bg-[#0f6847]'
              : 'bg-sn-green hover:bg-[#0f6847]'
          }`}
        >
          {saved ? '✓ تغییرات ذخیره شد' : isSaving ? 'در حال ذخیره...' : 'ذخیره تغییرات'}
        </button>
      </form>

      <p className="m-0 mt-[15px] mx-[2px] text-[#919b96] text-[9px] leading-[1.9]">
        با ثبت اطلاعات، مسئولیت صحت آن‌ها بر عهدهٔ کاربر است.
      </p>
    </AppShell>
  );
}
