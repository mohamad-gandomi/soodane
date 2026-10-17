import React from 'react';
import { cn } from '@/lib/utils';

export type PaymentMethodType = 'online' | 'card';

interface PaymentMethodPickerProps {
  selectedMethod: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
}

export function PaymentMethodPicker({
  selectedMethod,
  onSelect,
}: PaymentMethodPickerProps) {
  const methods: { id: PaymentMethodType; title: string; desc: string }[] = [
    { id: 'online', title: 'پرداخت آنلاین', desc: 'درگاه بانکی شاپرک' },
    { id: 'card', title: 'کارت به کارت', desc: 'ارسال رسید پرداخت' },
  ];

  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[13px] font-bold text-sn-text">روش پرداخت</h2>
        <span className="text-[10px] text-[#8e9d95]">پس از کسر پاداش</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {methods.map((m) => {
          const isSelected = selectedMethod === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelect(m.id)}
              className={cn(
                'relative flex flex-col justify-between p-3 min-h-[90px] rounded-[10px] border border-sn-line bg-white text-right transition-colors cursor-pointer',
                isSelected && 'border-[#9fd0b5] bg-[#fbfefc]'
              )}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-sn-text">
                  {m.title}
                </span>
                <div className="relative h-[18px] w-[18px] rounded-full border border-[#b7c9bf] flex items-center justify-center shrink-0">
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-sn-green" />
                  )}
                </div>
              </div>

              <p className="text-[8.5px] text-[#849089] mt-2">{m.desc}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
