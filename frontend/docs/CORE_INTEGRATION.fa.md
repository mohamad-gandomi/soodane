# معماری و اجرای سودانه

ریشه فقط core و frontend به همراه فایل‌های مخفی Git دارد. core یک submodule از مخزن رسمی persian-commerce-core است؛ نسخه دقیق با gitlink خود Git قفل می‌شود. کور شامل API و داشبورد مشترک core/frontend است. کد اختصاصی سودانه فقط در frontend قرار دارد.

## دریافت و نصب

پس از clone، از ریشه git submodule update --init --recursive اجرا شود. وابستگی‌ها جدا نصب می‌شوند:

- در core: pnpm install --frozen-lockfile (API و داشبورد با workspace رسمی خود کور)
- در frontend: pnpm install --frozen-lockfile (فروشگاه و لندینگ و بلاگ)

package.json و lockfile هر بخش، مرجع نسخه‌های همان بخش هستند. node_modules ریشه نیاز نیست. pnpm ذخیره فیزیکی بسته‌ها را در store مشترک بهینه می‌کند؛ node_modulesها دستی ادغام یا به یکدیگر لینک نشوند.

## تنظیمات خصوصی

- core/.env: تنظیمات API مطابق core/.env.example؛ نمونه مخصوص سودانه در frontend/deploy/api.env.example
- core/frontend/.env.local: تنظیمات داشبورد؛ نمونه در frontend/deploy/admin.env.example
- frontend/.env.local: تنظیمات فرانت مطابق frontend/.env.example؛ برای لوکال NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
- core/uploads: داده رسانه‌ای runtime مطابق مسیر پیش‌فرض کور، UPLOAD_DIR=./uploads

.envها و فایل‌های آپلود محلی در گیت نادیده گرفته می‌شوند؛ وجودشان به معنی تغییر سورس کور نیست. فایل tracked کور، از جمله placeholder پیش‌فرض، تغییر نکند. در سرور متغیرهای محیطی و volume پایدار توسط سرویس/زیرساخت تأمین شوند.

## اجرا در سه ترمینال

- از core: pnpm start:dev (API روی 4000)
- از core/frontend: pnpm dev (داشبورد روی 4001)
- از frontend: pnpm dev (فروشگاه روی 3000)

ساخت: در core دستور pnpm build و pnpm build:frontend؛ در frontend دستور pnpm build. تست رسمی در core با pnpm test اجرا می‌شود؛ برای تست‌های مستقل، فایل env خصوصی را از بیرون به process تزریق نکنید، چون fixtureها تنظیمات خود را دارند.

اسکریپت ریشه برای اجرای هم‌زمان سرویس‌ها، وابستگی concurrently و core-version.json حذف شده‌اند. بررسی کور: git -C core status --short باید خالی باشد؛ نسخه با git submodule status دیده می‌شود. تغییر عمومی بک‌اند باید در مخزن رسمی کور اصلاح و منتشر و سپس نسخه submodule در سودانه ارتقا داده شود.

## دیتابیس محلی

تنظیم اجرا در core/.env به کپی sodaneh_core_upgrade_test روی PostgreSQL پورت 5434 اشاره دارد. دیتابیس اصلی sodaneh_db تغییر نکرده است. فایل Docker اختیاری در frontend/deploy/compose.local.yml است و نام پروژه قبلی persian-ecommerce-boilerplate را حفظ می‌کند تا به همان volume موجود وصل شود. compose پیش‌فرض کور برای این دیتابیس اجرا نشود.

خریدها و OTP فعلی mock محلی‌اند. seed یا reset روی دیتابیس اصلی انجام نشود. راهنمای migration رسمی در core/docs/DATABASE_MIGRATIONS.fa.md است؛ نتیجه تست ارتقا در LOCAL_VERIFICATION.fa.md به‌صورت گزارش تاریخی حفظ شده است.

## استقرار

قالب Nginx و نمونه تنظیمات در frontend/deploy هستند. این فایل‌ها متعلق به استقرار سودانه‌اند و در کور قرار نمی‌گیرند. دامنه اصلی soodane.com برای لندینگ و بلاگ، app.soodane.com برای فروشگاه، dashboard.soodane.com برای داشبورد و api.soodane.com برای API است. فایل‌های استقرار هنوز روی آروان تست نشده‌اند.
