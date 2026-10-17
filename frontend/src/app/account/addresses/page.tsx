'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { TopHeader } from '@/components/layout/top-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sheet } from '@/components/ui/sheet';
import { Icon } from '@/components/ui/icon';
import { addressesService } from '@/services/addresses.service';
import { useAuth } from '@/context/auth-context';
import { Address } from '@/types/user';
import { toast } from 'sonner';

export default function AddressesPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);

  // Form fields
  const [title, setTitle] = useState('خانه');
  const [recipientName, setRecipientName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('تهران');
  const [city, setCity] = useState('تهران');
  const [street, setStreet] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await addressesService.getAddresses();
        setAddresses(list);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
      setRecipientName(fullName || 'مشتری');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSetDefault = async (id: string) => {
    try {
      await addressesService.setDefaultAddress(id);
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefaultShipping: a.id === id }))
      );
      toast.success('آدرس پیش‌فرض تغییر کرد');
    } catch {
      toast.error('خطا در تغییر آدرس پیش‌فرض');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await addressesService.deleteAddress(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.info('آدرس حذف شد');
    } catch {
      toast.error('خطا در حذف آدرس');
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!street.trim()) {
      toast.error('لطفاً نشانی دقیق را وارد کنید');
      return;
    }

    setSubmitting(true);
    try {
      const newAddr = await addressesService.addAddress({
        title: title.trim() || 'خانه',
        street: street.trim(),
        city: city.trim() || 'تهران',
        province: province.trim() || 'تهران',
        phone: phone.trim() || user?.phone || '',
        recipientName: recipientName.trim() || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'تحویل‌گیرنده',
        postalCode: postalCode.trim() || undefined,
        isDefaultShipping: isDefault || addresses.length === 0,
      });

      if (newAddr?.id) {
        setAddresses((prev) => [newAddr, ...prev]);
        setIsAddSheetOpen(false);
        setStreet('');
        setPostalCode('');
        toast.success('آدرس جدید با موفقیت ثبت شد');
      }
    } catch {
      toast.error('خطا در ثبت آدرس');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell hasBottomNav={false}>
      <TopPromo />

      <TopHeader title="آدرس‌ها" backHref="/account" />

      {loading ? (
        <div className="py-20 text-center text-xs text-sn-muted">
          در حال بارگذاری آدرس‌ها...
        </div>
      ) : addresses.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-[14px] border border-sn-line my-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef6f1] text-sn-green mb-3">
            <Icon name="pin" size={28} />
          </div>
          <h2 className="text-[14px] font-bold text-sn-text">
            هنوز هیچ آدرسی ثبت نکرده‌اید
          </h2>
          <p className="text-[11px] text-sn-muted mt-1.5 leading-[1.8] max-w-[240px]">
            برای ارسال سفارشات، لطفاً اولین آدرس خود را اضافه کنید.
          </p>
          <Button
            variant="default"
            onClick={() => setIsAddSheetOpen(true)}
            className="mt-5 h-10 px-6 text-[11px] font-bold"
          >
            + افزودن اولین آدرس
          </Button>
        </div>
      ) : (
        <>
          {/* Address cards list */}
          <div className="flex flex-col gap-3">
            {addresses.map((a) => (
              <article
                key={a.id}
                className="p-3.5 rounded-[12px] border border-sn-line bg-white shadow-none"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-[6px] bg-[#eef6f1] text-sn-green text-xs shrink-0">
                    <Icon name="pin" size={14} />
                  </span>
                  <b className="flex-1 text-[11.5px] font-bold text-sn-text">
                    {a.title}
                  </b>
                  {a.isDefaultShipping && <Badge variant="default">پیش‌فرض</Badge>}
                </div>

                <p className="mt-2.5 text-[10px] text-sn-muted leading-[1.9]">
                  {a.street}
                </p>

                {(a.recipientName || a.phone) && (
                  <p className="mt-1 text-[9px] text-[#7f8e87]">
                    تحویل‌گیرنده: {a.recipientName} {a.phone ? `· ${a.phone}` : ''}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-2 pt-2 border-t border-[#edf0ee]">
                  {!a.isDefaultShipping && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(a.id)}
                      className="rounded-[6px] bg-[rgba(23,129,90,0.09)] px-2.5 py-1 text-[9px] font-bold text-sn-green hover:bg-[rgba(23,129,90,0.18)] cursor-pointer"
                    >
                      پیش‌فرض کردن
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    className="rounded-[6px] bg-[rgba(189,90,90,0.09)] px-2.5 py-1 text-[9px] font-bold text-sn-danger hover:bg-[rgba(189,90,90,0.18)] cursor-pointer mr-auto"
                  >
                    حذف
                  </button>
                </div>
              </article>
            ))}
          </div>

          <Button
            variant="default"
            onClick={() => setIsAddSheetOpen(true)}
            className="w-full mt-4 h-11 text-[11px] font-black"
          >
            + افزودن آدرس جدید
          </Button>
        </>
      )}

      {/* Add Address Bottom Sheet */}
      <Sheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        title="افزودن آدرس جدید"
      >
        <form onSubmit={handleAddAddress} className="flex flex-col gap-3 pt-1">
          <div>
            <label className="block text-[10.5px] font-bold text-[#465c51] mb-1.5">
              عنوان آدرس (مثال: خانه، شرکت)
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="خانه"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10.5px] font-bold text-[#465c51] mb-1.5">
                نام تحویل‌گیرنده
              </label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="نام و نام خانوادگی"
                required
              />
            </div>
            <div>
              <label className="block text-[10.5px] font-bold text-[#465c51] mb-1.5">
                شماره تماس
              </label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۲..."
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-[#465c51] mb-1.5">
              نشانی دقیق پستی
            </label>
            <Input
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="تهران، خیابان، کوچه، پلاک، واحد"
              required
            />
          </div>

          <div>
            <label className="block text-[10.5px] font-bold text-[#465c51] mb-1.5">
              کد پستی (اختیاری)
            </label>
            <Input
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="۱۰ رقم کد پستی"
            />
          </div>

          <label className="flex items-center gap-2 mt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="accent-sn-green rounded"
            />
            <span className="text-[10px] text-sn-text font-medium">
              انتخاب به‌عنوان آدرس پیش‌فرض
            </span>
          </label>

          <Button
            type="submit"
            disabled={submitting}
            className="h-11 text-[11px] font-bold mt-2"
          >
            {submitting ? 'در حال ثبت...' : 'ثبت آدرس'}
          </Button>
        </form>
      </Sheet>
    </AppShell>
  );
}
