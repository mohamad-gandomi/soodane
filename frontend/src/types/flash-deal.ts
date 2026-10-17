import { Product } from './product';

export interface FlashDealItem {
  id: string;
  dealId?: string;
  productId: string;
  productName?: string;
  productSlug?: string;
  categoryName?: string;
  imageUrl?: string | null;
  originalPrice?: number;
  specialPrice: number;
  discountPercentage?: number;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  cashbackAmount?: number | null; // پاداش خرید (تومان)
  referrerReward?: number | null; // پاداش معرف (تومان)
  stockLimit?: number | null;
  soldCount?: number;
  isAvailable?: boolean;
  product?: Product;
}

export interface FlashDeal {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  badgeText?: string | null;
  bannerImage?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  remainingSeconds?: number;
  defaultCashback?: number | null;
  defaultReferrerReward?: number | null;
  items: FlashDealItem[];
}
