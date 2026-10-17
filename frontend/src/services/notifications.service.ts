import { apiClient } from '@/lib/api-client';
import { AppNotification } from '@/types/notification';
import { formatRelativeShamsiTime } from '@/lib/date-utils';

export const notificationsService = {
  async getNotifications(): Promise<AppNotification[]> {
    try {
      const res = await apiClient<any>('/notifications/my');
      const items = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
        ? res
        : [];
      return items.map((n: any) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        isRead: Boolean(n.isRead),
        type: n.type || 'SYSTEM',
        createdAt: formatRelativeShamsiTime(n.createdAt),
      }));
    } catch {
      // Fallback
    }
    return [];
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient('/notifications/my/read-all', { method: 'PATCH' });
    } catch {
      // Fallback
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient(`/notifications/${id}/read`, { method: 'PATCH' });
    } catch {
      // Fallback
    }
  },
};
