export type BannerPlacementKey = 'home.hero' | 'shop.hero' | 'header.promo';

export interface BannerItem {
  id: string;
  imageUrl: string;
  mobileImageUrl?: string | null;
  altText: string;
  linkUrl?: string | null;
  contentType?: 'IMAGE' | 'COMPOSITE';
  eyebrow?: string | null;
  displayTitle?: string | null;
  subtitle?: string | null;
  buttonText?: string | null;
  buttonUrl?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
}

export interface BannerPlacement {
  key: string;
  version: number;
  displayMode: 'single' | 'slider';
  autoplay: boolean;
  showDots: boolean;
  intervalMs: number | null;
  items: BannerItem[];
}
