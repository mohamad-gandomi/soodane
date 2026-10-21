import { apiClient } from '@/lib/api-client';
import { CreateOrderPayload, Order } from '@/types/order';

export interface ShippingMethod { id: string; name: string; price: number; currency: string; estimatedDays?: string; }
export interface PaymentGateway { id: string; type: string; currencies: string[]; }

export function checkoutKey(fingerprint: string): string {
  let previous: { fingerprint: string; key: string } | null = null;
  try { previous = JSON.parse(sessionStorage.getItem('soodane.checkout') || 'null'); } catch {}
  if (previous?.fingerprint === fingerprint && /^[a-f0-9]{64}$/.test(previous.key)) return previous.key;
  const key = Array.from(crypto.getRandomValues(new Uint8Array(32)), byte => byte.toString(16).padStart(2, '0')).join('');
  sessionStorage.setItem('soodane.checkout', JSON.stringify({ fingerprint, key }));
  return key;
}

export const ordersService = {
  getShippingMethods: () => apiClient<ShippingMethod[]>('/shipping/methods'),
  getGateways: () => apiClient<PaymentGateway[]>('/payments/gateways'),
  initiatePayment: (orderId: string, gateway: string) => apiClient<{ success: boolean; paymentUrl?: string; isOffline?: boolean }>('/payments/initiate', {
    method: 'POST', body: JSON.stringify({ orderId, gateway }),
  }),
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

  async createOrder(payload: CreateOrderPayload, idempotencyKey: string): Promise<Order> {
    const data = await apiClient<Order>('/orders', {
      method: 'POST',
      headers: { 'Idempotency-Key': idempotencyKey },
      body: JSON.stringify(payload),
    });
    return data;
  },
};
