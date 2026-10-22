'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { isPublicPage } from '@/lib/access';

export function StoreAccess({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const publicPage = isPublicPage(pathname);

  useEffect(() => {
    if (!publicPage && !isLoading && !isAuthenticated) {
      router.replace(`/auth?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    }
  }, [publicPage, isLoading, isAuthenticated, router]);

  if (!publicPage && (isLoading || !isAuthenticated)) {
    return <div role="status" className="p-8 text-center text-sn-muted text-sm">در حال بررسی ورود...</div>;
  }
  return children;
}
