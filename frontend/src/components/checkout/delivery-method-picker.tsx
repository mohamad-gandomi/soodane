import React from 'react';
import { formatMoney } from '@/lib/utils';
import { cn } from '@/lib/utils';

export interface ShippingOption {
  id?: string;
  cost: number;
  title: string;
  description: string;
}

export const DEFAULT_SHIPPING_OPTIONS: ShippingOption[] = [
  { cost: 20000, title: 'ارسال عادی', description: 'تحویل در ۱ تا ۲ روز کاری' },
  { cost: 45000, title: 'ارسال سریع', description: 'تحویل امروز، ۱۸ تا ۲۱' },
];

interface DeliveryMethodPickerProps {
  selectedCost: number;
  selectedId?: string;
  onSelect: (cost: number, id?: string) => void;
  options?: ShippingOption[];
}

export function DeliveryMethodPicker({
  selectedCost,
  selectedId,
  onSelect,
  options = DEFAULT_SHIPPING_OPTIONS,
}: DeliveryMethodPickerProps) {
  return (
    <section className="mt-5">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-[13px] font-bold text-sn-text">روش ارسال</h2>
        <span className="text-[10px] text-[#8e9d95]">بازه تحویل</span>
      </div>

      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = selectedId ? selectedId === opt.id : selectedCost === opt.cost;
          return (
            <button
              key={opt.id || opt.title}
              type="button"
              onClick={() => onSelect(opt.cost, opt.id)}
              className={cn(
                'relative flex items-center justify-between p-3 rounded-[10px] border border-sn-line bg-white text-right transition-colors cursor-pointer',
                isSelected && 'border-[#9fd0b5] bg-[#fbfefc]'
              )}
            >
              <div className="flex items-center gap-2.5">
                {/* Radio indicator */}
                <div className="relative h-[18px] w-[18px] rounded-full border border-[#b7c9bf] flex items-center justify-center shrink-0">
                  {isSelected && (
                    <span className="h-2.5 w-2.5 rounded-full bg-sn-green" />
                  )}
                </div>

                <div>
                  <b className="block text-[11px] font-bold text-sn-text">
                    {opt.title}
                  </b>
                  <p className="text-[9px] text-[#7e8d85] mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-bold text-[#536b5e]">
                {formatMoney(opt.cost)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
