import { apiClient } from '@/lib/api-client';
import { Product, ProductFilterParams } from '@/types/product';

export function isProductAvailable(product: Product): boolean {
  if (product.productType === 'VARIABLE') {
    if (product.variants && product.variants.length > 0) {
      return product.variants.some((v) => (v.stockQuantity ?? 0) > 0);
    }
  }
  if (product.manageStock === true) {
    return (product.stockQuantity ?? 0) > 0;
  }
  return true;
}

export const productsService = {
  async getProducts(params?: ProductFilterParams & { includeOutOfStock?: boolean }): Promise<Product[]> {
    try {
      const data = await apiClient<Product[]>('/products', {
        params: {
          search: params?.search,
          categoryId: params?.categoryId, categorySlug: (params as any)?.categorySlug, limit: params?.limit || 500,
          minPrice: params?.minPrice,
          maxPrice: params?.maxPrice,
          sortBy: params?.sortBy,
        },
      });
      if (Array.isArray(data)) {
        const normalized = data.map(normalizeProduct);
        if (params?.includeOutOfStock) {
          return normalized;
        }
        return normalized.filter(isProductAvailable);
      }
    } catch {
      // Fallback
    }

    return [];
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    try {
      const data = await apiClient<Product>(`/products/${slug}`);
      if (data) return normalizeProduct(data);
    } catch {
      // Fallback
    }

    return null;
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.getProducts();
    return products.slice(0, 4);
  },
};

function normalizeProduct(p: any): Product {
  return {
    ...p,
    price: Number(p.salePrice ?? p.basePrice ?? p.price ?? 0),
    oldPrice: p.salePrice != null ? Number(p.basePrice) : p.oldPrice != null ? Number(p.oldPrice) : null,
    reward: Number(p.refereeRewardValue || p.reward || 0),
    image: p.images?.find((image: { isPrimary?: boolean }) => image.isPrimary)?.url || p.images?.[0]?.url || p.image || '/assets/products/rice.png',
    categories: Array.isArray(p.categories)
      ? p.categories.flatMap((category: string | { slug?: string; category?: { slug?: string } }) => {
          const slug = typeof category === 'string' ? category : category.slug || category.category?.slug;
          return slug ? [slug] : [];
        })
      : p.category?.slug ? [p.category.slug] : [],
  };
}
