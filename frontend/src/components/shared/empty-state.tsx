import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  message: string;
  icon?: string;
  className?: string;
}

export function EmptyState({ message, icon = '✦', className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'py-10 px-4 text-center text-[#7b8982] flex flex-col items-center justify-center gap-2 select-none',
        className
      )}
    >
      <span className="text-2xl text-sn-green/40">{icon}</span>
      <p className="text-[11px] font-medium">{message}</p>
    </div>
  );
}
