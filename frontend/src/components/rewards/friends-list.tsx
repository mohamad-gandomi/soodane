import React from 'react';
import { ReferralFriend } from '@/types/referral';
import { toFa } from '@/lib/utils';

interface FriendsListProps {
  friends: ReferralFriend[];
}

export function FriendsList({ friends }: FriendsListProps) {
  return (
    <section className="mt-4 flex flex-col gap-2">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-[12.5px] font-black text-sn-text">
          دوستان دعوت‌شدهٔ مستقیم
        </h2>
        <span className="text-[10px] font-bold text-sn-muted">
          {toFa(friends.length)} نفر
        </span>
      </div>

      {friends.length > 0 ? (
        friends.map((friend) => (
          <article
            key={friend.id}
            className="flex items-center justify-between gap-3 p-3 rounded-[12px] border border-[#e5ebe7] bg-white transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e8f7ee] text-sn-green text-[13px] font-black shrink-0">
                {friend.avatarText || friend.name[0]}
              </span>

              <div className="min-w-0">
                <b className="block text-[11.5px] font-bold text-sn-text truncate leading-snug">
                  {friend.name}
                </b>
                <p className="mt-0.5 text-[9.5px] text-[#86958d] truncate leading-tight">
                  {friend.joinedAt ? `عضویت: ${friend.joinedAt} · ` : ''}
                  {toFa(friend.purchasesCount)} خرید واجد شرایط
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <span className="text-[12px] font-black text-sn-green">
                + {toFa(friend.totalRewardEarned)}{' '}
                <span className="text-[10px] font-normal">تومان</span>
              </span>
              <span className="text-[9px] text-[#86958d] mt-0.5">
                پاداش برای شما
              </span>
            </div>
          </article>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center p-6 text-center bg-white rounded-[12px] border border-sn-line my-2">
          <p className="text-[11.5px] font-bold text-sn-text">
            هنوز دوستی با کد شما ثبت‌نام نکرده است
          </p>
          <p className="text-[9.5px] text-sn-muted mt-1">
            لینک یا کد معرف خود را با دوستان به اشتراک بگذارید.
          </p>
        </div>
      )}

      {/* Info note matching Image 2 */}
      <div className="bg-[#f8faf9] border border-sn-line rounded-[10px] p-3 flex items-center gap-2 text-[#55695e] text-[9.5px] font-medium leading-relaxed my-2">
        <svg
          className="w-4 h-4 text-[#86958d] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
        <span>
          فقط دوستانی نمایش داده می‌شوند که مستقیماً با کد یا لینک دعوت شما ثبت‌نام کرده‌اند.
        </span>
      </div>
    </section>
  );
}
