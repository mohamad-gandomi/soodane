import { apiClient } from '@/lib/api-client';
import { BannerPlacement, BannerPlacementKey } from '@/types/banner';

export const bannersService = {
  getPlacement(key: BannerPlacementKey, signal?: AbortSignal) {
    return apiClient<BannerPlacement>(`/banners/${encodeURIComponent(key)}`, {
      cache: 'no-store',
      signal,
    });
  },
};
