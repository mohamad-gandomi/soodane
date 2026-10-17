'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { EmptyState } from '@/components/shared/empty-state';
import { notificationsService } from '@/services/notifications.service';
import { AppNotification } from '@/types/notification';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const list = await notificationsService.getNotifications();
      setNotifications(list);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.success('همه اعلان‌ها به‌عنوان خوانده‌شده علامت‌گذاری شدند');
    } catch {
      toast.error('خطا در به‌روزرسانی اعلان‌ها');
    }
  };

  const handleCardClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      try {
        await notificationsService.markAsRead(notif.id);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
        );
      } catch {
        // silent
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppShell hasBottomNav={false}>
      <TopPromo />

      {/* Header matching Image 1: Back on right, title centered */}
      <header className="sticky top-0 z-30 flex h-[52px] items-center justify-between border-b border-sn-line/50 bg-[#fbfdfc]/95 px-4 backdrop-blur-md">
        <Link
          href="/account"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 active:scale-95 transition-all shadow-none"
          aria-label="بازگشت"
        >
          <svg
            className="w-4 h-4 text-[#506459]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>

        <h1 className="text-[15px] font-black text-sn-text">اعلان‌ها</h1>

        <button
          type="button"
          onClick={loadData}
          disabled={isLoading}
          aria-label="به‌روزرسانی اعلان‌ها"
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
        >
          <svg
            className={`w-4 h-4 text-[#506459] ${isLoading ? 'animate-spin' : ''}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </svg>
        </button>
      </header>

      <main className="px-3.5 pt-3 pb-16">
        {isLoading ? (
          <div className="flex flex-col gap-2.5 mt-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-[14px] bg-white border border-[#e2e9e5] animate-pulse p-3.5"
              />
            ))}
          </div>
        ) : notifications.length > 0 ? (
          <div>
            {/* Action link 'خواندن همه' placed on right (start of line) matching Image 1 */}
            <div className="flex justify-start mb-2 px-0.5">
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={unreadCount === 0}
                className={`text-[11px] font-bold bg-transparent border-0 cursor-pointer transition-colors p-0 ${
                  unreadCount > 0
                    ? 'text-sn-green hover:underline'
                    : 'text-sn-muted cursor-default'
                }`}
              >
                خواندن همه
              </button>
            </div>

            {/* Notifications List matching Image 1 */}
            <div className="flex flex-col gap-2.5">
              {notifications.map((n) => (
                <article
                  key={n.id}
                  onClick={() => handleCardClick(n)}
                  className={`p-3.5 rounded-[14px] border border-[#e2e9e5] bg-white transition-all shadow-[0_1px_3px_rgba(0,0,0,0.02)] cursor-pointer hover:border-sn-green/30 ${
                    !n.isRead ? 'border-[#cce8d7]' : ''
                  }`}
                >
                  {/* Top row: Title + Green unread dot on Right, Date on Left */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <b className="text-[12px] font-black text-sn-text truncate leading-tight">
                        {n.title}
                      </b>
                      {!n.isRead && (
                        <span
                          className="h-2 w-2 rounded-full bg-sn-green shrink-0 inline-block"
                          aria-label="خوانده‌نشده"
                        />
                      )}
                    </div>

                    <span className="text-[10px] text-[#93a099] font-medium shrink-0 font-sans">
                      {n.createdAt}
                    </span>
                  </div>

                  {/* Message row */}
                  <p className="mt-1.5 text-[10px] text-[#6e7d74] leading-relaxed text-right">
                    {n.message}
                  </p>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState message="هیچ اعلانی وجود ندارد." icon="🔔" />
        )}
      </main>
    </AppShell>
  );
}
