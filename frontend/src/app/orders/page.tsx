'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { BottomNav } from '@/components/layout/bottom-nav';
import { OrderCard } from '@/components/orders/order-card';
import { Button } from '@/components/ui/button';
import { ordersService } from '@/services/orders.service';
import { Order } from '@/types/order';

type TabType = 'active' | 'delivered' | 'all';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState<TabType>('active');

  useEffect(() => {
    async function loadOrders() {
      try {
        const list = await ordersService.getMyOrders();
        setOrders(list);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  // Filter orders by tab
  const activeOrders = orders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'CANCELLED');
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED');

  const displayedOrders =
    currentTab === 'active'
      ? activeOrders
      : currentTab === 'delivered'
      ? deliveredOrders
      : orders;

  return (
    <AppShell>
      <TopPromo />

      {/* Header: Title on Right, NO Back button */}
      <header className="sticky top-0 z-20 -mx-4 -mt-3.5 mb-2.5 flex items-center justify-between bg-white px-4 py-3 border-b border-[#eff2f0]/90">
        <h1 className="text-[20px] font-black text-sn-text tracking-tight">
          سفارش‌ها
        </h1>
      </header>

      {/* 3 Tabs: جاری, تحویل‌شده, همه */}
      <div className="bg-[#f1f4f2] rounded-[13px] p-1 grid grid-cols-3 gap-1 mb-4 select-none">
        <button
          type="button"
          onClick={() => setCurrentTab('active')}
          className={`py-2 text-[12px] font-bold rounded-[10px] transition-all cursor-pointer border-0 ${
            currentTab === 'active'
              ? 'bg-white text-sn-green shadow-sm'
              : 'bg-transparent text-[#6b7b73] hover:text-sn-text'
          }`}
        >
          جاری
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('delivered')}
          className={`py-2 text-[12px] font-bold rounded-[10px] transition-all cursor-pointer border-0 ${
            currentTab === 'delivered'
              ? 'bg-white text-sn-green shadow-sm'
              : 'bg-transparent text-[#6b7b73] hover:text-sn-text'
          }`}
        >
          تحویل‌شده
        </button>

        <button
          type="button"
          onClick={() => setCurrentTab('all')}
          className={`py-2 text-[12px] font-bold rounded-[10px] transition-all cursor-pointer border-0 ${
            currentTab === 'all'
              ? 'bg-white text-sn-green shadow-sm'
              : 'bg-transparent text-[#6b7b73] hover:text-sn-text'
          }`}
        >
          همه
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center text-sn-muted text-xs">
          در حال بارگذاری لیست سفارش‌ها...
        </div>
      ) : displayedOrders.length > 0 ? (
        <section className="flex flex-col gap-3 mb-6">
          {displayedOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-[16px] border border-sn-line/60 my-4 shadow-sm">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f4f8f5] text-sn-muted text-2xl mb-3">
            📦
          </span>
          <p className="text-[13px] font-bold text-sn-text">
            {currentTab === 'active'
              ? 'سفارش جاری ندارید'
              : currentTab === 'delivered'
              ? 'سفارش تحویل‌شده‌ای ندارید'
              : 'هیچ سفارشی ثبت نشده است'}
          </p>
          <p className="text-[10.5px] text-sn-muted mt-1 max-w-[240px]">
            {currentTab === 'active'
              ? 'سفارش‌های جدید شما پس از ثبت در این بخش نمایش داده می‌شوند.'
              : 'تاریخچه سفارش‌های شما در اینجا قرار می‌گیرد.'}
          </p>
          <Link href="/products" className="mt-4">
            <Button variant="default" className="h-9 px-5 text-[11px] font-bold">
              مشاهده فروشگاه
            </Button>
          </Link>
        </div>
      )}

      <BottomNav />
    </AppShell>
  );
}
