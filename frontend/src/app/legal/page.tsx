'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { cn } from '@/lib/utils';

interface AccordionItemData {
  id: string;
  title: string;
  content: string;
}

const TERMS_ITEMS: AccordionItemData[] = [
  {
    id: 't-1',
    title: 'خرید و ثبت سفارش',
    content:
      'تمامی سفارش‌ها پس از تایید نهایی پرداخت، آماده‌سازی و از طریق سرویس‌های پستی مجاز ارسال می‌گردند. خریدار متعهد است نشانی دقیق و شماره تماس معتبر جهت تحویل مرسوله ثبت نماید.',
  },
  {
    id: 't-2',
    title: 'پاداش خرید و معرفی مستقیم',
    content:
      'سودانه به خریدار کالا پاداش نقدی مشخصی در کیف پول اعطا می‌کند. در صورت وجود معرف مستقیم، پاداش معرف نیز بلافاصله منظور می‌گردد. این سیستم کاملاً شفاف و تک‌سطحی است.',
  },
  {
    id: 't-3',
    title: 'استفاده و انقضای پاداش',
    content:
      'موجودی پاداش کیف پول برای تخفیف روی سفارش‌های بعدی قابل استفاده است. با ثبت هر سفارش جدید یا معرفی دوست، تاریخ انقضای کل موجودی به طور خودکار تمدید می‌شود.',
  },
  {
    id: 't-4',
    title: 'پرداخت و بازگشت وجه',
    content:
      'در صورت لغو سفارش، مرجوعی کالا مطابق ضوابط یا اصلاح سفارش توسط مدیریت، مبالغ مربوطه در کوتاه‌ترین زمان به کیف پول یا حساب بانکی کاربر استرداد داده می‌شود.',
  },
];

const PRIVACY_ITEMS: AccordionItemData[] = [
  {
    id: 'p-1',
    title: 'اطلاعاتی که دریافت می‌کنیم',
    content:
      'اطلاعات تماس، نشانی‌های ثبت‌شده و سوابق سفارش صرفاً جهت پردازش، صدور فاکتور و تحویل سریع کالاها در سامانه ذخیره و نگهداری می‌شوند.',
  },
  {
    id: 'p-2',
    title: 'نحوه استفاده از اطلاعات',
    content:
      'از شماره تماس شما صرفاً برای ارسال کد ورود یکبار مصرف (OTP)، اطلاع‌رسانی مراحل ارسال سفارش و هشدارهای مهم حساب کاربری استفاده می‌شود.',
  },
  {
    id: 'p-3',
    title: 'حفظ امنیت و محرمانگی داده‌ها',
    content:
      'داده‌های کاربران با پروتکل‌های استاندارد امنیتی محافظت می‌شوند و تحت هیچ شرایطی در اختیار شخص یا شرکت ثالث قرار نخواهند گرفت.',
  },
  {
    id: 'p-4',
    title: 'حقوق کاربران و دسترسی به اطلاعات',
    content:
      'کاربر در هر زمان می‌تواند نسبت به ویرایش مشخصات، حذف آدرس‌ها و بازبینی سوابق خریدهای خود از طریق بخش حساب کاربری اقدام نماید.',
  },
];

export default function LegalPage() {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>('terms');
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const currentItems = activeTab === 'terms' ? TERMS_ITEMS : PRIVACY_ITEMS;

  return (
    <AppShell hasBottomNav={false}>
      <TopPromo />

      {/* Header matching Image 2 & 3: Back button on right, title centered */}
      <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-sn-line/50 bg-[#fbfdfc]/95 px-4 backdrop-blur-md">
        <Link
          href="/account"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 active:scale-95 transition-all shadow-none"
          aria-label="بازگشت"
        >
          <svg
            className="w-4 h-4 text-[#506459]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        <h1 className="text-[15px] font-black text-sn-text">
          قوانین و حریم خصوصی
        </h1>

        <div className="w-9" aria-hidden="true" />
      </header>

      <main className="px-3.5 pt-3 pb-16 text-right" dir="rtl">
        {/* Tabs switcher matching Image 2 & 3: Right is قوانین استفاده, Left is حریم خصوصی */}
        <div className="grid grid-cols-2 rounded-[12px] bg-[#edf2ee] p-1 mb-3.5">
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={cn(
              'h-9 rounded-[9px] text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center',
              activeTab === 'terms'
                ? 'bg-white text-sn-green font-black shadow-sm'
                : 'text-[#67776f] hover:text-sn-text'
            )}
          >
            قوانین استفاده
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={cn(
              'h-9 rounded-[9px] text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center',
              activeTab === 'privacy'
                ? 'bg-white text-sn-green font-black shadow-sm'
                : 'text-[#67776f] hover:text-sn-text'
            )}
          >
            حریم خصوصی
          </button>
        </div>

        {/* Notice Banner matching Image 2 & 3 */}
        <div className="p-3 rounded-[11px] bg-[#edf7f1] border border-[#d2edd9] text-right text-[10.5px] text-[#2d6e4d] font-medium leading-[1.85] mb-3.5">
          {activeTab === 'terms'
            ? 'استفاده از سودانه به معنی پذیرش قوانین زیر است. این متن نسخهٔ خلاصه برای نمایش در اپلیکیشن است.'
            : 'حفظ حریم خصوصی و امنیت اطلاعات کاربران، از اصول اساسی فعالیت مجموعه سودانه می‌باشد.'}
        </div>

        {/* Accordion list matching Image 2 & 3 */}
        <div className="rounded-[12px] border border-sn-line bg-white overflow-hidden divide-y divide-[#edf0ee] shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {currentItems.map((item) => {
            const isOpen = Boolean(openItems[item.id]);
            return (
              <div key={item.id} className="transition-colors">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full flex items-center justify-between p-3.5 text-right cursor-pointer bg-white hover:bg-[#fbfcfb] transition-colors"
                >
                  <span className="text-[11px] font-bold text-sn-text">
                    {item.title}
                  </span>

                  <svg
                    className={cn(
                      'w-4 h-4 text-[#9aa7a0] transition-transform duration-200 select-none mr-2 shrink-0',
                      isOpen ? 'rotate-180' : 'rotate-0'
                    )}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-0 text-[10px] text-[#55695e] leading-[1.9] text-right">
                    {item.content}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer update date matching Image 3 */}
        <p className="text-[9.5px] text-[#919f96] mt-6 mb-4 text-center font-medium">
          آخرین به‌روزرسانی: ۲۶ شهریور ۱۴۰۵
        </p>
      </main>
    </AppShell>
  );
}
