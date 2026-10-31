'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, IconName } from '@/components/ui/icon';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: IconName;
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'home', href: '/', label: 'خانه' },
  { icon: 'special', href: '/special', label: 'شگفت‌انگیز' },
  { icon: 'orders', href: '/orders', label: 'سفارشات' },
  { icon: 'reward', href: '/rewards', label: 'پاداش' },
  { icon: 'account', href: '/account', label: 'حساب من' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  return (
    <nav
      className="fixed bottom-0 right-1/2 translate-x-1/2 z-40 w-full max-w-app h-[78px] grid grid-cols-5 items-center px-1.5 pb-[max(8px,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-[12px] border-t border-sn-line shadow-[0_-4px_16px_rgba(23,51,38,0.07)]"
      aria-label="ناوبری اصلی"
    >
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href === '/account' && !isAuthenticated ? '/auth?redirect=%2Faccount' : item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 py-1 text-[#7d8c84] transition-colors',
              isActive && 'text-sn-green font-extrabold'
            )}
          >
            <Icon name={item.icon} size={20} />
            <span
              className={cn(
                'text-[10.5px] leading-tight transition-all',
                isActive ? 'font-black scale-105' : 'font-medium'
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
