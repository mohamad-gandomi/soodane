import { apiClient } from '@/lib/api-client';
import { Category } from '@/types/product';
import { HOME_CATEGORIES } from '@/lib/constants';

export const categoriesService = {
  async getCategories(): Promise<Category[]> {
    try {
      const data = await apiClient<any[]>('/categories');
      if (Array.isArray(data) && data.length > 0) {
        // فقط دسته‌بندی‌های مادر (Parent Categories)
        return data
          .filter((c) => !c.parentId)
          .map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            description: c.description,
            image: c.image || null,
          }));
      }
    } catch {
      // Fallback to constants
    }

    // Fallback categories
    return HOME_CATEGORIES.map((hc) => ({
      id: hc.id,
      name: hc.label,
      slug: hc.id,
      image: null,
      icon: hc.icon,
    })) as Category[];
  },
};
