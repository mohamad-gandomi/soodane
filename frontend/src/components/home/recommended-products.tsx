'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types/product';
import { ProductListCard } from '@/components/shared/product-list-card';
import { useCart } from '@/context/cart-context';

export function RecommendedProducts({ products }: { products: Product[] }) {
  const { getItemQuantity, setQuantity } = useCart();
  return (
    <section className="mt-6 mb-8">
      <div className="flex items-center justify-between mb-3.5">
        <h2 className="text-[14px] font-black text-sn-text">پیشنهاد برای شما</h2>
        <Link href="/products" className="text-[10.5px] font-bold text-sn-green hover:underline">مشاهده همه</Link>
      </div>
      <div className="flex flex-col gap-3">
        {products.slice(0, 4).map(product => (
          <ProductListCard
            key={product.id}
            product={product}
            quantity={getItemQuantity(product.id)}
            onQuantityChange={quantity => setQuantity(product, quantity)}
          />
        ))}
      </div>
    </section>
  );
}
