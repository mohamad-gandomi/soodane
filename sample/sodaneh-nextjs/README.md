# سودانه — Frontend مبتنی بر Next.js

این پوشه نسخهٔ **Native React / Next.js App Router** رابط سودانه است. همهٔ صفحه‌ها به‌صورت React Client Components پیاده‌سازی شده‌اند و هیچ صفحه‌ای در Runtime از HTML قدیمی بارگذاری نمی‌شود.

## اجرا

```bash
npm install
npm run dev
```

برای Build تولید:

```bash
npm run build
npm run start
```

## مسیرها

| مسیر Next.js | صفحه |
|---|---|
| `/` | خانه |
| `/special` | فروش ویژه |
| `/products` | همهٔ کالاها، جستجو، فیلتر و مرتب‌سازی |
| `/products/rice` | جزئیات محصول |
| `/cart` و `/checkout` | سبد و تکمیل سفارش |
| `/rewards` و `/rewards/transactions` | پاداش و تراکنش‌ها |
| `/orders` و `/orders/10248` | سفارش‌ها و جزئیات سفارش |
| `/account`، `/account/profile` و `/account/addresses` | حساب کاربری |
| `/notifications`، `/legal`، `/support` و `/register` | سایر بخش‌ها |
| `/landing` | لندینگ معرفی سودانه |

## ساختار

- `app/[[...route]]/page.jsx` — نگاشت تمام مسیرهای App Router
- `components/SodanehApp.jsx` — Screenهای Native React، تعامل‌ها و کامپوننت‌های مشترک
- `app/native.css` — Design System و استایل واکنش‌گرا
- `public/assets` — تصاویر واقعی محصول و GIF تبلیغاتی

## نکات

- تعامل‌های اصلی شامل اسلایدر، Bottom Sheet، جستجو، فیلتر چنددسته‌ای، مرتب‌سازی، کنترل تعداد، سبد، Checkout، آدرس، پاداش، سفارش، دانلود فاکتور و فرم‌های پایه با State داخلی React اجرا می‌شوند.
- لایهٔ API و ذخیره‌سازی دائمی هنوز به پروژه متصل نشده‌اند؛ داده‌ها در حال حاضر Mock Data داخل کامپوننت‌ها هستند.
- قدم بعدی پیشنهادی: جداسازی `SodanehApp.jsx` به پوشه‌های `components/ui`، `components/features` و اتصال State به API/Backend.
