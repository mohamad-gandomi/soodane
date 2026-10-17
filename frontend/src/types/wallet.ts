export type WalletTransactionType =
  | 'DEPOSIT'
  | 'ORDER_PAYMENT'
  | 'ORDER_PARTIAL_PAYMENT'
  | 'REFUND'
  | 'REFERRAL_REWARD'
  | 'CASHBACK'
  | 'ADMIN_ADJUSTMENT';

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number; // positive for credit, negative for debit
  balanceBefore: number;
  balanceAfter: number;
  type: WalletTransactionType;
  description?: string | null;
  referenceId?: string | null;
  createdAt: string;
  // UI helper fields:
  title?: string;
  copy?: string;
  category?: 'خرید' | 'معرفی' | 'مصرف' | 'اصلاح';
  statusTag?: 'فعال' | 'مصرف‌شده' | 'بازگشتی';
  relativeTime?: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  totalPurchaseReward?: number;
  totalReferralReward?: number;
  totalEarned?: number;
  expiresAt?: string | null;
  daysRemaining?: number | null;
  expireNotice?: string | null;
  expiryConfig?: {
    enabled: boolean;
    days: number;
    expiresAt: string | null;
    daysRemaining: number | null;
    expireNotice?: string | null;
  };
  transactions?: WalletTransaction[];
}
