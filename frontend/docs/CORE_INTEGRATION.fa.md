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

قالب Nginx و نمونه تنظیمات در frontend/deploy هستند. این فایل‌ها متعلق به استقرار سودانه‌اند و در کور قرار نمی‌گیرند. دامنه اصلی sodaneh.ir برای لندینگ و بلاگ، app.sodaneh.ir برای فروشگاه، dashboard.sodaneh.ir برای داشبورد و api.sodaneh.ir برای API است. فایل‌های استقرار هنوز روی آروان تست نشده‌اند.

### دیتابیس سرور

برای دیتابیس تازهٔ سرور از compose.production.yml استفاده کنید؛ compose.local.yml مخصوص محیط محلی است.

```sh
cd /opt/soodane
node frontend/deploy/init-database-env.cjs
docker compose -f frontend/deploy/compose.production.yml up -d --wait --wait-timeout 120
docker compose -f frontend/deploy/compose.production.yml ps
```

اسکریپت یک رمز تصادفی در frontend/deploy/.env.database با دسترسی 600 می‌سازد و اجرای دوباره، فایل موجود را حفظ می‌کند. این فایل خصوصی و خارج از گیت است؛ از آن نسخهٔ امن نگه دارید و پس از ساخته‌شدن دیتابیس حذف یا دوباره تولیدش نکنید. تغییر متغیر رمز در این فایل، رمز کاربر دیتابیس موجود را تغییر نمی‌دهد.

PostgreSQL روی 127.0.0.1:5434 در دسترس برنامه‌های همین سرور است. داده‌ها در volume پایدار sodaneh-production_postgres_data ذخیره می‌شوند؛ راه‌اندازی مجدد کانتینر داده‌ها را نگه می‌دارد. دستور down -v داده‌ها را حذف می‌کند و برای سرور استفاده نشود. پیش از بهره‌برداری، پشتیبان‌گیری مستقل از دیتابیس لازم است؛ volume جای بکاپ را نمی‌گیرد.

این مرحله فقط PostgreSQL را آماده می‌کند. سپس DATABASE_URL خصوصی API با همین اطلاعات ساخته می‌شود و migrationهای رسمی کور با pnpm prisma:deploy اجرا می‌شوند. برای ساختار اولیهٔ production از seed یا reset استفاده نشود.

### تنظیمات برنامه و مقداردهی اولیه

پس از سالم‌شدن PostgreSQL، دستور زیر را با ایمیل مدیر موردنظر اجرا کنید:

```sh
cd /opt/soodane
node frontend/deploy/init-production-env.cjs admin@sodaneh.ir
cd /opt/soodane/core
pnpm prisma:deploy && pnpm db:init
```

اسکریپت فایل‌های خصوصی core/.env، core/frontend/.env.local و frontend/.env.local را با دسترسی 600 می‌سازد. فایل موجود بازنویسی نمی‌شود؛ تغییر ایمیل آرگومان در اجرای دوباره، حساب موجود یا تنظیمات قبلی را تغییر نمی‌دهد. رمز اولیهٔ مدیر و سه کلید مستقل تصادفی فقط در core/.env ذخیره می‌شوند و چاپ نمی‌شوند. فایل اصلی کور دست‌نخورده می‌ماند؛ این‌ها فایل‌های runtime نادیده‌گرفته‌شده توسط Git هستند.

prisma:deploy جدول‌ها را با migrationهای رسمی ایجاد می‌کند. فقط پس از موفقیت آن، db:init مدیر و تنظیمات ضروری را می‌سازد و دادهٔ نمایشی وارد نمی‌کند. تنظیمات اولیهٔ فروشگاه و هزینهٔ ارسال باید پیش از فروش واقعی در داشبورد بازبینی شوند. این مرحله هنوز وب‌سایت را اجرا نمی‌کند؛ ساخت برنامه، سرویس دائمی، دامنه و HTTPS مراحل بعدند. پرداخت و پیامک production به اطلاعات واقعی سرویس‌دهنده نیاز دارند و mock در این تنظیمات غیرفعال است.

### سرویس‌های دائمی سرور

پس از ساخت موفق هر سه برنامه، سرویس‌ها با کاربر اختصاصی sodaneh-app اجرا می‌شوند. فروشگاه روی 127.0.0.1:3000 و داشبورد روی 127.0.0.1:4001 گوش می‌دهند. API رسمی کور روی پورت 4000 است؛ پیش از اجرای آن، دسترسی مستقیم به این پورت با فایروال بسته می‌شود. SSH این سرور روی 22 است و پیش از فعال‌سازی فایروال مجاز می‌ماند:

```sh
cd /opt/soodane
apt install -y ufw &&
ufw allow 22/tcp &&
ufw allow 80/tcp &&
ufw allow 443/tcp &&
ufw deny 4000/tcp &&
ufw --force enable &&
node frontend/deploy/install-services.cjs
```

نصب‌کننده فقط روی Linux با دسترسی root در مسیر دقیق /opt/soodane اجرا می‌شود. فایل‌های build و فعال‌بودن فایروال را پیش از شروع بررسی می‌کند و فایل سرویس ناشناخته را جایگزین نمی‌کند. مالکیت سورس و Git تغییر نمی‌کند؛ فقط فایل‌های خصوصی env و مسیرهای runtime uploads و .next به کاربر سرویس سپرده می‌شوند. سورس کور تغییری نمی‌کند. دسترسی رمزها همچنان 600 است؛ کاربر root هم آن‌ها را برای نگهداری سرور می‌خواند.

```sh
systemctl is-active sodaneh-api sodaneh-dashboard sodaneh-storefront
curl --fail --silent --show-error --retry 12 --retry-connrefused --retry-delay 2 --max-time 10 -o /dev/null -w 'API: %{http_code}\n' http://127.0.0.1:4000/api/docs-json
curl --fail --silent --show-error -o /dev/null -w 'Dashboard: %{http_code}\n' http://127.0.0.1:4001/login
curl --fail --silent --show-error -H 'Host: app.sodaneh.ir' -o /dev/null -w 'Storefront: %{http_code}\n' http://127.0.0.1:3000/
```

وضعیت active فقط اجرای process را نشان می‌دهد؛ پاسخ‌های HTTP هم باید بررسی شوند. در صورت خطا، journalctl -u sodaneh-api -n 50 --no-pager یا نام سرویس مربوط را بررسی کنید. سرویس‌ها پس از reboot بالا می‌آیند و در صورت خروج process دوباره شروع می‌شوند؛ این تنظیم به‌تنهایی آزمون سلامت یا تست خرید نیست. برای انتشار نسخه بعد، پس از دریافت کد، نصب، migration و ساخت موفق، نصب‌کننده را دوباره اجرا کنید تا مالکیت فایل‌های جدید build تنظیم و سرویس‌ها restart شوند. هنوز Nginx، DNS و HTTPS باید جداگانه تنظیم و آزمایش شوند.
