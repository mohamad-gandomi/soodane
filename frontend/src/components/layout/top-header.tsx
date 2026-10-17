import React from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface TopHeaderProps {
  title?: string;
  backHref?: string;
  children?: React.ReactNode;
  className?: string;
}

export function TopHeader({
  title,
  backHref,
  children,
  className,
}: TopHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-20 -mx-4 -mt-3.5 mb-4 flex items-center justify-between gap-2.5 bg-white/95 px-4 py-3.5 backdrop-blur-[10px] border-b border-[#eff2f0]',
        className
      )}
    >
      <div className="relative flex w-full items-center justify-between">
        <div className="z-10 flex items-center justify-start min-w-[36px]">
          {backHref ? (
            <Link
              href={backHref}
              className="flex h-[36px] w-[36px] items-center justify-center rounded-[9px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 transition-colors"
              aria-label="بازگشت"
            >
              <Icon name="back" size={18} />
            </Link>
          ) : (
            <span className="w-[36px]" />
          )}
        </div>

        <h1 className="absolute inset-x-0 text-center text-[16px] font-bold text-sn-text truncate px-12 pointer-events-none">
          {title}
        </h1>

        <div className="z-10 flex items-center justify-end min-w-[36px]">
          {children || <span className="w-[36px]" />}
        </div>
      </div>
    </header>
  );
}
