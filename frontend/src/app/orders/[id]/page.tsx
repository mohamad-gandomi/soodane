'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { OrderTimeline } from '@/components/orders/order-timeline';
import { Icon } from '@/components/ui/icon';
import { ordersService } from '@/services/orders.service';
import { Order } from '@/types/order';
import { toFa } from '@/lib/utils';
import { MapPin, Truck, CreditCard, Gift, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const data = await ordersService.getOrderById(id);
        setOrder(data);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <AppShell hasBottomNav={false}>
        <TopPromo />
        <header className="sticky top-0 z-20 -mx-4 -mt-3.5 mb-3 flex items-center justify-between bg-white px-4 py-3 border-b border-[#eff2f0]">
          <Link
            href="/orders"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 transition-colors"
          >
            <Icon name="back" size={18} />
          </Link>
          <h1 className="text-[15px] font-bold text-sn-text">جزئیات سفارش</h1>
          <span className="w-9" />
        </header>
        <div className="py-20 text-center text-sn-muted text-xs">
          در حال بارگذاری اطلاعات سفارش...
        </div>
      </AppShell>
    );
  }

  if (!order) {
    return (
      <AppShell hasBottomNav={false}>
        <TopPromo />
        <header className="sticky top-0 z-20 -mx-4 -mt-3.5 mb-3 flex items-center justify-between bg-white px-4 py-3 border-b border-[#eff2f0]">
          <Link
            href="/orders"
            className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 transition-colors"
          >
            <Icon name="back" size={18} />
          </Link>
          <h1 className="text-[15px] font-bold text-sn-text">سفارش یافت نشد</h1>
          <span className="w-9" />
        </header>
        <div className="py-20 text-center text-sn-muted text-xs">
          سفارش مورد نظر یافت نشد یا دسترسی به آن امکان‌پذیر نیست.
        </div>
      </AppShell>
    );
  }

  // Format creation date and time
  let orderDateStr = '۲۵ شهریور ۱۴۰۵';
  let orderTimeStr = '۱۷:۲۹';
  if (order.createdAt) {
    const d = new Date(order.createdAt);
    if (!isNaN(d.getTime())) {
      orderDateStr = d.toLocaleDateString('fa-IR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      orderTimeStr = d.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  // Calculate total reward/cashback
  const totalCashback = order.items.reduce(
    (sum, item) => sum + (Number(item.cashbackEarned) || 0),
    0
  );

  const handleDownloadInvoice = () => {
    const invoiceText = `فاکتور فروشگاه سودانه\nشماره سفارش: ${order.orderNumber}\nتاریخ: ${orderDateStr} ساعت ${orderTimeStr}\nمبلغ کل: ${order.totalAmount} تومان\nاقلام:\n` +
      order.items.map((i) => `- ${i.productName} (تعداد: ${i.quantity}) - ${i.totalPrice} تومان`).join('\n');
    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factor-sodaneh-${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('فاکتور سفارش دانلود شد');
  };

  return (
    <AppShell hasBottomNav={false} className="pb-12">
      <TopPromo />

      {/* Header: Centered Title, Back Button on Right */}
      <header className="sticky top-0 z-20 -mx-4 -mt-3.5 mb-3 flex items-center justify-between bg-white px-4 py-3 border-b border-[#eff2f0]/90">
        <Link
          href="/orders"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 active:scale-95 transition-all"
          aria-label="بازگشت"
        >
          <Icon name="back" size={18} />
        </Link>

        <h1 className="text-[15px] font-bold text-sn-text">جزئیات سفارش</h1>

        <span className="w-9" />
      </header>

      {/* 1. Top Order Status & Progress Timeline Card */}
      <section className="p-4 rounded-[16px] bg-white border border-sn-line/70 shadow-sm mb-4">
        <div className="flex items-start justify-between">
          <div>
            <b className="text-[14px] font-black text-sn-text block">
              سفارش #{toFa(order.orderNumber)}
            </b>
            <p className="text-[9.5px] text-[#86958e] mt-0.5">
              ثبت‌شده {orderDateStr}، ساعت {orderTimeStr}
            </p>
          </div>

          <span className="px-2.5 py-1 rounded-[6px] bg-[#ebf6f1] text-[#25855a] text-[10px] font-bold">
            {order.status === 'DELIVERED'
              ? 'تحویل‌شده'
              : order.status === 'SHIPPED'
              ? 'ارسال شده'
              : order.status === 'CANCELLED'
              ? 'لغوشده'
              : 'در حال آماده‌سازی'}
          </span>
        </div>

        {/* Dynamic 5-step timeline */}
        <OrderTimeline order={order} />
      </section>

      {/* 2. Order Items List (کالاهای سفارش) */}
      <section className="mb-4">
        <h2 className="text-[13px] font-bold text-sn-text mb-2 px-1">
          کالاهای سفارش
        </h2>

        <div className="flex flex-col gap-2">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-[14px] bg-white border border-sn-line/60 flex items-center justify-between gap-3 shadow-none"
            >
              {/* Product Image on Right */}
              <div className="h-12 w-12 rounded-[10px] bg-[#f8faf9] p-1 flex items-center justify-center shrink-0 border border-sn-line/40 overflow-hidden">
                <img
                  src={item.productImage || item.product?.image || '/assets/products/rice.png'}
                  alt={item.productName}
                  className="h-full w-full object-contain pointer-events-none"
                />
              </div>

              {/* Title & Quantity in Middle */}
              <div className="flex-1 overflow-hidden text-right">
                <b className="block text-[12px] font-bold text-sn-text truncate">
                  {item.productName}
                </b>
                <span className="text-[10px] text-[#8a9891] mt-0.5 block">
                  تعداد: {toFa(item.quantity)}
                </span>
              </div>

              {/* Price on Left */}
              <div className="text-left shrink-0">
                <b className="text-[12.5px] font-black text-sn-text">
                  {toFa(item.totalPrice)}
                </b>
                <span className="text-[9.5px] text-[#8a9891] mr-1">تومان</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Delivery & Payment Section (تحویل و پرداخت) */}
      <section className="mb-4">
        <h2 className="text-[13px] font-bold text-sn-text mb-2 px-1">
          تحویل و پرداخت
        </h2>

        <div className="p-4 rounded-[16px] bg-white border border-sn-line/60 shadow-none space-y-3.5">
          {/* Address Row */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#f4f7f5] flex items-center justify-center text-sn-green shrink-0 mt-0.5">
              <MapPin size={16} />
            </div>
            <div>
              <b className="block text-[11px] font-bold text-sn-text">آدرس تحویل</b>
              <p className="text-[10px] text-[#6b7b73] mt-0.5 leading-relaxed">
                {order.shippingAddress?.street || 'تهران، سعادت‌آباد، بلوار دریا، خیابان صرافها، پلاک ۴۲، واحد ۷'}
              </p>
            </div>
          </div>

          {/* Shipping Method Row */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#f4f7f5] flex items-center justify-center text-sn-green shrink-0 mt-0.5">
              <Truck size={16} />
            </div>
            <div>
              <b className="block text-[11px] font-bold text-sn-text">روش ارسال</b>
              <p className="text-[10px] text-[#6b7b73] mt-0.5">
                {order.shippingMethod || 'ارسال عادی - بازه تحویل ۲ تا ۳ روز کاری'}
              </p>
            </div>
          </div>

          {/* Payment Method Row */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-[8px] bg-[#f4f7f5] flex items-center justify-center text-sn-green shrink-0 mt-0.5">
              <CreditCard size={16} />
            </div>
            <div>
              <b className="block text-[11px] font-bold text-sn-text">پرداخت آنلاین</b>
              <p className="text-[10px] text-[#6b7b73] mt-0.5">
                {order.paymentStatus === 'PAID'
                  ? 'پرداخت با موفقیت تأیید شده است.'
                  : 'در انتظار تأیید پرداخت'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Financial Summary (خلاصه مبلغ) */}
      <section className="mb-4">
        <h2 className="text-[13px] font-bold text-sn-text mb-2 px-1">
          خلاصه مبلغ
        </h2>

        <div className="p-4 rounded-[16px] bg-white border border-sn-line/60 shadow-none space-y-2 text-[11px]">
          <div className="flex justify-between items-center text-[#6e7d75]">
            <span>جمع کالاها</span>
            <span className="font-bold text-sn-text">{toFa(order.subtotal || 654000)} تومان</span>
          </div>

          {order.discountAmount > 0 && (
            <div className="flex justify-between items-center text-[#6e7d75]">
              <span>تخفیف</span>
              <span className="font-bold text-sn-danger">− {toFa(order.discountAmount)} تومان</span>
            </div>
          )}

          {order.walletAmountPaid > 0 && (
            <div className="flex justify-between items-center text-[#6e7d75]">
              <span>استفاده از پاداش</span>
              <span className="font-bold text-sn-green">− {toFa(order.walletAmountPaid)} تومان</span>
            </div>
          )}

          <div className="flex justify-between items-center text-[#6e7d75]">
            <span>هزینه ارسال</span>
            <span className="font-bold text-sn-text">{toFa(order.shippingAmount || 20000)} تومان</span>
          </div>

          <div className="flex justify-between items-center border-t border-[#edf1ee] pt-2.5 mt-2">
            <span className="font-bold text-sn-text">مبلغ قابل پرداخت</span>
            <span className="text-[14px] font-black text-sn-text">
              {toFa(order.totalAmount)} تومان
            </span>
          </div>
        </div>

        {/* Download Invoice Button */}
        <button
          type="button"
          onClick={handleDownloadInvoice}
          className="w-full mt-3 h-11 rounded-[12px] bg-[#edf8f2] text-sn-green font-bold text-[11.5px] border border-[#d8ebe0] hover:bg-[#e2f4ea] active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-none"
        >
          <Download size={15} />
          دانلود فاکتور
        </button>
      </section>

      {/* 5. Order Reward Banner (پاداش این سفارش) */}
      <section className="mb-4">
        <h2 className="text-[13px] font-bold text-sn-text mb-2 px-1">
          پاداش این سفارش
        </h2>

        <div className="p-3.5 rounded-[14px] bg-[#edf8f2] border border-[#d8ebe0] flex items-center justify-between gap-3">
          <div className="text-right">
            <b className="block text-[12px] font-bold text-sn-green">
              {toFa(totalCashback || 36000)} تومان پاداش فعال شد
            </b>
            <p className="text-[9.5px] text-[#556960] mt-0.5">
              پاداش خرید این سفارش پس از تایید پرداخت به کیف پول شما اضافه شد.
            </p>
          </div>

          <div className="w-10 h-10 rounded-[10px] bg-[#dbeee2] flex items-center justify-center text-sn-green shrink-0">
            <Gift size={20} />
          </div>
        </div>
      </section>

      {/* 6. Support Button (نیاز به پشتیبانی دارم) */}
      <Link href="/support" className="block mt-4">
        <button
          type="button"
          className="w-full h-11 rounded-[12px] bg-[#edf8f2] text-sn-green font-bold text-[11.5px] border border-[#d8ebe0] hover:bg-[#e2f4ea] active:scale-98 transition-all flex items-center justify-center cursor-pointer shadow-none"
        >
          نیاز به پشتیبانی دارم
        </button>
      </Link>
    </AppShell>
  );
}
