import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <AppShell hasBottomNav={false} className="p-0">
      <TopPromo />

      {/* Hero Section */}
      <section className="px-6 pt-12 pb-8 bg-gradient-to-br from-[#f8fcf9] to-[#e4f6ea] text-center">
        <h1 className="text-[30px] font-black text-sn-text tracking-tight leading-snug">
          خرید هوشمندانه با <span className="text-sn-green">سودانه</span>
        </h1>
        <p className="mt-3 text-[12px] text-[#6b7b73] leading-relaxed max-w-[320px] mx-auto">
          فروشگاه آنلاین با سیستم پاداش نقدی مستقیم بر روی خریدها و معرفی دوستان.
        </p>

        {/* Floating Product Visuals */}
        <div className="relative h-[190px] mt-6 flex items-center justify-center">
          <img
            src="/assets/products/rice.png"
            alt="برنج هاشمی"
            className="absolute z-20 w-[120px] h-[150px] object-contain rounded-[16px] bg-white p-2 shadow-lg -rotate-3 border border-white"
          />
          <img
            src="/assets/products/oil.jpg"
            alt="روغن سرخ‌کردنی"
            className="absolute z-10 -right-2 top-4 w-[95px] h-[115px] object-contain rounded-[14px] bg-white p-2 shadow-md rotate-6 border border-white"
          />
          <img
            src="/assets/products/tea.jpg"
            alt="چای سیاه"
            className="absolute z-10 -left-2 top-3 w-[95px] h-[115px] object-contain rounded-[14px] bg-white p-2 shadow-md -rotate-6 border border-white"
          />
        </div>

        <Link href="/" className="block mt-6">
          <Button className="w-full h-12 text-[13px] font-black shadow-md shadow-sn-green/20">
            ورود به فروشگاه سودانه
          </Button>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-8">
        <h2 className="text-[19px] font-black text-sn-text text-center">
          چرا سودانه متفاوت است؟
        </h2>
        <p className="mt-1 text-[11px] text-sn-muted text-center max-w-[300px] mx-auto">
          سیستم پاداش تک‌سطحی و شفاف بدون پیچیدگی‌های شبکه‌ای.
        </p>

        <div className="grid gap-2.5 mt-5">
          <article className="p-4 rounded-[13px] border border-sn-line bg-white">
            <i className="w-9 h-9 rounded-[10px] bg-[#e8f6ed] text-sn-green flex items-center justify-center not-italic font-bold text-lg mb-2">
              ✦
            </i>
            <b className="block text-[12px] font-bold text-sn-text">
              پاداش خرید مستقیم
            </b>
            <span className="block mt-1 text-[10px] text-sn-muted leading-[1.8]">
              با خرید هر محصول، مبلغ مشخصی پاداش به تومان مستقیماً در کیف پولتان
              شارژ می‌شود.
            </span>
          </article>

          <article className="p-4 rounded-[13px] border border-sn-line bg-white">
            <i className="w-9 h-9 rounded-[10px] bg-[#e8f6ed] text-sn-green flex items-center justify-center not-italic font-bold text-lg mb-2">
              👥
            </i>
            <b className="block text-[12px] font-bold text-sn-text">
              پاداش معرفی مستقیم
            </b>
            <span className="block mt-1 text-[10px] text-sn-muted leading-[1.8]">
              با دعوت مستقیم دوستان، از خرید آن‌ها پاداش به تومان دریافت کنید
              (مدل غیرهرمی).
            </span>
          </article>

          <article className="p-4 rounded-[13px] border border-sn-line bg-white">
            <i className="w-9 h-9 rounded-[10px] bg-[#e8f6ed] text-sn-green flex items-center justify-center not-italic font-bold text-lg mb-2">
              💳
            </i>
            <b className="block text-[12px] font-bold text-sn-text">
              کیف پول یکپارچه
            </b>
            <span className="block mt-1 text-[10px] text-sn-muted leading-[1.8]">
              موجودی پاداش خود را در سفارش‌های بعدی کسر کنید و ارزان‌تر خرید
              کنید.
            </span>
          </article>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-4 mb-8 p-6 rounded-[18px] bg-gradient-to-br from-[#106f4c] to-[#259b70] text-white text-center shadow-lg shadow-sn-deep/20">
        <h2 className="text-[20px] font-black">آماده تجربه سودانه هستید؟</h2>
        <p className="my-2.5 text-[11px] text-[#def4e8] leading-relaxed">
          همین حالا ثبت‌نام کنید و اولین پاداش خرید خود را دریافت کنید.
        </p>
        <Link href="/auth" className="block mt-4">
          <Button className="w-full h-11 bg-white text-sn-green hover:bg-slate-50 text-[12px] font-black">
            ثبت‌نام و ورود سریع
          </Button>
        </Link>
      </section>
    </AppShell>
  );
}
