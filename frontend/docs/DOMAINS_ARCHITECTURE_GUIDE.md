# دامنه‌های سودانه

| دامنه | سرویس | پورت محلی |
|---|---|---|
| sodaneh.ir و www.sodaneh.ir | لندینگ و بلاگ در frontend | 3000 |
| app.sodaneh.ir | فروشگاه در frontend | 3000 |
| dashboard.sodaneh.ir | داشبورد رسمی core/frontend | 4001 |
| api.sodaneh.ir | API رسمی core | 4000 |

راهنمای اجرای مستقل سرویس‌ها: [CORE_INTEGRATION.fa.md](CORE_INTEGRATION.fa.md).

فرانت: NEXT_PUBLIC_API_URL=https://api.sodaneh.ir/api/v1 و NEXT_PUBLIC_APP_URL=https://app.sodaneh.ir و NEXT_PUBLIC_SITE_URL=https://sodaneh.ir و LANDING_DOMAIN=sodaneh.ir و APP_DOMAIN=app.sodaneh.ir. داشبورد نیز به همین API متصل می‌شود.

API: PUBLIC_API_ORIGIN=https://api.sodaneh.ir و PAYMENT_RESULT_URL=https://app.sodaneh.ir/orders. CORS_ORIGIN فهرست صریح مبداهای HTTPS دامنه اصلی و app و dashboard است. سایر تنظیمات مطابق نمونه رسمی کور در محیط سرویس وارد می‌شوند.

قالب [Nginx](../deploy/nginx/soodaneh-multidomain.conf) هنوز روی آروان اجرا و تست نشده است. انتقال سرور، DNS، TLS، ingress و تست بانک و SMS واقعی مرحله بعد هستند.
