import React from 'react';
import Link from 'next/link';

export function TopPromo() {
  return (
    <Link
      href="/special"
      className="block h-[60px] overflow-hidden bg-sn-deep leading-none relative group"
      aria-label="مشاهده تخفیف‌های ویژه"
    >
      <img
        src="/assets/promotions/top-promo.gif"
        alt="تخفیف ویژه سودانه"
        className="w-full h-[60px] object-cover group-hover:opacity-95 transition-opacity"
      />
    </Link>
  );
}
