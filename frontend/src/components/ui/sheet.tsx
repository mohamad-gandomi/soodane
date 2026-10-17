'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ isOpen, onClose, title, children, className }: SheetProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[#173326]/30 backdrop-blur-[2px] transition-opacity"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <section
        className={cn(
          'w-full max-w-app max-h-[85dvh] overflow-y-auto rounded-t-[20px] bg-white p-4 pb-[max(20px,env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom duration-200',
          className
        )}
      >
        <span className="mx-auto mb-3.5 block h-1 w-9 rounded-full bg-[#dce4df]" />
        {title && (
          <div className="flex items-center justify-between border-b border-sn-line pb-2.5 mb-3">
            <strong className="text-[14px] font-bold text-sn-text">{title}</strong>
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-[#f4f7f5] text-[18px] text-[#567065] hover:bg-[#e8ece9] transition-colors"
              aria-label="بستن"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </section>
    </div>
  );
}
