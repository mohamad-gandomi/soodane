import './globals.css';
import './native.css';

export const metadata = {
  title: 'سودانه | خرید کن، پاداش بگیر',
  description: 'نسخه Next.js رابط سودانه'
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
