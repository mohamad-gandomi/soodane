import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center min-h-[21px] rounded-[6px] px-2 py-0.5 text-[8px] font-bold transition-colors whitespace-nowrap select-none',
  {
    variants: {
      variant: {
        default: 'bg-[rgba(23,129,90,0.09)] text-sn-green',
        outline: 'border border-sn-line text-sn-muted',
        discount: 'bg-[rgba(233,39,39,0.09)] text-[#d44b4b] font-extrabold',
        secondary: 'bg-sn-pale text-sn-deep',
        muted: 'bg-[#f4f7f5] text-sn-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
