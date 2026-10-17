import { apiClient } from '@/lib/api-client';
import { ReferralStats } from '@/types/referral';

export const referralService = {
  async getMyStats(): Promise<ReferralStats> {
    try {
      const data = await apiClient<any>('/referrals/me');
      if (data) {
        const friends = Array.isArray(data.invitedUsers)
          ? data.invitedUsers.map((u: any) => ({
              id: u.id,
              name: u.refereeName?.trim() || 'کاربر دعوت‌شده',
              avatarText: (u.refereeName?.trim() || 'ک')[0],
              purchasesCount:
                u.purchasesCount !== undefined
                  ? u.purchasesCount
                  : u.status === 'COMPLETED'
                  ? 1
                  : 0,
              totalRewardEarned: Number(u.rewardEarned || 0),
              joinedAt: u.joinedAt
                ? new Date(u.joinedAt).toLocaleDateString('fa-IR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '',
            }))
          : [];

        const code = data.code || '';
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://sodaneh.ir';
        const shareUrl = code ? `${origin}/?ref=${code}` : '';

        return {
          code,
          shareUrl,
          clickCount: Number(data.clickCount || 0),
          successfulReferrals: Number(data.successfulReferrals || 0),
          totalEarned: Number(data.totalEarned || 0),
          friends,
        };
      }
    } catch {
      // Fallback
    }

    return {
      code: '',
      shareUrl: '',
      clickCount: 0,
      successfulReferrals: 0,
      totalEarned: 0,
      friends: [],
    };
  },

  async bindReferral(code: string): Promise<{ success: boolean; message: string }> {
    try {
      const res = await apiClient<any>('/referrals/bind', {
        method: 'POST',
        body: JSON.stringify({ code }),
      });
      return { success: true, message: res?.message || 'کد معرف با موفقیت اعمال شد' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'کد معرف نامعتبر است' };
    }
  },
};
