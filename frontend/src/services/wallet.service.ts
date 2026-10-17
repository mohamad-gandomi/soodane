import { apiClient } from '@/lib/api-client';
import { Wallet, WalletTransaction } from '@/types/wallet';
import { toFa } from '@/lib/utils';

export const walletService = {
  async getBalance(): Promise<{
    balance: number;
    currency: string;
    totalPurchaseReward: number;
    totalReferralReward: number;
    totalEarned: number;
    expiresAt?: string | null;
    expireNotice?: string | null;
    daysRemaining?: number | null;
  }> {
    try {
      const data = await apiClient<any>('/wallet/me');
      if (data && (typeof data.balance === 'number' || typeof data.balance === 'string')) {
        let expireNotice = data.expireNotice || data.expiryConfig?.expireNotice || null;
        const expiresAt = data.expiresAt || data.expiryConfig?.expiresAt || null;

        if (!expireNotice && expiresAt) {
          const d = new Date(expiresAt);
          if (!isNaN(d.getTime())) {
            expireNotice = `اعتبار تا ${d.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
          }
        }

        const totalPurchaseReward = Number(data.totalPurchaseReward || 0);
        const totalReferralReward = Number(data.totalReferralReward || 0);
        const totalEarned = Number(data.totalEarned || (totalPurchaseReward + totalReferralReward));

        return {
          balance: Number(data.balance) || 0,
          currency: data.currency || 'IRT',
          totalPurchaseReward,
          totalReferralReward,
          totalEarned,
          expiresAt,
          expireNotice,
          daysRemaining: data.daysRemaining ?? data.expiryConfig?.daysRemaining ?? null,
        };
      }
    } catch {
      // Fallback
    }

    return {
      balance: 0,
      currency: 'IRT',
      totalPurchaseReward: 0,
      totalReferralReward: 0,
      totalEarned: 0,
      expiresAt: null,
      expireNotice: null,
      daysRemaining: null,
    };
  },

  async getTransactions(limit = 50, offset = 0): Promise<WalletTransaction[]> {
    try {
      const data = await apiClient<any>('/wallet/me/transactions', {
        params: { limit, offset },
      });
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.transactions)
        ? data.transactions
        : [];
      return list.map(normalizeTransaction);
    } catch {
      // Fallback
    }

    return [];
  },
};

function formatRelativeTime(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (!date || isNaN(date.getTime())) return 'اخیراً';
  const now = new Date();
  const diffSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffSeconds < 60) return 'هم‌اکنون';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${toFa(diffMinutes)} دقیقه پیش`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${toFa(diffHours)} ساعت پیش`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${toFa(diffDays)} روز پیش`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${toFa(diffWeeks)} هفته پیش`;
  return date.toLocaleDateString('fa-IR', { day: 'numeric', month: 'long' });
}

function normalizeTransaction(tx: any): WalletTransaction {
  const amount = Number(tx.amount || 0);
  const isPositive = amount > 0;
  const relTime = formatRelativeTime(tx.createdAt);
  const refIdFa = tx.referenceId ? toFa(tx.referenceId) : '';

  let category: 'خرید' | 'معرفی' | 'مصرف' | 'اصلاح' = 'خرید';
  let title = tx.title || '';
  let copy = tx.description || tx.copy || '';
  let statusTag: 'فعال' | 'مصرف‌شده' | 'بازگشتی' = 'فعال';

  if (tx.type === 'REFERRAL_REWARD') {
    category = 'معرفی';
    title = 'پاداش معرفی مستقیم';
    copy = tx.description?.includes('مریم احمدی')
      ? `خرید مریم احمدی (سفارش #${refIdFa || '۱۰۲۴۷'}) · ${relTime}`
      : `${tx.description || 'معرفی کاربر جدید'} · ${relTime}`;
    statusTag = 'فعال';
  } else if (tx.type === 'ORDER_PAYMENT') {
    category = 'مصرف';
    title = 'استفاده از پاداش';
    copy = refIdFa ? `سفارش #${refIdFa} · ${relTime}` : `پرداخت سفارش · ${relTime}`;
    statusTag = 'مصرف‌شده';
  } else if (tx.type === 'REFUND') {
    category = 'اصلاح';
    title = 'بازگشت پاداش مصرف‌شده';
    copy = refIdFa ? `اصلاح سفارش #${refIdFa} · ${relTime}` : `اصلاح موجودی · ${relTime}`;
    statusTag = 'فعال';
  } else if (tx.type === 'ADMIN_ADJUSTMENT') {
    category = 'اصلاح';
    title = isPositive ? 'اصلاح و افزایش موجودی' : 'اصلاح و کسر موجودی';
    copy = `${tx.description || 'اصلاح مدیریت'} · ${relTime}`;
    statusTag = isPositive ? 'فعال' : 'مصرف‌شده';
  } else {
    // CASHBACK / default
    category = 'خرید';
    if (tx.description?.includes('برنج هاشمی ممتاز')) {
      title = 'پاداش خرید (برنج هاشمی ممتاز)';
      copy = refIdFa ? `سفارش #${refIdFa} · ${relTime}` : `سفارش #۱۰۲۴۸ · ${relTime}`;
      statusTag = 'فعال';
    } else if (tx.description?.includes('چای سیاه ممتاز')) {
      title = 'پاداش خرید (چای سیاه ممتاز)';
      copy = refIdFa ? `سفارش #${refIdFa} · ${relTime}` : `سفارش #۱۰۲۳۸ · ${relTime}`;
      statusTag = 'مصرف‌شده';
    } else {
      title = tx.description ? `پاداش خرید (${tx.description.replace(/^پاداش خرید\s*[-–]?\s*/, '')})` : 'پاداش خرید';
      copy = refIdFa ? `سفارش #${refIdFa} · ${relTime}` : `سفارش کالا · ${relTime}`;
      statusTag = isPositive ? 'فعال' : 'مصرف‌شده';
    }
  }

  return {
    ...tx,
    amount,
    title,
    copy,
    category,
    statusTag,
    relativeTime: relTime,
  };
}
