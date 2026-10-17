'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { BottomNav } from '@/components/layout/bottom-nav';
import { HomeHeader } from '@/components/home/home-header';
import { PromoSlider } from '@/components/home/promo-slider';
import { CategoryGrid } from '@/components/home/category-grid';
import { SpecialDealsPreview } from '@/components/home/special-deals-preview';
import { RecommendedProducts } from '@/components/home/recommended-products';
import { WalletBanner } from '@/components/shared/wallet-banner';
import { ReferralInviteCard } from '@/components/shared/referral-invite-card';
import { AddressSelectorSheet } from '@/components/shared/address-selector-sheet';
import { productsService } from '@/services/products.service';
import { walletService } from '@/services/wallet.service';
import { referralService } from '@/services/referral.service';
import { flashDealsService } from '@/services/flash-deals.service';
import { addressesService } from '@/services/addresses.service';
import { Product } from '@/types/product';
import { FlashDeal } from '@/types/flash-deal';
import { Address } from '@/types/user';
import { storage } from '@/lib/storage';

export default function HomePage() {
  const [address, setAddress] = useState('');
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeDeal, setActiveDeal] = useState<FlashDeal | null>(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletExpireNotice, setWalletExpireNotice] = useState<string | undefined>();
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    async function loadData() {
      // 1. Load real addresses
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
        storage.setSelectedAddress('');
      }

      // 2. Load products
      const items = await productsService.getProducts();
      setProducts(items);

      // 3. Load active flash deal (null if expired or none)
      const deal = await flashDealsService.getActiveDeal();
      setActiveDeal(deal);

      // 4. Load wallet balance & expiry notice
      const wallet = await walletService.getBalance();
      setWalletBalance(wallet.balance);
      if (wallet.expireNotice) {
        setWalletExpireNotice(wallet.expireNotice);
      }

      // 5. Load referral stats
      const refStats = await referralService.getMyStats();
      if (refStats?.code) {
        setReferralCode(refStats.code);
      }
    }

    loadData();
  }, []);

  const handleSelectAddress = (newAddr: string) => {
    setAddress(newAddr);
    storage.setSelectedAddress(newAddr);
  };

  return (
    <AppShell>
      <TopPromo />

      {/* 1. Sticky Header with Interactive Live Search */}
      <HomeHeader
        currentAddress={address}
        onOpenAddressSheet={() => setIsAddressSheetOpen(true)}
      />

      {/* 2. Banner with Touch Swipe & Desktop Mouse Drag */}
      <PromoSlider />

      {/* 3. Wallet Reward Balance Banner */}
      <WalletBanner balance={walletBalance} expireNotice={walletExpireNotice} />

      {/* 4. Categories fetched from backend with image support */}
      <CategoryGrid />

      {/* 5. Special Deals (تخفیف شگفت‌انگیز) - Render ONLY when an active flash deal exists! */}
      {activeDeal && activeDeal.items && activeDeal.items.length > 0 && (
        <SpecialDealsPreview deal={activeDeal} />
      )}

      {/* 6. Referral Invite (دوستانت را دعوت کن) */}
      {referralCode ? (
        <ReferralInviteCard
          code={referralCode}
          shareUrl={
            typeof window !== 'undefined'
              ? `${window.location.origin}/?ref=${referralCode}`
              : `https://sodaneh.ir/?ref=${referralCode}`
          }
        />
      ) : null}

      {/* 7. Recommended Products (پیشنهاد برای شما) with vertical card list */}
      {products.length > 0 && (
        <RecommendedProducts products={products.slice(0, 4)} />
      )}

      {/* 8. Bottom Navigation */}
      <BottomNav />

      {/* Delivery Address Selector Sheet */}
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
