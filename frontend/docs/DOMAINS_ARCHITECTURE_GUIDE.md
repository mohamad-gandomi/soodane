# دامنه‌های سودانه

| دامنه | سرویس | پورت محلی |
|---|---|---|
| soodane.com و www.soodane.com | لندینگ و بلاگ در frontend | 3000 |
| app.soodane.com | فروشگاه در frontend | 3000 |
| dashboard.soodane.com | داشبورد رسمی core/frontend | 4001 |
| api.soodane.com | API رسمی core | 4000 |

راهنمای اجرای مستقل سرویس‌ها: [CORE_INTEGRATION.fa.md](CORE_INTEGRATION.fa.md).

فرانت: NEXT_PUBLIC_API_URL=https://api.soodane.com/api/v1 و NEXT_PUBLIC_APP_URL=https://app.soodane.com و NEXT_PUBLIC_SITE_URL=https://soodane.com و LANDING_DOMAIN=soodane.com و APP_DOMAIN=app.soodane.com. داشبورد نیز به همین API متصل می‌شود.

API: PUBLIC_API_ORIGIN=https://api.soodane.com و PAYMENT_RESULT_URL=https://app.soodane.com/orders. CORS_ORIGIN فهرست صریح مبداهای HTTPS دامنه اصلی و app و dashboard است. سایر تنظیمات مطابق نمونه رسمی کور در محیط سرویس وارد می‌شوند.

قالب [Nginx](../deploy/nginx/soodaneh-multidomain.conf) هنوز روی آروان اجرا و تست نشده است. انتقال سرور، DNS، TLS، ingress و تست بانک و SMS واقعی مرحله بعد هستند.
