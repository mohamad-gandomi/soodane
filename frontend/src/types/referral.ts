export interface ReferralFriend {
  id: string;
  name: string;
  avatarText?: string;
  purchasesCount: number;
  totalRewardEarned: number;
  joinedAt: string;
}

export interface ReferralStats {
  code: string;
  shareUrl: string;
  clickCount: number;
  successfulReferrals: number;
  totalEarned: number;
  friends?: ReferralFriend[];
}
