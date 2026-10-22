import React from 'react';
import { cn } from '@/lib/utils';
import { StoreAccess } from '@/components/auth/store-access';

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
  hasBottomNav?: boolean;
}

export function AppShell({ children, className, hasBottomNav = true }: AppShellProps) {
  return (
    <StoreAccess>
      <div className="min-h-screen bg-sn-bg flex justify-center">
        <div
          className={cn(
            'w-full max-w-app min-h-dvh bg-white text-sn-text relative flex flex-col shadow-[0_0_0_1px_#e5ece8]',
            className
          )}
        >
          <main
            className={cn(
              'flex-1 px-4 py-3.5',
              hasBottomNav ? 'pb-[100px]' : 'pb-[max(20px,env(safe-area-inset-bottom))]'
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </StoreAccess>
  );
}
