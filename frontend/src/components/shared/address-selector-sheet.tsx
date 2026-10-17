'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sheet } from '@/components/ui/sheet';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';
import { addressesService } from '@/services/addresses.service';
import { Address } from '@/types/user';

interface AddressSelectorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddress: string;
  onSelectAddress: (addr: string) => void;
  addresses?: Address[];
}

export function AddressSelectorSheet({
  isOpen,
  onClose,
  selectedAddress,
  onSelectAddress,
  addresses: externalAddresses,
}: AddressSelectorSheetProps) {
  const [internalAddresses, setInternalAddresses] = useState<Address[]>([]);

  useEffect(() => {
    if (isOpen && !externalAddresses) {
      addressesService.getAddresses().then((res) => {
        setInternalAddresses(res || []);
      });
    }
  }, [isOpen, externalAddresses]);

  const list = externalAddresses !== undefined ? externalAddresses : internalAddresses;

  return (
    <Sheet isOpen={isOpen} onClose={onClose} title="انتخاب آدرس">
      <div className="flex flex-col gap-2 pt-1">
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#eef6f1] text-sn-green mb-2.5">
              <Icon name="pin" size={24} />
            </span>
            <b className="text-[12.5px] font-bold text-sn-text">
              هیچ آدرسی ثبت نشده است
            </b>
            <p className="mt-1 text-[10px] text-sn-muted leading-[1.8] max-w-[220px]">
              برای تحویل سفارشات، لطفاً آدرس محل سکونت یا کار خود را اضافه کنید.
            </p>
            <Link
              href="/account/addresses"
              onClick={onClose}
              className="mt-4 flex items-center justify-center rounded-[10px] bg-sn-green text-white px-5 h-[42px] text-[11px] font-bold hover:bg-sn-darkgreen transition-colors"
            >
              + افزودن آدرس جدید
            </Link>
          </div>
        ) : (
          <>
            {list.map((item) => {
              const fullText = item.street;
              const isSelected =
                selectedAddress === fullText ||
                selectedAddress === item.id ||
                (Boolean(selectedAddress) && fullText.includes(selectedAddress));

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectAddress(fullText);
                    onClose();
                  }}
                  className={cn(
                    'relative flex items-start gap-2.5 w-full p-3 rounded-[10px] border border-sn-line bg-white text-right transition-colors cursor-pointer',
                    isSelected && 'border-[#9fd0b5] bg-[#fbfefc]'
                  )}
                >
                  <div className="flex-1 pl-5">
                    <div className="flex items-center gap-1.5">
                      <b className="block text-[11px] font-bold text-sn-text">
                        {item.title || 'آدرس'}
                      </b>
                      {item.isDefaultShipping && (
                        <span className="text-[8px] bg-sn-pale text-sn-green px-1.5 py-0.5 rounded font-bold">
                          پیش‌فرض
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[9.5px] text-sn-muted leading-[1.8] line-clamp-1">
                      {item.street}
                    </p>
                  </div>

                  {/* Radio circle indicator */}
                  <div className="relative mt-0.5 h-[18px] w-[18px] rounded-full border border-[#b7c9bf] flex items-center justify-center shrink-0">
                    {isSelected && (
                      <span className="h-2.5 w-2.5 rounded-full bg-sn-green" />
                    )}
                  </div>
                </button>
              );
            })}

            <Link
              href="/account/addresses"
              onClick={onClose}
              className="mt-3 flex items-center justify-center rounded-[10px] bg-[rgba(23,129,90,0.09)] h-[44px] text-[11px] font-bold text-sn-green hover:bg-[rgba(23,129,90,0.18)] transition-colors"
            >
              مدیریت آدرس‌ها
            </Link>
          </>
        )}
      </div>
    </Sheet>
  );
}
