import { formatOrderNumber } from '@/lib/utils';
import React from 'react';
import Link from 'next/link';
import { Order } from '@/types/order';
import { toFa } from '@/lib/utils';

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  // Format Persian date
  let formattedDate = '۲۶ شهریور ۱۴۰۵';
  if (order.createdAt) {
    const d = new Date(order.createdAt);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('fa-IR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
  }

  // Status badge config
  const renderStatusBadge = () => {
    switch (order.status) {
      case 'DELIVERED':
        return (
          <span className="px-2.5 py-1 rounded-[6px] bg-[#f0f3f1] text-[#718278] text-[10px] font-bold">
            تحویل‌شده
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-2.5 py-1 rounded-[6px] bg-[#ebf6f1] text-[#25855a] text-[10px] font-bold">
            در حال آماده‌سازی
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="px-2.5 py-1 rounded-[6px] bg-[#ebf6f1] text-[#25855a] text-[10px] font-bold">
            ارسال شده
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 rounded-[6px] bg-[#fef7ee] text-[#b45309] text-[10px] font-bold">
            در انتظار پرداخت
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 rounded-[6px] bg-[#fdf2f2] text-sn-danger text-[10px] font-bold">
            لغوشده
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-[6px] bg-[#ebf6f1] text-[#25855a] text-[10px] font-bold">
            در حال آماده‌سازی
          </span>
        );
    }
  };

  return (
    <article className="p-4 rounded-[16px] border border-sn-line/70 bg-white shadow-sm flex flex-col justify-between hover:border-sn-green/40 transition-colors">
      {/* Top Header Row: Order Number + Date on right, Status Badge on left */}
      <div className="flex items-start justify-between">
        <div>
          <b className="text-[13.5px] font-black text-sn-text">
            سفارش #{formatOrderNumber(order.orderNumber)}
          </b>
          <p className="text-[10px] text-[#86958e] mt-0.5">
            {formattedDate} · {toFa(order.items.length)} کالا
          </p>
        </div>

        {renderStatusBadge()}
      </div>

      {/* Middle Item Thumbnails Row */}
      <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="h-12 w-12 rounded-[11px] bg-[#f8faf9] p-1 flex items-center justify-center shrink-0 border border-sn-line/50 overflow-hidden"
          >
            <img
              src={item.productImage || item.product?.image || '/assets/products/rice.png'}
              alt={item.productName}
              className="h-full w-full object-contain pointer-events-none"
            />
          </div>
        ))}
      </div>

      {/* Bottom Row: Link on left, Price on right */}
      <div className="flex items-center justify-between border-t border-[#edf1ee] pt-3 mt-1">
        <Link
          href={`/orders/${order.id}`}
          className="text-sn-green text-[11.5px] font-bold hover:underline transition-all"
        >
          مشاهده جزئیات
        </Link>

        <div className="flex items-baseline gap-1">
          <span className="text-[14px] font-black text-sn-text">
            {toFa(order.totalAmount)}
          </span>
          <span className="text-[10px] text-sn-muted">تومان</span>
        </div>
      </div>
    </article>
  );
}
