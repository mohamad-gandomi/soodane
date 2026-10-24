import type { Metadata } from 'next';
import type { ReactNode } from 'react';

// Temporary title for eNAMAD ownership verification; restore after approval.
export const metadata: Metadata = {
  title: '20747268',
};

export default function LandingLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
