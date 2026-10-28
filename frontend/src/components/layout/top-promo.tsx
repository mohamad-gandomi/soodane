import React from 'react';
import { BannerPlacement } from '@/components/shared/banner-placement';

export function TopPromo() {
  return <BannerPlacement placementKey="header.promo" compact className="-mx-4 -mt-3.5 mb-3.5" />;
}
