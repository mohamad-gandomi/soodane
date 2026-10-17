import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[44px] w-full rounded-[8px] border border-sn-line bg-white px-3 py-2 text-[11px] text-sn-text placeholder:text-[#a0aaa5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sn-green disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#f8faf9]',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
