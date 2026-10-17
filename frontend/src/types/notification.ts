export interface AppNotification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  type?: 'ORDER' | 'WALLET' | 'SYSTEM' | 'REFERRAL';
  createdAt: string;
  link?: string | null;
}
