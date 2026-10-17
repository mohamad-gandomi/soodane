import { apiClient } from '@/lib/api-client';
import { FlashDeal } from '@/types/flash-deal';

export const flashDealsService = {
  async getActiveDeal(): Promise<FlashDeal | null> {
    try {
      const data = await apiClient<FlashDeal | null>('/flash-deals/active');
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        return data;
      }
      return null;
    } catch {
      return null;
    }
  },
};
