import type { Metadata, Viewport } from 'next';
import './globals.css';
import { CartProvider } from '@/context/cart-context';
import { AuthProvider } from '@/context/auth-context';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'سودانه | فروشگاه آنلاین و سیستم پاداش خرید و معرفی',
  description:
    'فروشگاه آنلاین سودانه - خرید محصولات باکیفیت به همراه پاداش خرید مستقیم و پاداش معرفی دوستان در کیف پول نقدی',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="preload"
          href="/fonts/IRANSansXFaNum-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/IRANSansXFaNum-DemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/IRANSansXFaNum-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="antialiased min-h-screen">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster
              position="top-center"
              dir="rtl"
              toastOptions={{
                className: 'font-sans text-[12px]',
              }}
            />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
