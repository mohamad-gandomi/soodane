'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/icon';
import { ChevronDown } from 'lucide-react';
import { toFa, formatMoney } from '@/lib/utils';
import { useCart } from '@/context/cart-context';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/product';

interface HomeHeaderProps {
  currentAddress: string;
  onOpenAddressSheet: () => void;
}

export function HomeHeader({
  currentAddress,
  onOpenAddressSheet,
}: HomeHeaderProps) {
  const router = useRouter();
  const { totalCount } = useCart();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search effect
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      const items = await productsService.getProducts({ search: trimmed });
      setResults(items.slice(0, 5));
      setIsOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className="sticky top-0 z-30 -mx-4 -mt-3.5 bg-white px-4 pt-3.5 pb-2.5 border-b border-sn-line/50 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
    >
      {/* Top bar: Address + Notifications + Cart */}
      <header className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={onOpenAddressSheet}
          className="flex items-center gap-2 text-right cursor-pointer bg-transparent border-0 p-0 hover:opacity-85 transition-opacity group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-sn-green shrink-0 animate-pulse" />
          <div className="flex flex-col text-right">
            <small className="block text-[9px] text-[#91a09a] leading-none">ارسال به</small>
            <div className="flex items-center gap-1 mt-0.5">
              <strong className="block text-[12px] font-extrabold text-sn-text truncate max-w-[170px]">
                {currentAddress || 'انتخاب یا ثبت آدرس'}
              </strong>
              <ChevronDown className="w-3.5 h-3.5 text-sn-muted stroke-[2.4] shrink-0 transition-transform group-hover:translate-y-0.5" />
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2">
          <Link
            href="/notifications"
            className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 transition-colors"
            aria-label="اعلان‌ها"
          >
            <Icon name="bell" size={18} />
          </Link>

          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-[9px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 transition-colors"
            aria-label="سبد خرید"
          >
            <Icon name="cart" size={18} />
            {totalCount > 0 && (
              <i className="absolute -top-1.5 -left-1.5 min-w-[16px] h-[16px] flex items-center justify-center px-1 rounded-full border-2 border-white bg-sn-green text-white text-[8px] font-black not-italic shadow-sm">
                {toFa(totalCount)}
              </i>
            )}
          </Link>
        </div>
      </header>

      {/* Interactive Search Bar Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex h-[46px] w-full items-center gap-2 rounded-[10px] border border-sn-line bg-[#fafcfb] px-3 focus-within:border-sn-green focus-within:bg-white focus-within:ring-2 focus-within:ring-sn-green/10 transition-all">
          <button
            type="submit"
            className="text-[#89978f] hover:text-sn-green transition-colors cursor-pointer border-0 bg-transparent p-0 flex items-center"
            aria-label="جستجو"
          >
            <Icon name="search" size={18} />
          </button>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="جستجو در سودانه (مثال: برنج، روغن، چای...)"
            className="w-full bg-transparent text-[11px] text-sn-text placeholder:text-[#a0aaa5] outline-none border-0"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
              }}
              className="text-xs text-[#a0aaa5] hover:text-sn-text p-1 border-0 bg-transparent cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isOpen && results.length > 0 && (
          <div className="absolute top-[52px] left-0 right-0 z-50 bg-white rounded-[12px] border border-sn-line shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="p-2 border-b border-[#edf0ee] bg-[#fafcfb] flex items-center justify-between text-[10px]">
              <span className="text-sn-muted font-medium">
                نتایج جستجو برای «{query}»
              </span>
              <span className="text-sn-green font-bold">
                {toFa(results.length)} نتیجه
              </span>
            </div>

            <div className="max-h-[260px] overflow-y-auto divide-y divide-[#f2f5f3]">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2.5 hover:bg-[#f6faf7] transition-colors"
                >
                  <div className="h-10 w-10 rounded-[8px] bg-[#f4f8f5] p-1 shrink-0 flex items-center justify-center overflow-hidden border border-sn-line/40">
                    <img
                      src={product.image || '/assets/products/rice.png'}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <b className="block text-[11px] font-bold text-sn-text truncate">
                      {product.name}
                    </b>
                    <small className="block text-[8.5px] text-sn-green font-bold mt-0.5">
                      پاداش خرید + {toFa(product.reward)} تومان
                    </small>
                  </div>

                  <strong className="text-[11px] font-black text-sn-text shrink-0">
                    {formatMoney(product.price)}
                  </strong>
                </Link>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full py-2.5 bg-[#edf8f2] text-sn-green text-[10.5px] font-extrabold hover:bg-[#e2f3e8] transition-colors text-center border-0 cursor-pointer block"
            >
              مشاهده همه نتایج در کاتالوگ ←
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
