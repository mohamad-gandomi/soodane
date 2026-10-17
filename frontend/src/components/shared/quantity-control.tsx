'use client';

import React from 'react';
import { toFa } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface QuantityControlProps {
  value: number;
  onChange: (value: number) => void;
  className?: string;
  min?: number;
  max?: number;
}

export function QuantityControl({
  value,
  onChange,
  className,
  min = 0,
  max = 10,
}: QuantityControlProps) {
  if (value <= 0) {
    return (
      <button
        type="button"
        onClick={() => onChange(1)}
        className={cn(
          'h-[29px] min-w-[69px] rounded-[7px] bg-[rgba(23,129,90,0.09)] text-sn-green text-[9px] font-extrabold flex items-center justify-center hover:bg-[rgba(23,129,90,0.15)] active:scale-95 transition-all cursor-pointer',
          className
        )}
      >
        + افزودن
      </button>
    );
  }

  return (
    <div
      className={cn(
        'h-[29px] min-w-[69px] rounded-[7px] bg-[rgba(23,129,90,0.09)] text-sn-green text-[9px] font-extrabold flex items-center justify-between px-1.5 gap-1',
        className
      )}
    >
      <button
        type="button"
        aria-label="افزایش"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="w-[18px] h-[18px] flex items-center justify-center text-sn-green text-[15px] hover:opacity-70 active:scale-90 transition-transform cursor-pointer"
      >
        +
      </button>

      <span className="font-bold select-none text-[10px] min-w-[14px] text-center">
        {toFa(value)}
      </span>

      <button
        type="button"
        aria-label="کاهش"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-[18px] h-[18px] flex items-center justify-center text-sn-green text-[15px] hover:opacity-70 active:scale-90 transition-transform cursor-pointer"
      >
        −
      </button>
    </div>
  );
}
