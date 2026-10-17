import { apiClient } from '@/lib/api-client';
import { Address } from '@/types/user';

export const addressesService = {
  async getAddresses(): Promise<Address[]> {
    try {
      const data = await apiClient<Address[]>('/users/addresses');
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    } catch {
      return [];
    }
  },

  async addAddress(data: Omit<Address, 'id'>): Promise<Address> {
    const res = await apiClient<Address>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res;
  },

  async setDefaultAddress(id: string): Promise<void> {
    await apiClient(`/users/addresses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isDefaultShipping: true }),
    });
  },

  async deleteAddress(id: string): Promise<void> {
    await apiClient(`/users/addresses/${id}`, {
      method: 'DELETE',
    });
  },
};
