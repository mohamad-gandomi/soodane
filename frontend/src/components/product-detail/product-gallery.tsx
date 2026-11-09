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
      {/* Main Preview Container: Square, Full Width, Full Cover */}
      <div className="w-full aspect-square rounded-[18px] bg-[#f2f7f4] overflow-hidden border border-sn-line/60 relative shadow-2xs">
        <img
          src={activeImage}
          alt={productName}
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={cn(
                'h-14 w-14 rounded-[12px] border border-sn-line bg-white p-0 flex items-center justify-center shrink-0 overflow-hidden transition-all cursor-pointer',
                activeIdx === i && 'border-sn-green ring-2 ring-sn-green/30'
              )}
            >
              <img
                src={img}
                alt={`تصویر ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
