'use client';

import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface ReferralInviteCardProps {
  code?: string;
  shareUrl?: string;
  title?: string;
  description?: string;
}

export function ReferralInviteCard({
  code = '',
  shareUrl = '',
  title = 'دوستانت را دعوت کن',
  description = 'با خرید مستقیم دوستانت، پاداش معرفی بگیر.',
}: ReferralInviteCardProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!code) return null;

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(true);
    toast.success('کد معرف کپی شد');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(shareUrl);
    setCopiedLink(true);
    toast.success('لینک دعوت کپی شد');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'دعوت به سودانه',
        text: 'با کد معرف من در سودانه ثبت‌نام کن و با خرید کالا پاداش نقدی بگیر:',
        url: shareUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <section className="my-5 p-4 rounded-[16px] border border-[#dcece3] bg-gradient-to-br from-[#f8fcf9] to-[#edf8f2] relative overflow-hidden shadow-sm">
      {/* Decorative background shape */}
      <span
        aria-hidden="true"
        className="absolute -right-6 -top-10 w-28 h-28 rounded-full border-[18px] border-sn-green/5 pointer-events-none"
      />

      {/* Top Header: User Icon on Right, Title + Subtitle to its left */}
      <div className="flex items-center gap-3 relative z-10 mb-3">
        <div className="w-10 h-10 rounded-[12px] bg-[#e7f5ed] flex items-center justify-center text-sn-green shrink-0 shadow-none border border-sn-green/10">
          <UserPlus size={20} className="stroke-[2.2]" />
        </div>

        <div>
          <b className="block text-[14px] font-black text-sn-text">{title}</b>
          <p className="mt-1 text-[10.5px] text-[#6b7b73]">{description}</p>
        </div>
      </div>

      {/* Middle White Box: Invite Code + Copy */}
      <div className="relative z-10 bg-white rounded-[10px] p-2.5 flex items-center justify-between border border-sn-line/50 shadow-none mb-3">
        <span className="text-[10px] text-sn-muted font-medium">کد دعوت شما</span>

        <span className="font-en text-[14px] font-black text-sn-green tracking-widest">
          {code}
        </span>

        <button
          type="button"
          onClick={handleCopyCode}
          className="rounded-[6px] bg-[rgba(23,129,90,0.09)] text-sn-green text-[10px] font-bold px-3 py-1 hover:bg-[rgba(23,129,90,0.18)] active:scale-95 transition-all cursor-pointer border-0"
        >
          {copiedCode ? 'کپی شد ✓' : 'کپی'}
        </button>
      </div>

      {/* Bottom Action Row: Copy Link on left, Share Link on right */}
      <div className="relative z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className="flex-1 h-10 rounded-[10px] bg-sn-green text-white text-[11px] font-bold hover:bg-sn-deep active:scale-95 transition-all flex items-center justify-center cursor-pointer border-0 shadow-sm shadow-sn-green/20"
        >
          اشتراک‌گذاری لینک
        </button>

        <button
          type="button"
          onClick={handleCopyLink}
          className="h-10 px-4 rounded-[10px] bg-[#eaf4ee] text-sn-green text-[11px] font-bold hover:bg-[#dbeee1] active:scale-95 transition-all cursor-pointer border-0"
        >
          {copiedLink ? 'کپی شد ✓' : 'کپی لینک'}
        </button>
      </div>
    </section>
  );
}
