import { apiClient } from '@/lib/api-client';
import { Category } from '@/types/product';

export const categoriesService = {
  async getCategories(signal?: AbortSignal): Promise<Category[]> {
    const data = await apiClient<Category[]>('/categories', { signal });
    return Array.isArray(data) ? data : [];
  },
};
