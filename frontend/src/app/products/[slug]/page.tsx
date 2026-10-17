'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { TopPromo } from '@/components/layout/top-promo';
import { TopHeader } from '@/components/layout/top-header';
import { ProductGallery } from '@/components/product-detail/product-gallery';
import { ProductPriceCard } from '@/components/product-detail/product-price-card';
import { ProductRewardBanner } from '@/components/product-detail/product-reward-banner';
import { ProductSpecs } from '@/components/product-detail/product-specs';
import { ProductBuyBar } from '@/components/product-detail/product-buy-bar';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { productsService } from '@/services/products.service';
import { useCart } from '@/context/cart-context';
import { Product } from '@/types/product';
import { toFa } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { totalCount, addToCart } = useCart();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) {
        setLoading(false);
        return;
      }
      try {
        const p = await productsService.getProductBySlug(slug);
        setProduct(p);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <AppShell hasBottomNav={false}>
        <TopPromo />
        <TopHeader title="در حال بارگذاری..." backHref="/products" />
        <div className="py-20 text-center text-sn-muted text-sm">
          در حال دریافت اطلاعات محصول...
        </div>
      </AppShell>
    );
  }

  if (!product) {
    return (
      <AppShell hasBottomNav={false}>
        <TopPromo />
        <TopHeader title="محصول یافت نشد" backHref="/products" />
        <div className="py-20 text-center text-sn-muted text-sm">
          محصول مورد نظر یافت نشد یا غیرفعال شده است.
        </div>
      </AppShell>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.map((img) => img.url)
      : [
          product.image || '/assets/products/rice.png',
          product.image || '/assets/products/rice.png',
          product.image || '/assets/products/rice.png',
        ];

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href,
      });
    } else {
      navigator.clipboard?.writeText(window.location.href);
      toast.success('لینک محصول کپی شد');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${toFa(quantity)} عدد ${product.name} به سبد افزوده شد`);
  };

  return (
    <AppShell hasBottomNav={false} className="pb-[90px]">
      <TopPromo />

      <TopHeader title="" backHref="/products">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleShare}
            className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-sn-line bg-white text-[#506459] hover:bg-slate-50 transition-colors"
            aria-label="اشتراک‌گذاری"
          >
            <Icon name="share" size={18} />
          </button>

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
      </TopHeader>

      <ProductGallery images={galleryImages} productName={product.name} />

      <div className="mt-4">
        <Badge variant="default">سوپرمارکت · موجود</Badge>
        <h1 className="text-[20px] font-black text-sn-text leading-snug mt-2">
          {product.name}
        </h1>
        <p className="mt-1 text-[10px] text-sn-muted">
          ★ ۴.۸ · بر اساس ۱۲۵ دیدگاه خریداران
        </p>
      </div>

      <ProductPriceCard price={product.price ?? 0} oldPrice={product.oldPrice} />

      <ProductRewardBanner
        buyerReward={product.reward ?? 0}
        referrerReward={product.referrerRewardValue}
      />

      <ProductSpecs
        specs={product.specifications}
        description={product.description}
      />

      <ProductBuyBar
        quantity={quantity}
        onQuantityChange={setQuantity}
        onAddToCart={handleAddToCart}
      />
    </AppShell>
  );
}
