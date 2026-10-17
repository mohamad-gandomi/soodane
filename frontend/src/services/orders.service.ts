import { apiClient } from '@/lib/api-client';
import { CreateOrderPayload, Order } from '@/types/order';

export const ordersService = {
  async getMyOrders(): Promise<Order[]> {
    try {
      const data = await apiClient<Order[]>('/orders/my-orders');
      if (Array.isArray(data)) {
        return data;
      }
    } catch {
      // Fallback
    }

    return [];
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const data = await apiClient<Order>(`/orders/${id}`);
      if (data) return data;
    } catch {
      // Fallback
    }

    return null;
  },

  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const data = await apiClient<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return data;
  },
};
