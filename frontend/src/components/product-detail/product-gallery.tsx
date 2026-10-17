'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeImage = images[activeIdx] || images[0] || '/assets/products/rice.png';

  return (
    <section className="mt-1" aria-label="گالری تصاویر محصول">
      {/* Main Preview Container */}
      <div className="h-[260px] w-full rounded-[15px] bg-[#f2f7f4] p-4 flex items-center justify-center overflow-hidden border border-sn-line/60">
        <img
          src={activeImage}
          alt={productName}
          className="h-full w-full object-contain drop-shadow-sm transition-all duration-300"
        />
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                'h-12 w-12 rounded-[8px] border border-sn-line bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden transition-all cursor-pointer',
                activeIdx === i && 'border-sn-green bg-[#eff9f3] ring-1 ring-sn-green'
              )}
            >
              <img
                src={img}
                alt={`تصویر ${i + 1}`}
                className="h-full w-full object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
