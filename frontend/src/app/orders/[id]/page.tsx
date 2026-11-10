'use client';

import { formatOrderNumber } from '@/lib/utils';

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
import { MapPin, Truck, CreditCard, Gift, Download, Landmark, FileText, CheckCircle2, Clock, XCircle, UploadCloud, Copy, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loadingReceipts, setLoadingReceipts] = useState(false);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [copiedCard, setCopiedCard] = useState(false);


  useEffect(() => {
    async function loadOrder() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const data = await ordersService.getOrderById(id);
        setOrder(data);
        if (data && (data.paymentMethod === 'BANK_TRANSFER' || (data.paymentMethod as string) === 'CARD_TO_CARD')) {
          try {
            const rData = await ordersService.getOrderReceipts(id);
            setReceipts(rData?.receipts || []);
          } catch {}
        }
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  const handleCopyCard = () => {
    navigator.clipboard.writeText('6037997588213456');
    setCopiedCard(true);
    toast.success('شماره کارت فروشگاه کپی شد');
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const handleUploadReceipt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptFile) {
      toast.error('لطفاً فایل تصویر یا فیش واریز را انتخاب کنید.');
      return;
    }
    setUploadingReceipt(true);
    try {
      await ordersService.uploadReceipt(id, receiptFile);
      toast.success('فیش پرداخت با موفقیت ثبت شد و در انتظار تأیید مدیریت قرار گرفت.');
      setReceiptFile(null);


      const rData = await ordersService.getOrderReceipts(id);
      setReceipts(rData?.receipts || []);
      const updatedOrder = await ordersService.getOrderById(id);
      if (updatedOrder) setOrder(updatedOrder);
    } catch (err: any) {
      toast.error(err.message || 'خطا در بارگذاری فیش');
    } finally {
      setUploadingReceipt(false);
    }
  };

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
  let orderDateStr = '—';
  let orderTimeStr = '—';
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

  // Calculate buyer reward (سود مشارکت شما)
  const buyerReward =
    Number((order as any).buyerReward || 0) ||
    Number((order as any).refereeReward || 0) ||
    Number((order as any).referralRewardSnapshot?.refereeAmount || 0) ||
    order.items.reduce(
      (sum, item) => sum + (Number((item as any).cashbackEarned || (item as any).refereeReward || 0)),
      0
    );
  const totalCashback = buyerReward;

  const handleDownloadInvoice = () => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('لطفاً باز شدن پنجره‌های پاپ‌آپ را در مرورگر مجاز کنید.');
      return;
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://app.sodaneh.ir';
    const resolveImg = (src?: string | null) => {
      if (!src) return `${origin}/placeholder.webp`;
      if (src.startsWith('http://') || src.startsWith('https://')) return src;
      if (src.startsWith('/')) return `${origin}${src}`;
      return `${origin}/${src}`;
    };

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="fa">
<head>
  <meta charset="utf-8">
  <base href="${origin}/">
  <title>فاکتور سفارش ${order.orderNumber} - سودانه</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: Tahoma, Vazirmatn, system-ui, sans-serif; }
    body { background-color: #f8faf9; color: #1c2b23; padding: 24px; font-size: 13px; line-height: 1.6; }
    .invoice-card { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #e1e7e4; border-radius: 12px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2f9467; padding-bottom: 18px; margin-bottom: 24px; }
    .brand { font-size: 22px; font-weight: 900; color: #166543; }
    .brand small { display: block; font-size: 11px; font-weight: normal; color: #64746b; margin-top: 4px; }
    .badge { background: #e8f5ee; color: #166543; font-weight: bold; padding: 5px 14px; border-radius: 20px; font-size: 12px; }
    .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 24px; background: #fbfdfc; border: 1px solid #edf2ef; border-radius: 8px; padding: 16px; }
    .meta-item { display: flex; justify-content: space-between; font-size: 12px; }
    .meta-label { color: #64746b; }
    .meta-val { font-weight: 700; color: #1c2b23; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    th { background: #f2f7f4; color: #2c4436; font-weight: 700; text-align: right; padding: 10px 12px; font-size: 12px; border-bottom: 1px solid #e1e7e4; }
    td { padding: 10px 12px; border-bottom: 1px solid #edf2ef; font-size: 12px; vertical-align: middle; }
    .num { text-align: center; }
    .currency { text-align: left; direction: ltr; }
    .product-img { width: 48px; height: 48px; object-fit: contain; border-radius: 8px; border: 1px solid #e1e7e4; background: #fafcfb; display: block; margin: 0 auto; }
    .totals { margin-right: auto; max-width: 340px; border-top: 1px solid #e1e7e4; padding-top: 10px; }
    .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; color: #4b5d53; }
    .totals-row.final { border-top: 2px solid #2f9467; margin-top: 6px; padding-top: 10px; font-size: 14px; font-weight: 900; color: #166543; }
    .totals-row.reward { color: #166543; font-weight: 700; background: #edf8f2; padding: 6px 10px; border-radius: 8px; margin-top: 8px; border: 1px dashed #2f9467; }
    .partner-reward-box { margin-top: 24px; background: linear-gradient(135deg, #f0f8f3 0%, #e3f3ea 100%); border: 1.5px solid #2f9467; border-radius: 10px; padding: 14px 18px; }
    .partner-reward-header { display: flex; align-items: center; justify-content: space-between; font-size: 13.5px; font-weight: 800; color: #145939; }
    .partner-reward-val { font-size: 15px; font-weight: 900; color: #166543; direction: ltr; }
    .partner-reward-desc { font-size: 11px; color: #4a6857; margin-top: 6px; border-top: 1px dashed #bddfcb; padding-top: 6px; line-height: 1.6; }
    .footer { text-align: center; color: #84938a; font-size: 11px; margin-top: 36px; border-top: 1px dashed #d5ded9; padding-top: 16px; }
    .actions { text-align: center; margin-bottom: 20px; }
    .btn-print { background: #2f9467; color: white; border: none; padding: 10px 24px; border-radius: 8px; font-size: 13px; font-weight: bold; cursor: pointer; }
    .btn-print:hover { background: #237450; }
    @media print {
      body { background: white; padding: 0; }
      .invoice-card { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .actions { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn-print" onclick="window.print()">🖨️ چاپ یا ذخیره به صورت PDF</button>
  </div>
  <div class="invoice-card">
    <div class="header">
      <div>
        <div class="brand">فروشگاه سودانه</div>
        <small>ارائه محصولات تازه و ارگانیک | sodaneh.ir</small>
      </div>
      <div>
        <span class="badge">فاکتور رسمی فروش</span>
      </div>
    </div>
    <div class="meta-grid">
      <div class="meta-item"><span class="meta-label">شماره سفارش:</span><span class="meta-val" dir="ltr">${order.orderNumber}</span></div>
      <div class="meta-item"><span class="meta-label">تاریخ ثبت:</span><span class="meta-val">${orderDateStr} ساعت ${orderTimeStr}</span></div>
      <div class="meta-item"><span class="meta-label">نام خریدار:</span><span class="meta-val">${order.customerName || 'مشتری'}</span></div>
      <div class="meta-item"><span class="meta-label">شماره تماس:</span><span class="meta-val" dir="ltr">${order.customerPhone || '—'}</span></div>
      <div class="meta-item"><span class="meta-label">روش پرداخت:</span><span class="meta-val">${order.paymentMethod === 'BANK_TRANSFER' ? 'کارت به کارت / فیش' : order.paymentMethod === 'CASH_ON_DELIVERY' ? 'پرداخت در محل' : 'پرداخت آنلاین'}</span></div>
      <div class="meta-item"><span class="meta-label">نشانی تحویل:</span><span class="meta-val">${order.shippingAddress?.street ? `${order.shippingAddress.city || ''} - ${order.shippingAddress.street}` : '—'}</span></div>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 36px;" class="num">#</th>
          <th style="width: 60px;" class="num">تصویر</th>
          <th>نام کالا</th>
          <th style="width: 60px;" class="num">تعداد</th>
          <th style="width: 120px;" class="currency">قیمت واحد</th>
          <th style="width: 130px;" class="currency">مبلغ کل</th>
        </tr>
      </thead>
      <tbody>
        ${order.items.map((it, idx) => `
          <tr>
            <td class="num">${idx + 1}</td>
            <td class="num" style="padding: 6px 4px;">
              <img src="${resolveImg(it.productImage || (it.product && (it.product as any).image))}" 
                   alt="${it.productName}" 
                   class="product-img"
                   onerror="this.style.display='none'" />
            </td>
            <td style="font-weight: 600;">${it.productName}</td>
            <td class="num">${it.quantity}</td>
            <td class="currency">${toFa(it.unitPrice)} تومان</td>
            <td class="currency" style="font-weight: 700;">${toFa(it.totalPrice)} تومان</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div class="totals">
      <div class="totals-row"><span>جمع اقلام:</span><span dir="ltr">${toFa(order.subtotal || order.items.reduce((s, i) => s + Number(i.totalPrice), 0))} تومان</span></div>
      ${order.shippingAmount ? `<div class="totals-row"><span>هزینه ارسال:</span><span dir="ltr">${toFa(order.shippingAmount)} تومان</span></div>` : ''}
      ${order.taxAmount ? `<div class="totals-row"><span>مالیات:</span><span dir="ltr">${toFa(order.taxAmount)} تومان</span></div>` : ''}
      ${order.discountAmount ? `<div class="totals-row" style="color: #2f9467;"><span>تخفیف:</span><span dir="ltr">− ${toFa(order.discountAmount)} تومان</span></div>` : ''}
      ${order.walletAmountPaid ? `<div class="totals-row" style="color: #2f9467;"><span>پرداخت از کیف پول:</span><span dir="ltr">− ${toFa(order.walletAmountPaid)} تومان</span></div>` : ''}
      <div class="totals-row final"><span>مبلغ نهایی:</span><span dir="ltr">${toFa(order.totalAmount)} تومان</span></div>
      ${buyerReward > 0 ? `
      <div class="totals-row reward">
        <span>سود مشارکت شما:</span>
        <span dir="ltr">+ ${toFa(buyerReward)} تومان</span>
      </div>` : ''}
    </div>
    ${buyerReward > 0 ? `
    <div class="partner-reward-box">
      <div class="partner-reward-header">
        <span>سود مشارکت شما از خرید این فاکتور:</span>
        <span class="partner-reward-val">${toFa(buyerReward)} تومان</span>
      </div>
      <p class="partner-reward-desc">این سود پس از تحویل نهایی سفارش به موجودی کیف پول نقدی شما واریز شده و در سفارش‌های بعدی یا تسویه در دسترس خواهد بود.</p>
    </div>` : ''}
    <div class="footer">
      از خرید شما از فروشگاه سودانه سپاسگزاریم • پشتیبانی و پیگیری: sodaneh.ir
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    toast.success('پیش‌نمایش فاکتور باز شد');
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
              سفارش #{formatOrderNumber(order.orderNumber)}
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
              {order.paymentMethod === 'CASH_ON_DELIVERY' ? <Truck size={16} /> : order.paymentMethod === 'BANK_TRANSFER' || (order.paymentMethod as string) === 'CARD_TO_CARD' ? <Landmark size={16} /> : <CreditCard size={16} />}
            </div>
            <div>
              <b className="block text-[11px] font-bold text-sn-text">
                {order.paymentMethod === 'CASH_ON_DELIVERY'
                  ? 'پرداخت نقدی در محل'
                  : order.paymentMethod === 'BANK_TRANSFER' || (order.paymentMethod as string) === 'CARD_TO_CARD'
                  ? 'کارت به کارت / فیش بانکی'
                  : order.paymentMethod === 'WALLET'
                  ? 'کیف پول و اعتبار پاداش'
                  : 'پرداخت آنلاین شاپرک'}
              </b>
              <p className="text-[10px] text-[#6b7b73] mt-0.5">
                {order.paymentStatus === 'PAID'
                  ? (order.paymentMethod === 'CASH_ON_DELIVERY' ? 'پرداخت در محل تسویه و تأیید شده است.' : 'پرداخت با موفقیت تأیید شده است.')
                  : (order.paymentMethod === 'CASH_ON_DELIVERY'
                      ? 'مبلغ سفارش هنگام تحویل دریافت خواهد شد.'
                      : order.paymentMethod === 'BANK_TRANSFER' || (order.paymentMethod as string) === 'CARD_TO_CARD'
                      ? (receipts.some(r => r.status === 'PENDING_REVIEW')
                          ? 'فیش شما ارسال شده و در حال بررسی توسط مدیریت است.'
                          : 'لطفاً فیش واریزی خود را در بخش زیر بارگذاری فرمایید.')
                      : 'در انتظار پرداخت')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bank Transfer Details & Receipt Upload Section */}
      {(order.paymentMethod === 'BANK_TRANSFER' || (order.paymentMethod as string) === 'CARD_TO_CARD') && (
        <section className="mb-4">
          <h2 className="text-[13px] font-bold text-sn-text mb-2 px-1">
            واریز کارت به کارت و ارسال فیش
          </h2>

          <div className="p-4 rounded-[16px] bg-[#fbfdfc] border border-[#d8ebe0] shadow-none">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[8px] bg-[#edf8f2] flex items-center justify-center text-sn-green shrink-0">
                <Landmark size={16} />
              </div>
              <div>
                <b className="block text-[12px] font-bold text-sn-text">حساب بانکی فروشگاه سودانه</b>
                <span className="text-[10px] text-[#6b7b73]">لطفاً مبلغ کل را واریز و تصویر فیش یا اسکرین‌شات رسید را ارسال کنید.</span>
              </div>
            </div>

            <div className="bg-white rounded-[12px] border border-sn-line/60 p-3 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7b73]">شماره کارت بانکی:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold tracking-wider text-sn-text text-[13px]" dir="ltr">۶۰۳۷-۹۹۷۵-۸۸۲۱-۳۴۵۶</span>
                  <button
                    type="button"
                    onClick={handleCopyCard}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[8px] bg-[#f0f7f3] text-sn-green hover:bg-[#e2f1e8] active:scale-95 transition-all text-[11px] font-bold cursor-pointer"
                    title="کپی شماره کارت"
                  >
                    {copiedCard ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-700">کپی شد</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>کپی</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7b73]">صاحب حساب:</span>
                <span className="font-bold text-sn-text">فروشگاه محصولات ارگانیک سودانه</span>
              </div>
              <div className="flex items-center justify-between border-t border-sn-line/40 pt-2">
                <span className="text-[#6b7b73]">مبلغ قابل پرداخت:</span>
                <span className="font-black text-sn-green text-sm">{toFa(order.totalAmount)} تومان</span>
              </div>
            </div>

            {/* List of previously uploaded receipts */}
            {receipts.length > 0 && (
              <div className="mt-4 space-y-2">
                <h3 className="text-[11px] font-bold text-sn-text">رسیدهای ارسال‌شده شما:</h3>
                {receipts.map((rc) => (
                  <div key={rc.id} className="p-2.5 rounded-[10px] bg-white border border-sn-line/60 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <FileText size={14} className="text-[#6b7b73]" />
                        <span className="font-medium text-[11px]">{rc.originalName || 'رسید پرداخت'}</span>
                      </div>
                      {rc.trackingNumber && (
                        <span className="text-[10px] text-[#849089] block">شماره ارجاع / پیگیری: {rc.trackingNumber}</span>
                      )}
                    </div>
                    <div className="text-left">
                      {rc.status === 'APPROVED' && (
                        <span className="px-2 py-0.5 rounded-[6px] bg-emerald-50 text-emerald-700 text-[10px] font-bold inline-flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          تأیید شد
                        </span>
                      )}
                      {rc.status === 'PENDING_REVIEW' && (
                        <span className="px-2 py-0.5 rounded-[6px] bg-amber-50 text-amber-700 text-[10px] font-bold inline-flex items-center gap-1">
                          <Clock size={12} />
                          در انتظار بررسی
                        </span>
                      )}
                      {rc.status === 'REJECTED' && (
                        <div>
                          <span className="px-2 py-0.5 rounded-[6px] bg-red-50 text-red-700 text-[10px] font-bold inline-flex items-center gap-1">
                            <XCircle size={12} />
                            رد شد
                          </span>
                          {rc.rejectionReason && (
                            <p className="text-[9px] text-red-600 mt-0.5 max-w-[150px] truncate">{rc.rejectionReason}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Form - Clean, Minimal & Effortless UI */}
            {order.paymentStatus !== 'PAID' && (
              <form onSubmit={handleUploadReceipt} className="mt-4 pt-3 border-t border-[#d8ebe0] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12px] font-bold text-sn-text flex items-center gap-1.5">
                    <UploadCloud size={16} className="text-sn-green" />
                    {receipts.length > 0 ? 'ارسال مجدد فیش یا رسید جدید' : 'بارگذاری فیش واریز'}
                  </h3>
                  <span className="text-[10px] text-[#8e9d95]">تصویر یا PDF</span>
                </div>

                {!receiptFile ? (
                  <label className="group relative flex flex-col items-center justify-center p-5 border-2 border-dashed border-[#a8d3bc] hover:border-sn-green bg-[#f7fbf8] hover:bg-[#eff7f2] rounded-[14px] cursor-pointer transition-all duration-200">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,application/pdf"
                      required
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="sr-only"
                    />
                    <div className="w-10 h-10 rounded-full bg-[#e3f2e9] text-sn-green flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <UploadCloud size={20} />
                    </div>
                    <span className="text-[12px] font-bold text-sn-text">
                      برای انتخاب یا بارگذاری فیش ضربه بزنید
                    </span>
                    <span className="text-[10px] text-[#7d8f85] mt-1">
                      فرمت‌های مجاز: JPG, PNG, WEBP یا PDF (تا ۱۰ مگابایت)
                    </span>
                  </label>
                ) : (
                  <div className="p-3.5 rounded-[12px] bg-[#f0f8f3] border border-[#a4d7ba] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <div className="w-9 h-9 rounded-[8px] bg-sn-green/10 text-sn-green flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-bold text-sn-text truncate">
                          {receiptFile.name}
                        </p>
                        <p className="text-[10px] text-[#71847a]">
                          {(receiptFile.size / 1024).toFixed(1)} کیلوبایت • آماده ارسال
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setReceiptFile(null)}
                      className="p-1.5 rounded-[8px] text-[#dc2626] hover:bg-red-100/60 active:scale-95 transition-all"
                      title="حذف و انتخاب فایل دیگر"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploadingReceipt || !receiptFile}
                  className="w-full h-[44px] rounded-[10px] bg-sn-green hover:bg-[#116949] text-white font-bold text-[12.5px] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-none"
                >
                  {uploadingReceipt ? (
                    <>
                      <Clock size={15} className="animate-spin" />
                      <span>در حال ارسال فیش...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>ارسال فیش واریزی</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* 4. Financial Summary (خلاصه مبلغ) */}
      <section className="mb-4">
        <h2 className="text-[13px] font-bold text-sn-text mb-2 px-1">
          خلاصه مبلغ
        </h2>

        <div className="p-4 rounded-[16px] bg-white border border-sn-line/60 shadow-none space-y-2 text-[11px]">
          <div className="flex justify-between items-center text-[#6e7d75]">
            <span>جمع کالاها</span>
            <span className="font-bold text-sn-text">{toFa(order.subtotal ?? 0)} تومان</span>
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
            <span className="font-bold text-sn-text">{toFa(order.shippingAmount ?? 0)} تومان</span>
          </div>

          <div className="flex justify-between items-center text-[#6e7d75]">
            <span>مالیات</span>
            <span className="font-bold text-sn-text">{toFa(order.taxAmount ?? 0)} تومان</span>
          </div>
          <div className="flex justify-between items-center border-t border-[#edf1ee] pt-2.5 mt-2">
            <span className="font-bold text-sn-text">مبلغ قابل پرداخت</span>
            <span className="text-[14px] font-black text-sn-text">
              {toFa(order.totalAmount)} تومان
            </span>
          </div>

          {buyerReward > 0 && (
            <div className="flex justify-between items-center text-sn-green bg-[#edf8f2] px-3 py-2 rounded-[10px] mt-2 border border-[#d8ebe0]">
              <span className="font-bold text-[11.5px]">سود مشارکت شما از این سفارش</span>
              <span className="font-bold text-[12px]">+ {toFa(buyerReward)} تومان</span>
            </div>
          )}
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

      {/* Only show a reward amount actually returned for this paid order. */}
      {buyerReward > 0 && <section className="mb-4">
        <h2 className="text-[13px] font-bold text-sn-text mb-2 px-1">
          سود مشارکت این سفارش
        </h2>

        <div className="p-3.5 rounded-[14px] bg-[#edf8f2] border border-[#d8ebe0] flex items-center justify-between gap-3">
          <div className="text-right">
            <b className="block text-[12px] font-bold text-sn-green">
              {toFa(buyerReward)} تومان سود مشارکت فعال شد
            </b>
            <p className="text-[9.5px] text-[#556960] mt-0.5">
              سود مشارکت شما از این سفارش پس از تایید پرداخت به کیف پول شما اضافه شد.
            </p>
          </div>

          <div className="w-10 h-10 rounded-[10px] bg-[#dbeee2] flex items-center justify-center text-sn-green shrink-0">
            <Gift size={20} />
          </div>
        </div>
      </section>}

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
