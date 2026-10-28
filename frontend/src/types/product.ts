export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  displayOrder?: number;
  image?: string | null;
}

export interface ProductAttributeValue {
  id: string;
  name: string;
  value: string;
  colorHex?: string | null;
}

export interface ProductAttribute {
  id: string;
  name: string;
  slug: string;
  displayType?: string | null;
  values: ProductAttributeValue[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  salePrice?: number | null;
  stockQuantity: number;
  image?: string | null;
  attributeValues: {
    attributeValue: ProductAttributeValue;
  }[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string | null;
  productType?: 'SIMPLE' | 'VARIABLE';
  description: string;
  shortDescription?: string | null;
  basePrice: number;
  salePrice?: number | null;
  stockQuantity: number;
  manageStock?: boolean;
  featured?: boolean;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  categoryId?: string | null;
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
  attributes?: ProductAttribute[];
  referrerRewardValue?: number | null;
  refereeRewardValue?: number | null; // پاداش خرید مشتری (تومان)
  specifications?: { label: string; value: string }[] | null;
  // UI helper shortcuts:
  categories?: string[];
  reward?: number; // Normalized buyer reward amount in Toman
  price?: number;  // Current active price
  oldPrice?: number | null; // Before discount price
  image?: string;  // Primary image
}

export interface ProductFilterParams {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  hasDiscount?: boolean;
  hasReward?: boolean;
  sortBy?: 'bestselling' | 'newest' | 'cheapest' | 'expensive' | 'discount' | 'reward';
  page?: number;
  limit?: number;
}
