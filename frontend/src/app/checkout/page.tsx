'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { TopHeader } from '@/components/layout/top-header';
import { DeliveryMethodPicker } from '@/components/checkout/delivery-method-picker';
import { WalletRewardToggle } from '@/components/checkout/wallet-reward-toggle';
import {
  PaymentMethodPicker,
  PaymentMethodType,
} from '@/components/checkout/payment-method-picker';
import { AddressSelectorSheet } from '@/components/shared/address-selector-sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { ordersService } from '@/services/orders.service';
import { addressesService } from '@/services/addresses.service';
import { walletService } from '@/services/wallet.service';
import { formatMoney } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { Address } from '@/types/user';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();

  const [address, setAddress] = useState('');
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const [shippingCost, setShippingCost] = useState(20000);
  const [useReward, setUseReward] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('online');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initCheckout() {
      // Load real user addresses
      const addrList = await addressesService.getAddresses();
      setUserAddresses(addrList);
      if (addrList.length > 0) {
        const stored = storage.getSelectedAddress();
        const found = addrList.find((a) => a.street === stored);
        if (found) {
          setAddress(found.street);
        } else {
          const def = addrList.find((a) => a.isDefaultShipping) || addrList[0];
          setAddress(def.street);
          storage.setSelectedAddress(def.street);
        }
      } else {
        setAddress('');
      }

      // Load real wallet balance
      const wb = await walletService.getBalance();
      setWalletBalance(wb.balance);
    }
    initCheckout();
  }, []);

  const totalBeforeReward = subtotal + shippingCost;
  const rewardDiscount = useReward ? Math.min(walletBalance, totalBeforeReward) : 0;
  const grandTotal = Math.max(0, totalBeforeReward - rewardDiscount);

  const handlePlaceOrder = async () => {
    if (!address) {
      toast.error('لطفاً ابتدا آدرس تحویل سفارش را ثبت یا انتخاب کنید.');
      setIsAddressSheetOpen(true);
      return;
    }

    if (items.length === 0) {
      toast.error('سبد خرید شما خالی است.');
      return;
    }

    setIsSubmitting(true);
    try {
      const customerName =
        `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'مشتری';
      const customerPhone = user?.phone || '09121234567';

      const order = await ordersService.createOrder({
        customerName,
        customerPhone,
        shippingAddress: {
          recipientName: customerName,
          phone: customerPhone,
          street: address,
          city: 'تهران',
          province: 'تهران',
          postalCode: '1111111111',
        },
        shippingAmount: shippingCost,
        shippingMethod: shippingCost === 20000 ? 'ارسال عادی' : 'ارسال سریع',
        paymentMethod: grandTotal === 0 ? 'WALLET' : (paymentMethod === 'online' ? 'ONLINE' : 'CARD_TO_CARD'),
        useWalletBalance: useReward,
        walletAmountToUse: rewardDiscount,
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
          unitPrice: i.product.price ?? 0,
        })),
      });

      clearCart();
      toast.success(`سفارش شماره ${order.orderNumber} با موفقیت ثبت شد!`);
      router.push('/orders');
    } catch {
      toast.error('خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectAddress = (newAddr: string) => {
    setAddress(newAddr);
    storage.setSelectedAddress(newAddr);
  };

  return (
    <AppShell hasBottomNav={false} className="pb-[95px]">
      <TopPromo />

      <TopHeader title="تکمیل سفارش" backHref="/cart" />

      {/* Delivery Address Section */}
      <section>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[13px] font-bold text-sn-text">آدرس تحویل</h2>
          <span className="text-[10px] text-[#8e9d95]">انتخاب آدرس</span>
        </div>

        <button
          type="button"
          onClick={() => setIsAddressSheetOpen(true)}
          className="w-full flex items-start justify-between p-3 rounded-[10px] border border-[#9fd0b5] bg-[#fbfefc] text-right cursor-pointer"
        >
          <div>
            <b className="block text-[11px] font-bold text-sn-text">
              {address ? 'آدرس تحویل' : 'آدرسی انتخاب نشده'}
            </b>
            <p className="mt-1 text-[9.5px] text-sn-muted line-clamp-1">
              {address || 'برای انتخاب یا افزودن نشانی کلیک کنید'}
            </p>
          </div>
          <span className="text-[10px] font-bold text-sn-green mr-2">
            {address ? 'تغییر' : 'انتخاب'}
          </span>
        </button>
      </section>

      {/* Delivery Method Picker */}
      <DeliveryMethodPicker
        selectedCost={shippingCost}
        onSelect={(cost) => setShippingCost(cost)}
      />

      {/* Wallet Reward Toggle */}
      {walletBalance > 0 && (
        <WalletRewardToggle
          useReward={useReward}
          onToggle={(checked) => setUseReward(checked)}
          availableBalance={walletBalance}
          deductAmount={rewardDiscount}
          isFullyCovered={grandTotal === 0}
        />
      )}

      {/* Payment Method Picker */}
      {grandTotal > 0 ? (
        <PaymentMethodPicker
          selectedMethod={paymentMethod}
          onSelect={(m) => setPaymentMethod(m)}
        />
      ) : (
        <section className="mt-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-[13px] font-bold text-sn-text">روش پرداخت</h2>
            <span className="text-[10px] text-sn-green font-bold">تسویه با پاداش</span>
          </div>
          <div className="p-3.5 rounded-[12px] border border-[#a4d7ba] bg-[#f0f8f3] flex items-center gap-2.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sn-green text-white text-[11px] font-black shrink-0">
              ✓
            </span>
            <p className="text-[11px] font-medium text-[#1c3e2d] leading-relaxed">
              هزینه سفارش به‌طور کامل با کیف پول پاداش تسویه شد و نیازی به پرداخت نقدی نیست.
            </p>
          </div>
        </section>
      )}

      {/* Order Summary */}
      <section className="mt-5 p-3.5 rounded-[11px] border border-sn-line bg-white">
        <h2 className="text-[12px] font-bold text-sn-text mb-2.5">خلاصه سفارش</h2>
        <div className="flex flex-col gap-2 text-[10px]">
          <div className="flex justify-between text-[#77867e]">
            <span>مبلغ کالاها</span>
            <b className="text-sn-text">{formatMoney(subtotal)}</b>
          </div>

          <div className="flex justify-between text-[#77867e]">
            <span>هزینه ارسال</span>
            <b className="text-sn-text">
              {shippingCost === 0 ? 'رایگان' : formatMoney(shippingCost)}
            </b>
          </div>

          {useReward && rewardDiscount > 0 && (
            <div className="flex justify-between text-sn-green font-bold">
              <span>استفاده از پاداش</span>
              <b>− {formatMoney(rewardDiscount)}</b>
            </div>
          )}

          <div className="flex justify-between pt-2 border-t border-[#edf0ee] text-sn-text text-[11px] font-black">
            <span>مبلغ قابل پرداخت</span>
            <b className="text-sn-green text-[13px]">
              {grandTotal === 0 ? '۰ تومان' : formatMoney(grandTotal)}
            </b>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Place Order Action Bar */}
      <footer className="fixed bottom-0 right-1/2 translate-x-1/2 z-40 w-full max-w-app flex items-center justify-between gap-3 p-3.5 pb-[max(12px,env(safe-area-inset-bottom))] bg-white/95 backdrop-blur-[12px] border-t border-sn-line shadow-[0_-4px_16px_rgba(23,51,38,0.08)]">
        <div className="shrink-0 text-right">
          <small className="block text-[9.5px] text-[#8e9d95] font-normal leading-none mb-1">
            مبلغ قابل پرداخت
          </small>
          <strong className="block text-[15px] font-black text-sn-green leading-tight">
            {grandTotal === 0 ? '۰ تومان' : formatMoney(grandTotal)}
          </strong>
        </div>

        <Button
          onClick={handlePlaceOrder}
          disabled={isSubmitting || items.length === 0}
          className="flex-1 h-[48px] rounded-[10px] bg-sn-green hover:bg-[#116949] text-white font-bold text-[13px] shadow-none"
        >
          {isSubmitting
            ? 'در حال ثبت سفارش...'
            : grandTotal === 0
            ? 'ثبت سفارش (پرداخت با پاداش)'
            : `پرداخت ${formatMoney(grandTotal)}`}
        </Button>
      </footer>

      {/* Address Selector Bottom Sheet */}
      <AddressSelectorSheet
        isOpen={isAddressSheetOpen}
        onClose={() => setIsAddressSheetOpen(false)}
        selectedAddress={address}
        onSelectAddress={handleSelectAddress}
        addresses={userAddresses}
      />
    </AppShell>
  );
}
