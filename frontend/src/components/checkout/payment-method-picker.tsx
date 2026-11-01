import React from 'react';
import { cn } from '@/lib/utils';
import { Truck, CreditCard, Landmark } from 'lucide-react';

export type PaymentMethodType = 'cod' | 'card' | 'online';

interface PaymentMethodPickerProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
}

export function PaymentMethodPicker({
  selectedMethod,
  onSelect,
}: PaymentMethodPickerProps) {
  const methods: {
    id: PaymentMethodType;
    title: string;
    desc: string;
    icon: typeof Truck;
    disabled?: boolean;
    badge?: string;
  }[] = [
    {
      id: 'cod',
      title: 'پرداخت در محل',
      desc: 'پرداخت نقدی یا کارتخوان هنگام تحویل',
      icon: Truck,
    },
    {
      id: 'card',
      title: 'کارت به کارت / واریز',
      desc: 'انتقال بانکی و ارسال تصویر فیش',
      icon: Landmark,
    },
    {
      id: 'online',
      title: 'درگاه آنلاین بانکی',
      desc: 'در انتظار فعال‌سازی درگاه و نماد',
      icon: CreditCard,
      disabled: true,
      badge: 'به‌زودی',
    },
  ];

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[13px] font-bold text-sn-text">روش پرداخت</h2>
        <span className="text-[10px] text-[#8e9d95]">پس از کسر پاداش</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;
          const isDisabled = m.disabled;
          return (
            <button
              key={m.id}
              type="button"
              disabled={isDisabled}
              onClick={() => !isDisabled && onSelect(m.id)}
              className={cn(
                'relative flex flex-col justify-between p-3 min-h-[90px] rounded-[10px] border text-right transition-all',
                isDisabled
                  ? 'border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed'
                  : 'border-sn-line bg-white cursor-pointer hover:border-sn-green/50',
                isSelected && !isDisabled && 'border-[#9fd0b5] bg-[#fbfefc] shadow-xs'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-sn-text">
                    {m.title}
                  </span>
                  {m.badge && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">
                      {m.badge}
                    </span>
                  )}
                </div>
                <div className="relative h-[18px] w-[18px] rounded-full border border-[#b7c9bf] flex items-center justify-center shrink-0">
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-sn-green" />
                  )}
                </div>
              </div>

              <p className="text-[9px] text-[#849089] mt-2 leading-relaxed">
                {m.desc}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
