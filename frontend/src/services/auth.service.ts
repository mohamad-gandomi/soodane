import { apiClient } from '@/lib/api-client';
import { storage } from '@/lib/storage';
import { User } from '@/types/user';

export interface SendOtpResponse {
  success: boolean;
  message: string;
  phone?: string;
  expiresIn?: number;
  devCode?: string;
}

export interface VerifyOtpResponse {
  user: User;
  token: string;
  isNewUser?: boolean;
}

export function toEnglishDigits(value: string): string {
  return String(value || '')
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));
}

export function normalizePhoneNumber(rawPhone: string): string {
  const digits = toEnglishDigits(rawPhone).replace(/\D/g, '');
  if (digits.startsWith('989')) return '0' + digits.slice(2);
  if (digits.startsWith('9') && digits.length === 10) return '0' + digits;
  return digits;
}

export const authService = {
  async sendOtp(phone: string): Promise<SendOtpResponse> {
    const cleanPhone = normalizePhoneNumber(phone);
    try {
      const res = await apiClient<SendOtpResponse>('/auth/otp/send', {
        method: 'POST',
        body: JSON.stringify({ phone: cleanPhone }),
      });
      return {
        success: true,
        message: res?.message || 'کد تأیید ارسال شد',
        phone: res?.phone || cleanPhone,
        expiresIn: res?.expiresIn || 120,
        devCode: res?.devCode,
      };
    } catch (error: any) {
      throw new Error(error?.message || 'خطا در ارسال کد تأیید');
    }
  },

  async verifyOtp(phone: string, code: string): Promise<VerifyOtpResponse> {
    const cleanPhone = normalizePhoneNumber(phone);
    const cleanCode = toEnglishDigits(code).trim();
    try {
      const res = await apiClient<{
        user: User;
        accessToken: string;
        isNewUser?: boolean;
      }>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone: cleanPhone, code: cleanCode }),
      });

      if (res?.accessToken && res?.user) {
        storage.setToken(res.accessToken);
        storage.setUser(res.user);
        return {
          user: res.user,
          token: res.accessToken,
          isNewUser: res.isNewUser,
        };
      }
      throw new Error('پاسخ نامعتبر از سرور');
    } catch (error: any) {
      throw new Error(error?.message || 'کد تأیید وارد شده صحیح نمی‌باشد');
    }
  },

  async getProfile(): Promise<User | null> {
    const token = storage.getToken();
    if (!token) return null;

    try {
      const user = await apiClient<User>('/auth/me');
      if (user) {
        storage.setUser(user);
        return user;
      }
      return null;
    } catch {
      storage.removeToken();
      storage.removeUser();
      return null;
    }
  },

  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    nationalId?: string;
    birthDate?: string;
  }): Promise<User> {
    try {
      const updated = await apiClient<User>('/auth/profile', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      if (updated) {
        storage.setUser(updated);
        return updated;
      }
      throw new Error('خطا در به‌روزرسانی مشخصات');
    } catch (error: any) {
      throw new Error(error?.message || 'خطا در ذخیره اطلاعات کاربری');
    }
  },

  logout(): void {
    storage.removeToken();
    storage.removeUser();
  },
};
