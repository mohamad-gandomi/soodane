import React from 'react';
import { cn } from '@/lib/utils';
import { Order } from '@/types/order';

interface OrderTimelineProps {
  order?: Order | null;
  currentStepIndex?: number;
}

export function OrderTimeline({ order, currentStepIndex }: OrderTimelineProps) {
  // Determine current active step index (0 to 4)
  let activeIndex = currentStepIndex ?? 2;
  if (order && currentStepIndex === undefined) {
    switch (order.status) {
      case 'PENDING':
        activeIndex = 1;
        break;
      case 'PROCESSING':
        activeIndex = 2;
        break;
      case 'SHIPPED':
        activeIndex = 3;
        break;
      case 'DELIVERED':
        activeIndex = 4;
        break;
      default:
        activeIndex = 2;
    }
  }

  // Extract dates / notes for steps if order is provided
  let orderDateStr = '۲۶ شهریور';
  let orderTimeStr = '۱۲:۳۰';
  if (order?.createdAt) {
    const d = new Date(order.createdAt);
    if (!isNaN(d.getTime())) {
      orderDateStr = d.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' });
      orderTimeStr = d.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    }
  }

  const steps = [
    { title: 'ثبت سفارش', sub: orderDateStr },
    { title: 'تأیید پرداخت', sub: activeIndex >= 1 ? orderTimeStr : '' },
    { title: 'آماده‌سازی', sub: activeIndex === 2 ? 'در حال انجام' : activeIndex > 2 ? 'تکمیل شد' : '' },
    { title: 'ارسال سفارش', sub: activeIndex === 3 ? 'در حال ارسال' : activeIndex > 3 ? 'ارسال شد' : '' },
    { title: 'تحویل سفارش', sub: activeIndex === 4 ? 'تحویل شد' : '' },
  ];

  return (
    <div className="relative mt-5 mb-2 select-none">
      {/* Background connecting track */}
      <div className="absolute top-2.5 right-6 left-6 h-[2.5px] bg-[#e4ede7] -z-0">
        <div
          className="h-full bg-sn-green transition-all duration-300"
          style={{
            width: `${Math.min(100, Math.max(0, (activeIndex / (steps.length - 1)) * 100))}%`,
          }}
        />
      </div>

      {/* Steps Row */}
      <div className="grid grid-cols-5 text-center relative z-10">
        {steps.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={step.title} className="flex flex-col items-center">
              {/* Dot Icon */}
              <div
                className={cn(
                  'h-5 w-5 rounded-full flex items-center justify-center transition-all bg-white border-2',
                  isDone && 'bg-sn-green border-sn-green text-white',
                  isCurrent && 'bg-sn-green border-sn-green ring-4 ring-[#edf8f2] text-white',
                  !isDone && !isCurrent && 'bg-white border-[#d2dfd7]'
                )}
              >
                {isDone && <span className="text-[10px] font-black leading-none">✓</span>}
                {isCurrent && <span className="h-2 w-2 rounded-full bg-white" />}
              </div>

              {/* Step Title */}
              <span
                className={cn(
                  'mt-1.5 text-[9.5px] leading-tight',
                  isCurrent ? 'font-bold text-sn-text' : isDone ? 'font-medium text-[#44584e]' : 'text-[#8e9c94]'
                )}
              >
                {step.title}
              </span>

              {/* Step Subtitle / Timestamp */}
              <span className="text-[8px] text-[#8e9c94] mt-0.5 min-h-[12px] leading-none">
                {step.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
