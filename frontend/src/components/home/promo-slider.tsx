'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { cn, toFa } from '@/lib/utils';

interface Slide {
  tone: 'sale' | 'rice' | 'reward';
  href: string;
  badge: string;
  title: string;
  text: string;
  image?: string | null;
}

interface PromoSliderProps {
  catalogMode?: boolean;
}

export function PromoSlider({ catalogMode = false }: PromoSliderProps) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const dragStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimer = useRef<NodeJS.Timeout | null>(null);

  const slides: Slide[] = catalogMode
    ? [
        {
          tone: 'sale',
          href: '/special',
          badge: 'فروش ویژه امروز',
          title: 'تا ۳۰٪ تخفیف روی کالاهای منتخب',
          text: 'فرصت محدود، پاداش بیشتر',
          image: '/assets/products/oil.jpg',
        },
        {
          tone: 'rice',
          href: '/products/rice-hashemi-1kg',
          badge: 'پیشنهاد سوپرمارکت',
          title: 'برنج هاشمی ممتاز، ۱ کیلوگرم',
          text: 'پاداش خرید + ۱۲٬۰۰۰ تومان',
          image: '/assets/products/rice.png',
        },
        {
          tone: 'reward',
          href: '/rewards',
          badge: 'کیف پول پاداش',
          title: 'با هر خرید، پاداش بگیر',
          text: 'برای سفارش بعدی استفاده کن',
          image: null,
        },
      ]
    : [
        {
          tone: 'sale',
          href: '/special',
          badge: 'پیشنهاد امروز',
          title: 'تا ۳۰٪ تخفیف روی کالاهای منتخب',
          text: 'مشاهده فروش‌های ویژه و پاداش بیشتر',
          image: null,
        },
        {
          tone: 'rice',
          href: '/products/rice-hashemi-1kg',
          badge: 'پیشنهاد سوپرمارکت',
          title: 'برنج هاشمی ممتاز، ۱ کیلوگرم',
          text: '۱۲٬۰۰۰ تومان پاداش با هر خرید',
          image: '/assets/products/rice.png',
        },
        {
          tone: 'reward',
          href: '/rewards',
          badge: 'کیف پول پاداش',
          title: 'با خرید بیشتر، پاداش بیشتر بگیر',
          text: 'موجودی پاداشت را در سفارش بعدی استفاده کن',
          image: null,
        },
      ];

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay
  useEffect(() => {
    if (isDragging) return;

    autoPlayTimer.current = setInterval(nextSlide, 5000);
    return () => {
      if (autoPlayTimer.current) clearInterval(autoPlayTimer.current);
    };
  }, [nextSlide, isDragging]);

  // Touch Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || dragStartX.current === null) return;
    const diff = e.touches[0].clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // In RTL, dragging right moves to previous slide, dragging left moves to next slide
    if (dragOffset > 45) {
      nextSlide();
    } else if (dragOffset < -45) {
      prevSlide();
    }

    setDragOffset(0);
    dragStartX.current = null;
  };

  // Mouse Grab Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX.current === null) return;
    const diff = e.clientX - dragStartX.current;
    setDragOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragOffset > 45) {
      nextSlide();
    } else if (dragOffset < -45) {
      prevSlide();
    }

    setDragOffset(0);
    dragStartX.current = null;
  };

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative overflow-hidden my-3.5 rounded-[13px] select-none',
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      aria-label="پیشنهادهای ویژه"
    >
      <div
        className={cn(
          'flex',
          isDragging ? 'transition-none' : 'transition-transform duration-500 ease-out'
        )}
        style={{
          transform: `translateX(calc(${index * 100}% + ${dragOffset}px))`,
        }}
      >
        {slides.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            onClick={(e) => {
              // Prevent accidental click when dragging
              if (Math.abs(dragOffset) > 5) e.preventDefault();
            }}
            draggable={false}
            className={cn(
              'relative min-w-full h-[105px] flex items-center justify-between gap-2.5 p-4 overflow-hidden rounded-[13px]',
              s.tone === 'sale' &&
                'bg-gradient-to-br from-[#fff3dc] to-[#ffe3ab] text-[#503b17]',
              s.tone === 'rice' &&
                'bg-gradient-to-br from-[#edf8f1] to-[#d8f1e2] text-[#284838]',
              s.tone === 'reward' &&
                'bg-gradient-to-br from-[#edf4ff] to-[#dce8fc] text-[#294469]'
            )}
          >
            {/* Soft decorative bubble */}
            <span
              aria-hidden="true"
              className="absolute -left-6 -top-10 w-[115px] h-[115px] rounded-full border-[18px] border-white/40 pointer-events-none"
            />

            <span className="relative z-10 min-w-0 pr-1 pointer-events-none">
              <small className="block text-[9px] font-bold opacity-90">
                {s.badge}
              </small>
              <b className="block mt-1 text-[13.5px] font-extrabold truncate">
                {s.title}
              </b>
              <span className="block mt-1 text-[9px] text-[#728078] truncate">
                {s.text}
              </span>
            </span>

            {s.image ? (
              <img
                src={s.image}
                alt=""
                draggable={false}
                className="relative z-10 w-[65px] h-[65px] object-contain drop-shadow-sm pointer-events-none"
              />
            ) : (
              <span className="relative z-10 flex items-center justify-center w-[46px] h-[46px] rounded-[13px] bg-white/60 text-[#5a78a7] text-xl font-bold shadow-sm pointer-events-none">
                ✦
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-2 right-1/2 translate-x-1/2 z-10 flex items-center gap-1.5 pointer-events-auto">
        {slides.map((slide, i) => (
          <button
            key={slide.title}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex(i);
            }}
            aria-label={`اسلاید ${toFa(i + 1)}`}
            className={cn(
              'h-1.5 rounded-full transition-all duration-300 cursor-pointer border-0 p-0',
              i === index ? 'w-4 bg-sn-green shadow-sm' : 'w-1.5 bg-white/80'
            )}
          />
        ))}
      </div>
    </section>
  );
}
