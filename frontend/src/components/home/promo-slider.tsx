import React from 'react';
import { BannerPlacement } from '@/components/shared/banner-placement';

export function PromoSlider({ catalogMode = false }: { catalogMode?: boolean }) {
  return <BannerPlacement placementKey={catalogMode ? 'shop.hero' : 'home.hero'} />;
}
