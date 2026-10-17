import { apiClient } from '@/lib/api-client';
import { Product, ProductFilterParams } from '@/types/product';

export const productsService = {
  async getProducts(params?: ProductFilterParams): Promise<Product[]> {
    try {
      const data = await apiClient<Product[]>('/products', {
        params: {
          search: params?.search,
          categoryId: params?.categoryId,
          minPrice: params?.minPrice,
          maxPrice: params?.maxPrice,
          sortBy: params?.sortBy,
        },
      });
      if (Array.isArray(data)) {
        return data.map(normalizeProduct);
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
    price: Number(p.salePrice || p.basePrice || p.price || 0),
    oldPrice: p.salePrice ? Number(p.basePrice) : p.oldPrice || null,
    reward: Number(p.refereeRewardValue || p.reward || 0),
    image: p.images?.[0]?.url || p.image || '/assets/products/rice.png',
    categories: p.categories || (p.category?.slug ? [p.category.slug] : ['supermarket']),
  };
}
