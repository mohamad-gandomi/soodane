'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { BottomNav } from '@/components/layout/bottom-nav';
import { useAuth } from '@/context/auth-context';
import { addressesService } from '@/services/addresses.service';
import { toFa } from '@/lib/utils';
import { toast } from 'sonner';

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

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [isLogoutSheetOpen, setIsLogoutSheetOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [addressesCount, setAddressesCount] = useState<number | null>(null);

  React.useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace('/auth?redirect=%2Faccount');
      return;
    }
    let active = true;
    addressesService.getAddresses().then((list) => {
      if (active) setAddressesCount(list.length);
    }).catch(() => {});
    return () => { active = false; };
  }, [isLoading, isAuthenticated, router]);

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setIsLogoutSheetOpen(false);
      setIsLoggingOut(false);
      toast.info('از حساب کاربری خارج شدید.');
      router.push('/auth');
    }, 400);
  };

  const displayName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'کاربر گرامی'
    : 'کاربر مهمان';

  const displayPhone = user?.phone ? formatDisplayPhone(user.phone) : '-';
  const avatarLetter = displayName ? displayName[0] : 'ک';

  if (isLoading || !isAuthenticated) return <AppShell><p role="status">در حال بررسی ورود...</p></AppShell>;

  return (
    <AppShell>
      <TopPromo />

      {/* Top Header */}
      <header className="flex items-center justify-between mb-4 pt-1">
        <h1 className="m-0 text-[17px] font-semibold text-[#2a3b33]">
          حساب من
        </h1>
        <Link
          href="/account/profile"
          className="w-[36px] h-[36px] grid place-items-center border border-[#e0e8e3] rounded-[9px] bg-white text-[#51665a] hover:bg-slate-50 transition-colors"
          aria-label="تنظیمات حساب"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-[18px] h-[18px]"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </Link>
      </header>

      {/* User Profile Card */}
      <section className="flex items-center gap-[11px] p-[14px] border border-[#e0e8e3] rounded-[12px] bg-white">
        <span className="w-[51px] h-[51px] flex-none grid place-items-center rounded-full bg-[#dff2e6] text-sn-green text-[18px] font-semibold">
          {avatarLetter}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-[#30453a] text-[14px] font-semibold truncate">
            {displayName}
          </h2>
          <p
            className="m-0 mt-1 text-[#83908a] text-[11px] font-medium tracking-wide whitespace-nowrap"
            dir="ltr"
            style={{ textAlign: 'right' }}
          >
            {displayPhone}
          </p>
        </div>
        <Link
          href="/account/profile"
          className="h-[29px] px-[10px] border-0 rounded-[7px] bg-[#eef7f2] text-sn-green text-[10px] font-bold inline-flex items-center hover:bg-[#e1f0e7] transition-colors"
        >
          ویرایش
        </Link>
      </section>

      {/* Complete Profile Banner */}
      <section className="flex items-center gap-[9px] mt-[10px] p-[10px_11px] rounded-[9px] bg-[#eff8f3]">
        <span className="w-[28px] h-[28px] grid place-items-center rounded-[7px] bg-[#d9f0e2] text-sn-green flex-none">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="w-[15px] h-[15px]"
          >
            <circle cx="12" cy="12" r="8" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <strong className="block text-[#416352] text-[10px] font-semibold">
            پروفایل‌تان را کامل کنید
          </strong>
          <p className="m-0 mt-[3px] text-[#779080] text-[8px]">
            تاریخ تولد و کد ملی هنوز ثبت نشده‌اند.
          </p>
        </div>
        <Link
          href="/account/profile"
          className="border-0 bg-transparent text-sn-green text-[9px] font-semibold hover:underline"
        >
          تکمیل
        </Link>
      </section>

      {/* Group 1: حساب کاربری */}
      <section className="mt-[22px]">
        <p className="mx-[3px] mb-[8px] text-[#7a8881] text-[10px] font-medium">
          حساب کاربری
        </p>
        <div className="overflow-hidden border border-[#e0e8e3] rounded-[11px] bg-white">
          <Link
            href="/account/profile"
            className="w-full min-h-[54px] flex items-center gap-[10px] border-b border-[#edf0ee] bg-white text-[#374c40] text-right px-[12px] hover:bg-slate-50/70 transition-colors"
          >
            <span className="w-[29px] h-[29px] flex-none grid place-items-center rounded-[8px] bg-[#f0f6f2] text-[#5c8370]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
                <circle cx="12" cy="8" r="4" />
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[11px] font-semibold text-[#30453a]">اطلاعات شخصی</strong>
              <small className="block mt-[3px] text-[#909a95] text-[8px]">نام، تاریخ تولد و کد ملی</small>
            </span>
            <svg
              className="w-4 h-4 text-[#a1aba6] shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>

          <Link
            href="/account/addresses"
            className="w-full min-h-[54px] flex items-center gap-[10px] border-b border-[#edf0ee] bg-white text-[#374c40] text-right px-[12px] hover:bg-slate-50/70 transition-colors"
          >
            <span className="w-[29px] h-[29px] flex-none grid place-items-center rounded-[8px] bg-[#f0f6f2] text-[#5c8370]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
                <path d="M4 20h16M6 20V9l6-5 6 5v11M10 20v-5h4v5" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[11px] font-semibold text-[#30453a]">آدرس‌ها</strong>
              <small className="block mt-[3px] text-[#909a95] text-[8px]">
                {addressesCount === null
                  ? 'مدیریت و ثبت نشانی'
                  : addressesCount === 0
                  ? 'هنوز آدرسی ثبت نشده'
                  : `${toFa(addressesCount)} آدرس ثبت‌شده`}
              </small>
            </span>
            <svg
              className="w-4 h-4 text-[#a1aba6] shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>

          <Link
            href="/orders"
            className="w-full min-h-[54px] flex items-center gap-[10px] bg-white text-[#374c40] text-right px-[12px] hover:bg-slate-50/70 transition-colors"
          >
            <span className="w-[29px] h-[29px] flex-none grid place-items-center rounded-[8px] bg-[#f0f6f2] text-[#5c8370]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
                <path d="M4 6h16v14H4zM3 3h18v3H3zM8 10h8M8 14h5" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[11px] font-semibold text-[#30453a]">سفارش‌ها</strong>
              <small className="block mt-[3px] text-[#909a95] text-[8px]">پیگیری و مشاهدهٔ سفارش‌ها</small>
            </span>
            <svg
              className="w-4 h-4 text-[#a1aba6] shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Group 2: تنظیمات */}
      <section className="mt-[22px]">
        <p className="mx-[3px] mb-[8px] text-[#7a8881] text-[10px] font-medium">
          تنظیمات
        </p>
        <div className="overflow-hidden border border-[#e0e8e3] rounded-[11px] bg-white">
          <Link
            href="/notifications"
            className="w-full min-h-[54px] flex items-center gap-[10px] border-b border-[#edf0ee] bg-white text-[#374c40] text-right px-[12px] hover:bg-slate-50/70 transition-colors"
          >
            <span className="w-[29px] h-[29px] flex-none grid place-items-center rounded-[8px] bg-[#f0f6f2] text-[#5c8370]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
                <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[11px] font-semibold text-[#30453a]">اعلان‌ها</strong>
              <small className="block mt-[3px] text-[#909a95] text-[8px]">سفارش‌ها، پاداش‌ها و پیشنهادها</small>
            </span>
            <span className="w-[7px] h-[7px] ml-[5px] rounded-full bg-sn-green flex-none" />
            <svg
              className="w-4 h-4 text-[#a1aba6] shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>

          <Link
            href="/legal"
            className="w-full min-h-[54px] flex items-center gap-[10px] bg-white text-[#374c40] text-right px-[12px] hover:bg-slate-50/70 transition-colors"
          >
            <span className="w-[29px] h-[29px] flex-none grid place-items-center rounded-[8px] bg-[#f0f6f2] text-[#5c8370]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
                <path d="M5 5h14v14H5zM9 9h6M9 13h6M9 17h4" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[11px] font-semibold text-[#30453a]">قوانین و حریم خصوصی</strong>
              <small className="block mt-[3px] text-[#909a95] text-[8px]">شرایط استفاده از سودانه</small>
            </span>
            <svg
              className="w-4 h-4 text-[#a1aba6] shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Group 3: پشتیبانی */}
      <section className="mt-[22px]">
        <p className="mx-[3px] mb-[8px] text-[#7a8881] text-[10px] font-medium">
          پشتیبانی
        </p>
        <div className="overflow-hidden border border-[#e0e8e3] rounded-[11px] bg-white">
          <Link
            href="/support"
            className="w-full min-h-[54px] flex items-center gap-[10px] bg-white text-[#374c40] text-right px-[12px] hover:bg-slate-50/70 transition-colors"
          >
            <span className="w-[29px] h-[29px] flex-none grid place-items-center rounded-[8px] bg-[#f0f6f2] text-[#5c8370]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-[16px] h-[16px]">
                <path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2v-6h4M4 13h4v6H6a2 2 0 0 1-2-2z" />
                <path d="M12 20v1" />
              </svg>
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-[11px] font-semibold text-[#30453a]">پشتیبانی و سوالات متداول</strong>
              <small className="block mt-[3px] text-[#909a95] text-[8px]">ثبت و پیگیری درخواست پشتیبانی</small>
            </span>
            <svg
              className="w-4 h-4 text-[#a1aba6] shrink-0 select-none"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Logout button */}
      <button
        type="button"
        onClick={() => setIsLogoutSheetOpen(true)}
        className="w-full h-[46px] mt-[22px] border border-[#eddddd] rounded-[10px] bg-white text-[#bd5555] text-[11px] font-semibold hover:bg-red-50/50 transition-colors cursor-pointer"
      >
        خروج از حساب کاربری
      </button>

      {/* Logout Confirmation Bottom Sheet */}
      {isLogoutSheetOpen && (
        <div
          className="fixed z-50 inset-0 flex items-end justify-center bg-[#19382b]/25 backdrop-blur-[2px]"
          onClick={() => !isLoggingOut && setIsLogoutSheetOpen(false)}
        >
          <div
            className="w-full max-w-app p-[9px_16px_max(20px,env(safe-area-inset-bottom))] rounded-t-[18px] bg-white shadow-xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="block w-[34px] h-[4px] mx-auto mb-[15px] rounded-[4px] bg-[#dce4df]" />
            <h2 className="m-0 text-center text-[14px] font-semibold text-[#2a3b33]">
              از حساب کاربری خارج می‌شوید؟
            </h2>
            <p className="m-[8px_0_18px] text-[#7c8983] text-[10px] leading-[1.9] text-center">
              برای استفاده مجدد، کافی است با شماره موبایل‌تان وارد شوید.
            </p>
            <div className="grid gap-[8px]">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={handleConfirmLogout}
                className="h-[43px] border-0 rounded-[9px] bg-[#bd5555] hover:bg-[#a84444] text-white text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-70"
              >
                {isLoggingOut ? '✓ خارج شدید' : 'خروج از حساب'}
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setIsLogoutSheetOpen(false)}
                className="h-[43px] border-0 rounded-[9px] bg-[#f3f5f4] hover:bg-[#e7eae8] text-[#637269] text-[11px] font-semibold transition-colors cursor-pointer"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </AppShell>
  );
}
