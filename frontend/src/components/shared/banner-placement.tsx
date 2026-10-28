'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { bannersService } from '@/services/banners.service';
import { BannerItem, BannerPlacement as Placement, BannerPlacementKey } from '@/types/banner';
import { cn, toFa } from '@/lib/utils';

function BannerContent({ item, compact }: { item: BannerItem; compact: boolean }) {
  const composite = item.contentType === 'COMPOSITE';
  const hasText = !!(item.eyebrow || item.displayTitle || item.subtitle || item.buttonText);
  return (
    <div
      className={cn(
        'relative isolate h-full w-full overflow-hidden',
        composite ? 'flex items-center justify-between gap-3 p-4 pb-7' : '',
        compact && composite && 'px-4 py-2'
      )}
      style={{ backgroundColor: item.backgroundColor || '#eaf6ef', color: item.textColor || '#284838' }}
    >
      <picture className={cn(
        composite ? 'order-2 block h-24 w-24 shrink-0' : 'block h-full w-full',
        compact && composite && 'h-12 w-12'
      )}>
        {item.mobileImageUrl && <source media="(max-width: 640px)" srcSet={item.mobileImageUrl} />}
        <img
          src={item.imageUrl}
          alt={item.altText}
          draggable={false}
          className={cn('h-full w-full', composite ? 'object-contain' : 'object-cover')}
        />
      </picture>
      {hasText && (
        <div className={cn(
          'min-w-0',
          !composite && 'absolute inset-0 flex flex-col justify-center bg-gradient-to-l from-black/65 to-transparent px-5 text-white',
          compact && !composite && 'px-4'
        )}>
          {item.eyebrow && <p className="text-[9px] font-bold opacity-90">{item.eyebrow}</p>}
          {item.displayTitle && <p className={cn('mt-1 text-[14px] font-black leading-relaxed line-clamp-2', compact && 'text-[12px]')}>{item.displayTitle}</p>}
          {item.subtitle && !compact && <p className="mt-1 text-[10px] leading-relaxed opacity-80 line-clamp-1">{item.subtitle}</p>}
          {item.buttonText && item.buttonUrl && (
            <Link
              href={item.buttonUrl}
              className="mt-2 inline-flex w-fit items-center rounded-lg bg-white px-3 py-1.5 text-[10px] font-bold text-sn-deep"
            >
              {item.buttonText}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export function BannerPlacement({
  placementKey,
  compact = false,
  className,
}: {
  placementKey: BannerPlacementKey;
  compact?: boolean;
  className?: string;
}) {
  const [placement, setPlacement] = useState<Placement | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [visible, setVisible] = useState(true);
  const pointerStart = useRef<number | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    setPlacement(null);
    setIndex(0);
    setPaused(false);
    bannersService.getPlacement(placementKey, controller.signal)
      .then(data => { if (!controller.signal.aborted) setPlacement(data); })
      .catch(() => { /* Empty, unavailable, or disabled placements leave no blank section. */ });
    return () => controller.abort();
  }, [placementKey]);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReducedMotion(query.matches);
    const updateVisibility = () => setVisible(!document.hidden);
    updateMotion();
    updateVisibility();
    query.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    return () => {
      query.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const items = placement?.items || [];
  const count = placement?.displayMode === 'single' ? Math.min(items.length, 1) : items.length;
  const activeIndex = count ? index % count : 0;
  const canAutoplay = !!placement?.autoplay && count > 1 && !reducedMotion;

  useEffect(() => {
    if (!canAutoplay || paused || hovered || focused || dragging || !visible) return;
    const timer = window.setInterval(
      () => setIndex(current => (current + 1) % count),
      placement?.intervalMs || 6000
    );
    return () => window.clearInterval(timer);
  }, [canAutoplay, count, placement?.intervalMs, paused, hovered, focused, dragging, visible]);

  if (!placement || count === 0) return null;
  const multiple = count > 1;
  const active = items[activeIndex];
  const move = (direction: number) => setIndex(current => (current + direction + count) % count);

  return (
    <section
      aria-label={compact ? 'بنر بالای هدر' : placementKey === 'home.hero' ? 'پیشنهادهای صفحه اصلی' : 'پیشنهادهای فروشگاه'}
      aria-roledescription={multiple ? 'اسلایدر' : undefined}
      tabIndex={multiple ? 0 : undefined}
      className={cn(
        'relative overflow-hidden rounded-[13px] select-none',
        compact ? 'h-[60px] rounded-none' : 'my-3.5 h-[176px]',
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-sn-green',
        className
      )}
      style={{ touchAction: 'pan-y' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onKeyDown={event => {
        if (!multiple || event.target !== event.currentTarget) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault();
          move(event.key === 'ArrowLeft' ? 1 : -1);
        }
      }}
      onPointerDown={event => {
        if (!multiple || event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
        pointerStart.current = event.clientX;
        suppressClick.current = false;
        setDragging(true);
      }}
      onPointerMove={event => {
        if (pointerStart.current !== null && Math.abs(event.clientX - pointerStart.current) > 8) {
          suppressClick.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }}
      onPointerUp={event => {
        if (pointerStart.current !== null) {
          const distance = event.clientX - pointerStart.current;
          if (Math.abs(distance) > 40) move(distance > 0 ? 1 : -1);
        }
        pointerStart.current = null;
        setDragging(false);
      }}
      onPointerCancel={() => { pointerStart.current = null; setDragging(false); }}
      onClickCapture={event => {
        if (suppressClick.current) {
          event.preventDefault();
          event.stopPropagation();
          suppressClick.current = false;
        }
      }}
      onDragStart={event => event.preventDefault()}
    >
      <div className="h-full" role={multiple ? 'group' : undefined} aria-label={multiple ? `اسلاید ${toFa(activeIndex + 1)} از ${toFa(count)}` : undefined} aria-live={canAutoplay && !paused ? 'off' : 'polite'}>
        {active.linkUrl ? (
          <Link href={active.linkUrl} className="block h-full" draggable={false}>
            <BannerContent item={active} compact={compact} />
          </Link>
        ) : <BannerContent item={active} compact={compact} />}
      </div>
      {multiple && placement.showDots && (
        <div className="absolute bottom-2 right-1/2 z-10 flex max-w-[75%] translate-x-1/2 gap-1.5 overflow-x-auto py-1 scrollbar-none" aria-label="انتخاب اسلاید">
          {items.map((item, slideIndex) => (
            <button
              key={item.id}
              type="button"
              aria-label={`نمایش اسلاید ${toFa(slideIndex + 1)}`}
              aria-current={slideIndex === activeIndex ? 'true' : undefined}
              onClick={() => setIndex(slideIndex)}
              className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full border-0 p-1"
            >
              <span className={cn('h-2 rounded-full ring-1 ring-black/10', slideIndex === activeIndex ? 'w-5 bg-sn-green' : 'w-2 bg-white')} />
            </button>
          ))}
        </div>
      )}
      {canAutoplay && (
        <button
          type="button"
          onClick={() => setPaused(value => !value)}
          aria-label={paused ? 'ادامه پخش اسلایدر' : 'توقف پخش اسلایدر'}
          aria-pressed={paused}
          className="absolute bottom-2 left-2 z-10 rounded-md bg-white/90 px-2 py-1 text-[9px] font-bold text-sn-deep"
        >
          {paused ? 'پخش' : 'توقف'}
        </button>
      )}
    </section>
  );
}
