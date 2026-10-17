'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { TopHeader } from '@/components/layout/top-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

const FAQS = [
  {
    id: 'f-1',
    q: 'پاداش خرید چه زمانی فعال می‌شود؟',
    a: 'پاداش خرید بلافاصله پس از تکمیل فرآیند پرداخت در کیف پول شما ثبت می‌گردد و برای خریدهای آتی قابل استفاده است.',
  },
  {
    id: 'f-2',
    q: 'پاداش معرفی چگونه محاسبه می‌شود؟',
    a: 'پاداش معرفی بر اساس مقدار تعیین‌شده توسط سیستم برای هر محصول است و مستقیماً به معرف مستقیم شخص خریدار تعلق می‌گیرد.',
  },
  {
    id: 'f-3',
    q: 'آیا می‌توانم سفارش نهایی‌شده را لغو کنم؟',
    a: 'تا قبل از ورود سفارش به مرحله آماده‌سازی و ارسال، امکان لغو و عودت وجه با تماس با پشتیبانی وجود دارد.',
  },
  {
    id: 'f-4',
    q: 'چطور پاداشم را استفاده کنم؟',
    a: 'در مرحله تکمیل سفارش (Checkout)، گزینه «استفاده از پاداش» را فعال کنید تا مبلغ از فاکتور شما کسر شود.',
  },
];

export default function SupportPage() {
  const [isTicketSheetOpen, setIsTicketSheetOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    toast.success('درخواست شما با موفقیت ثبت شد. همکاران ما به زودی با شما تماس می‌گیرند.');
    setIsTicketSheetOpen(false);
    setSubject('');
    setMessage('');
  };

  return (
    <AppShell hasBottomNav={false}>
      <TopPromo />

      <TopHeader title="پشتیبانی" backHref="/account" />

      <div className="p-3 rounded-[10px] bg-sn-pale text-[10px] text-[#668172] text-center leading-[1.9] mb-4">
        پاسخ سوالتان را در راهنما پیدا کنید یا درخواست پشتیبانی ثبت کنید.
      </div>

      {/* 2 Quick action cards */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <button
          type="button"
          onClick={() => setIsTicketSheetOpen(true)}
          className="p-3 rounded-[11px] border border-sn-line bg-white text-right hover:border-sn-green/40 transition-colors cursor-pointer"
        >
          <b className="block text-[18px] text-sn-green font-bold mb-1">＋</b>
          <strong className="block text-[10.5px] font-bold text-sn-text">
            ثبت درخواست
          </strong>
          <small className="block mt-1 text-[8.5px] text-sn-muted">
            ارسال پیام برای پشتیبانی
          </small>
        </button>

        <Link
          href="/orders"
          className="p-3 rounded-[11px] border border-sn-line bg-white text-right hover:border-sn-green/40 transition-colors block"
        >
          <b className="block text-[18px] text-sn-green font-bold mb-1">⌕</b>
          <strong className="block text-[10.5px] font-bold text-sn-text">
            پیگیری درخواست
          </strong>
          <small className="block mt-1 text-[8.5px] text-sn-muted">
            مشاهده وضعیت سفارش‌ها
          </small>
        </Link>
      </div>

      {/* FAQs section */}
      <section>
        <h2 className="text-[13px] font-bold text-sn-text mb-2.5">سوالات متداول</h2>
        <Accordion
          type="single"
          collapsible
          className="rounded-[10px] border border-sn-line bg-white overflow-hidden"
        >
          {FAQS.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger>{faq.q}</AccordionTrigger>
              <AccordionContent>{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Ticket Bottom Sheet */}
      <Sheet
        isOpen={isTicketSheetOpen}
        onClose={() => setIsTicketSheetOpen(false)}
        title="ثبت درخواست پشتیبانی"
      >
        <form onSubmit={handleSendTicket} className="flex flex-col gap-3 pt-1">
          <div>
            <label className="block text-[10.5px] font-bold text-[#465c51] mb-1.5">
              موضوع
            </label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="موضوع درخواست"
              required
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-[#465c51] mb-1.5">
              پیام
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="توضیحاتتان را بنویسید..."
              required
              rows={4}
              className="w-full rounded-[8px] border border-sn-line bg-white p-2.5 text-[11px] text-sn-text placeholder:text-[#a0aaa5] focus:outline-none focus:ring-1 focus:ring-sn-green resize-none"
            />
          </div>

          <Button type="submit" className="h-11 text-[11px] font-bold mt-2">
            ارسال درخواست
          </Button>
        </form>
      </Sheet>
    </AppShell>
  );
}
