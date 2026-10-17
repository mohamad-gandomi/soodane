import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[10px] text-[11px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sn-green disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-sn-green text-white hover:bg-sn-deep active:scale-[0.98]',
        secondary:
          'bg-[rgba(23,129,90,0.09)] text-sn-green hover:bg-[rgba(23,129,90,0.15)] active:scale-[0.98]',
        danger:
          'bg-[rgba(189,90,90,0.09)] text-sn-danger hover:bg-[rgba(189,90,90,0.15)] active:scale-[0.98]',
        outline:
          'border border-sn-line bg-white text-sn-text hover:bg-slate-50',
        ghost: 'text-sn-muted hover:text-sn-text hover:bg-black/5',
        link: 'text-sn-green underline-offset-4 hover:underline p-0 h-auto font-normal',
      },
      size: {
        default: 'h-[44px] px-4 py-2',
        sm: 'h-[32px] px-3 text-[10px]',
        lg: 'h-[48px] px-6 text-[12px]',
        icon: 'h-[36px] w-[36px] p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
