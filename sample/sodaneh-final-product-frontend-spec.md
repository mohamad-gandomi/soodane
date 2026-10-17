# سند نهایی ساختار محصول و فرانت‌اند سودانه
## Sodaneh Product & Frontend Specification

**نام محصول:** سودانه  
**نام انگلیسی:** Sodaneh  
**دامنه اصلی:** `sodaneh.ir`  
**نوع محصول:** فروشگاه آنلاین پاداش‌محور  
**نسخه سند:** 1.0

---

# 1. معرفی محصول

سودانه یک فروشگاه آنلاین است که علاوه بر خرید کالا، یک سیستم پاداش مستقیم برای کاربران دارد.

مدل اصلی سودانه بر دو نوع پاداش بنا شده است:

1. **پاداش خرید مستقیم**
   - کاربر بابت خرید هر محصول، مبلغ مشخصی به تومان به‌عنوان پاداش دریافت می‌کند.
   - مبلغ پاداش برای هر محصول به‌صورت مستقل توسط ادمین تعریف می‌شود.

2. **پاداش معرفی مستقیم**
   - اگر کاربر شخص دیگری را مستقیماً معرفی کرده باشد، با خرید آن شخص، معرف مبلغ مشخصی به تومان دریافت می‌کند.
   - مبلغ پاداش معرف نیز برای هر محصول به‌صورت مستقل تعریف می‌شود.

سودانه **سیستم هرمی یا چندسطحی ندارد**.

اگر:

```text
کاربر A
 ↓ معرفی می‌کند
کاربر B
 ↓ معرفی می‌کند
کاربر C
```

و کاربر C خرید کند:

```text
C → پاداش خرید خودش را دریافت می‌کند.
B → پاداش معرفی مستقیم را دریافت می‌کند.
A → هیچ پاداشی از خرید C دریافت نمی‌کند.
```

بنابراین Reward فقط بین:

```text
خریدار
+
معرف مستقیم خریدار
```

توزیع می‌شود.

---

# 2. اکوسیستم محصول

```text
Sodaneh
│
├── Landing Website
│   └── sodaneh.ir
│
├── Customer Web App
│   └── app.sodaneh.ir
│
└── Super Admin Panel
    └── admin.sodaneh.ir
```

پیشنهاد برای Backend:

```text
api.sodaneh.ir
```

---

# 3. تکنولوژی Frontend

```text
Next.js
React.js
TypeScript
Tailwind CSS
```

پیشنهاد معماری:

```text
Next.js App Router
Server Components by default
Client Components only where interaction is required
```

کتابخانه‌های پیشنهادی:

```text
TanStack Query      → Server State
Zustand             → Client State
React Hook Form     → Forms
Zod                 → Validation
Axios               → API Client
Font Awesome        → Icons
Sonner              → Toast / Notifications
dayjs               → Date utilities
```

---

# 4. هویت بصری

```text
Brand Name:
Sodaneh | سودانه

Primary Brand Color:
Green

Font:
IRANSansX

Icon Library:
Font Awesome
```

همه صفحات فارسی و RTL:

```html
<html lang="fa" dir="rtl">
```

برای Font Awesome از پکیج رسمی React استفاده شود:

```text
@fortawesome/react-fontawesome
```

---

# 5. معماری Repository

پیشنهاد Monorepo:

```text
sodaneh/
│
├── apps/
│   ├── landing/
│   ├── customer/
│   └── admin/
│
├── packages/
│   ├── ui/
│   ├── api-client/
│   ├── types/
│   ├── utils/
│   └── config/
│
├── turbo.json
├── package.json
└── tsconfig.json
```

---

# 6. Landing Website

دامنه:

```text
https://sodaneh.ir
```

## Routeها

```text
/
├── Landing

/blog
├── Blog List

/blog/[slug]
└── Blog Article
```

## ساختار Landing

```text
Header
 ↓
Hero
 ↓
معرفی سودانه
 ↓
سودانه چگونه کار می‌کند؟
 ↓
ویژگی‌های اصلی
 ↓
سیستم پاداش
 ↓
کیف پول پاداش
 ↓
دعوت دوستان
 ↓
مزایای سودانه
 ↓
مقالات منتخب
 ↓
درباره ما کوتاه
 ↓
سوالات متداول
 ↓
تماس با ما
 ↓
CTA
 ↓
Footer
```

Navigation:

```text
معرفی سودانه
ویژگی‌ها
نحوه کار
مقالات
درباره ما
تماس با ما
```

Anchorها:

```text
/#features
/#how-it-works
/#about
/#faq
/#contact
```

CTA اصلی:

```text
ورود به سودانه
```

Destination:

```text
https://app.sodaneh.ir
```

---

# 7. Blog

Route:

```text
sodaneh.ir/blog
```

ساختار:

```text
Header
 ↓
عنوان بلاگ
 ↓
مقاله شاخص
 ↓
جستجو
 ↓
دسته‌بندی‌ها
 ↓
لیست مقالات
 ↓
Pagination
 ↓
Footer
```

هر Blog Card:

```text
Cover Image
Category
Title
Short Description
Publish Date
Reading Time
CTA
```

Pagination:

```text
/blog?page=1
/blog?page=2
...
```

---

# 8. Blog Article

Route:

```text
sodaneh.ir/blog/[slug]
```

ساختار:

```text
Breadcrumb
 ↓
Category
 ↓
H1
 ↓
Summary
 ↓
Publish Date
 ↓
Reading Time
 ↓
Cover Image
 ↓
Table of Contents
 ↓
Article Content
 ↓
Share
 ↓
Related Articles
 ↓
CTA → app.sodaneh.ir
```

SEO Metadata:

```text
title
description
canonical
open graph
article image
publish date
author
```

---

# 9. Customer Web App

دامنه:

```text
https://app.sodaneh.ir
```

ساختار:

```text
Mobile First
PWA Ready
RTL
App-like UI
```

حداکثر عرض روی Desktop:

```text
max-width: 480px
```

---

# 10. Bottom Navigation

```text
خانه
شگفت‌انگیز
سفارشات
پاداش
حساب من
```

Routeها:

```text
/               → خانه
/special        → شگفت‌انگیز
/orders         → سفارشات
/rewards        → پاداش
/account        → حساب من
```

Iconهای پیشنهادی:

```text
خانه          faHouse
شگفت‌انگیز    faBolt / faPercent
سفارشات       faBox
پاداش         faGift
حساب من       faUser
```

---

# 11. Sitemap کلی Web App

```text
app.sodaneh.ir
│
├── /
│
├── /login
├── /verify
│
├── /search
│
├── /categories
│   └── /[slug]
│
├── /products
│   └── /[slug]
│
├── /special
│   └── /[campaignId]
│
├── /cart
│
├── /checkout
│   ├── /address
│   ├── /delivery
│   ├── /reward
│   ├── /payment
│   └── /review
│
├── /payment
│   └── /result
│
├── /orders
│   └── /[orderId]
│
├── /rewards
│   ├── /friends
│   └── /transactions
│
└── /account
    ├── /profile
    ├── /addresses
    │   ├── /new
    │   └── /[addressId]
    ├── /notifications
    ├── /support
    └── /legal
```

---

# 12. Home

```text
Header
├── Logo
├── Selected Address
├── Notification
└── Cart

Search

Main Banners

Categories

Special Offers

Recommended Products

High Reward Products

Best Sellers

Selected Discounts

Referral Banner

Bottom Navigation
```

Product Card:

```text
Image
Name
Price
Discount
Buyer Reward
Stock Status
Add to Cart
```

---

# 13. Search Flow

```text
Search
 ↓
Enter Keyword
 ↓
Live Suggestions
 ↓
Search Results
 ↓
Filter
 ↓
Sort
 ↓
Product Detail
```

Stateها:

```text
Recent Searches
Popular Searches
Loading
No Result
Error
```

---

# 14. Categories Flow

```text
Home
 ↓
Category
 ↓
Product Listing
 ↓
Filter
 ↓
Sort
 ↓
Product Detail
```

Filterهای پایه:

```text
موجود
بازه قیمت
دسته
زیردسته
تخفیف‌دار
شگفت‌انگیز
```

Sort:

```text
پرفروش‌ترین
جدیدترین
ارزان‌ترین
گران‌ترین
بیشترین تخفیف
بیشترین پاداش
```

---

# 15. Special Offers

Route:

```text
/special
```

ساختار:

```text
Header
 ↓
Campaign
 ↓
Countdown
 ↓
Category Filter
 ↓
Sort
 ↓
Special Products
 ↓
Bottom Navigation
```

---

# 16. Product Detail

Route:

```text
/products/[slug]
```

ساختار:

```text
Gallery
 ↓
Product Name
 ↓
Price
 ↓
Discount
 ↓
Stock
 ↓
Buyer Reward
 ↓
Direct Referrer Reward
 ↓
Product Features
 ↓
Description
 ↓
Reviews
 ↓
Quantity
 ↓
Add To Cart
```

نمایش Reward:

```text
با خرید این محصول:
+ [مبلغ پاداش خرید] تومان

اگر شخصی که مستقیماً دعوت کرده‌ای
این محصول را بخرد:
+ [مبلغ پاداش معرف] تومان
```

---

# 17. مدل Reward محصول

هر محصول دو Reward اصلی دارد:

```text
buyerRewardAmount
referrerRewardAmount
```

هر دو مبلغ ثابت به تومان هستند.

هیچ درصد عمومی اجباری وجود ندارد.

---

# 18. قانون Direct Referral

```text
Direct Referral Reward System
```

هر User می‌تواند یک Direct Referrer داشته باشد.

```text
Ali
 ↓
Maryam
 ↓
Reza
```

خرید Maryam:

```text
Maryam → Buyer Reward
Ali → Direct Referrer Reward
```

خرید Reza:

```text
Reza → Buyer Reward
Maryam → Direct Referrer Reward
Ali → 0
```

قانون:

```text
NO UPSTREAM REWARD
```

Referral نباید به شکل:

```text
Level 1
Level 2
Level 3
MLM Tree
Downline
```

مدل‌سازی شود.

---

# 19. Registration Flow

کاربر جدید:

```text
ورود شماره موبایل
 ↓
ارسال OTP
 ↓
ورود OTP
 ↓
تأیید شماره
 ↓
تشخیص User جدید
 ↓
Referral Detection
 ↓
ساخت حساب
 ↓
ورود به Home
 ↓
تکمیل پروفایل
```

اطلاعات تکمیلی:

```text
نام
نام خانوادگی
تاریخ تولد
کد ملی
```

---

# 20. Referral در Registration

سه حالت:

## حالت 1

```text
OTP
 ↓
کد معرف داری؟
 ↓
Enter Referral Code
```

## حالت 2

ورود از Referral Link:

```text
app.sodaneh.ir/r/ABC123
```

در این حالت Referral Code به‌صورت خودکار ذخیره می‌شود.

## حالت 3

بعد از Registration نیز User می‌تواند Referral Code وارد کند.

بازه زمانی مجاز این کار:

```text
TBD
```

---

# 21. Existing User Login

```text
Phone
 ↓
OTP
 ↓
Verify
 ↓
Existing User
 ↓
Home
```

Stateها:

```text
Wrong OTP
Expired OTP
Resend OTP
Rate Limit
Invalid Phone
SMS Error
Session Expired
```

---

# 22. Add To Cart Flow

```text
Product
 ↓
Add To Cart
 ↓
Validate Stock
 ↓
Add Item
 ↓
Update Cart Badge
```

اگر Product قبلاً وجود دارد:

```text
Increase Quantity
```

اگر Quantity بیشتر از Stock شود:

```text
Show Maximum Available Quantity
```

---

# 23. Cart Flow

Route:

```text
/cart
```

ساختار:

```text
Cart Items
 ↓
Quantity
 ↓
Price
 ↓
Discount
 ↓
Reward Per Item
 ↓
Subtotal
 ↓
Total Discount
 ↓
Total Reward
 ↓
Total Amount
 ↓
Confirm Cart
```

Actions:

```text
Increase Quantity
Decrease Quantity
Remove
Continue Shopping
```

قبل از Checkout:

```text
Validate Cart
├── Price Changed?
├── Stock Changed?
├── Product Unavailable?
└── Campaign Ended?
```

---

# 24. Checkout Flow

```text
Cart
 ↓
Confirm Cart
 ↓
Address
 ↓
Delivery
 ↓
Reward Usage
 ↓
Payment Method
 ↓
Review
 ↓
Payment
 ↓
Order Confirmation
```

---

# 25. Address Flow

اگر User آدرس دارد:

```text
Address List
 ↓
Select Address
 ↓
Continue
```

همیشه:

```text
+ Add New Address
```

اگر User آدرس ندارد:

```text
Add Address
 ↓
Province
City
Address
Postal Code
Plaque
Unit
Receiver Name
Phone
 ↓
Save
 ↓
Add To Account Addresses
 ↓
Select
```

---

# 26. Delivery Flow

```text
Selected Address
 ↓
Available Delivery Methods
 ↓
Select Delivery
```

مثال:

```text
ارسال عادی
ارسال سریع
```

در صورت نیاز:

```text
Select Date
Select Time Slot
```

---

# 27. Reward Usage at Checkout

```text
Checkout
 ↓
Reward Balance
 ↓
Use Reward?
```

اگر خیر:

```text
Reward Usage = 0
```

اگر بله:

```text
Apply Eligible Reward
 ↓
Recalculate Payment Amount
```

قانون قطعی:

```text
هزینه ارسال با پاداش قابل پرداخت نیست.
```

سقف Reward قابل استفاده در هر سفارش:

```text
TBD
```

نکته:
مبلغ پاداشی که هر Product **ایجاد می‌کند** با مقدار Rewardی که User اجازه دارد در Checkout **مصرف کند** دو مفهوم جدا هستند.

---

# 28. Payment Methods

```text
Online Gateway
Card To Card
```

Reward یک Payment Method مستقل نیست.

ابتدا Reward از مبلغ واجد شرایط کسر می‌شود و سپس باقی‌مانده با روش پرداخت انتخابی پرداخت می‌شود.

---

# 29. Online Payment Flow

```text
Select Online Payment
 ↓
Create Payment Request
 ↓
Redirect To Gateway
 ↓
Payment
 ↓
Callback
 ↓
Backend Verify
```

Success:

```text
Verified
 ↓
Order Confirmed
 ↓
Reward Active Immediately
```

Failed:

```text
Payment Failed
 ↓
Retry
or
Change Payment Method
```

Unknown:

```text
Payment Pending
 ↓
Check Status
```

---

# 30. Card To Card Flow

```text
Select Card To Card
 ↓
Show Sodaneh Bank Information
 ↓
User Transfers Money
 ↓
User Sends Receipt
 ↓
Order = Waiting For Payment Approval
 ↓
Admin Reviews Receipt
```

Admin:

```text
Approve
or
Reject
```

Approve:

```text
Order Confirmed
 ↓
Reward Active Immediately
```

Reject:

```text
Payment Rejected
 ↓
Notify User
```

تا قبل از تأیید Admin:

```text
Order is not confirmed.
Reward is not granted.
```

---

# 31. Order Finalization Rule

بعد از نهایی‌شدن سفارش:

```text
User Cancellation = Not Allowed
```

کاربر امکان Cancel ندارد.

---

# 32. Reward Activation

Reward در لحظه Confirm شدن Order فعال می‌شود.

Online:

```text
Payment Verified
 ↓
Order Confirmed
 ↓
Reward = Active
```

Card To Card:

```text
Receipt Approved
 ↓
Order Confirmed
 ↓
Reward = Active
```

---

# 33. Reward Expiration

```text
3 Months
```

قاعده:

```text
سه ماه از آخرین پاداش دریافتی
```

مدل:

```text
Rolling Expiration
```

مثال:

```text
1 Mehr
Reward Received
Expiry = 1 Dey

20 Aban
New Reward Received
New Expiry = 20 Bahman
```

---

# 34. Buyer Reward Flow

```text
Order Confirmed
 ↓
For Each Purchased Product
 ↓
Read buyerRewardAmount
 ↓
Create Reward Transaction
 ↓
Add To Wallet
 ↓
Reward Active
```

قاعده Reward نسبت به Quantity هنوز قطعی نشده است:

```text
Per Unit
or
Per Line Item
```

وضعیت:

```text
TBD
```

---

# 35. Direct Referrer Reward Flow

```text
Order Confirmed
 ↓
Buyer has Direct Referrer?
```

اگر خیر:

```text
No Referral Reward
```

اگر بله:

```text
For Each Purchased Product
 ↓
Read referrerRewardAmount
 ↓
Create Reward Transaction For Direct Referrer
 ↓
Add To Referrer Wallet
```

پردازش همین‌جا متوقف می‌شود.

```text
Do NOT check referrer's referrer.
```

---

# 36. Rewards Main Page

Route:

```text
/rewards
```

ساختار:

```text
Reward Balance
 ↓
Expiry Date
 ↓
Total Rewards Earned
 ↓
Buyer Rewards
 ↓
Referral Rewards
 ↓
Transactions
 ↓
Invite Friends
 ↓
My Friends
```

نمونه Transaction:

```text
+80,000
پاداش خرید
برنج هاشمی
```

یا:

```text
+30,000
پاداش معرفی
خرید مریم احمدی
```

---

# 37. Invite Friend Flow

```text
Rewards
 ↓
Invite Friends
 ↓
Referral Code
+
Referral Link
```

Actions:

```text
Copy Code
Copy Link
Native Share
```

---

# 38. My Friends

فقط Direct Inviteها:

```text
Friends I Directly Invited
```

هر Friend:

```text
Name
Join Date
Eligible Purchases
Total Reward Generated For Me
```

نباید نمایش داده شود:

```text
Friend of Friend
Level 2
Referral Tree
Downline
```

---

# 39. Orders

Route:

```text
/orders
```

Tabs:

```text
جاری
تحویل‌شده
همه
```

در صورت نیاز عملیاتی:

```text
لغوشده / بسته‌شده
```

Order Card:

```text
Order Number
Date
Status
Amount
Product Count
```

---

# 40. Order Detail

Route:

```text
/orders/[orderId]
```

ساختار:

```text
Order Status
Timeline
Products
Address
Delivery
Payment Method
Payment Status
Price Summary
Reward Earned
Support
```

Timeline:

```text
Order Created
 ↓
Payment Confirmed
 ↓
Preparing
 ↓
Shipped
 ↓
Delivered
```

---

# 41. Refund / Operational Reversal

User امکان Cancel بعد از Finalize ندارد.

ممکن است در شرایط عملیاتی مواردی مثل:

```text
عدم امکان تأمین
خطای مالی
خرابی
اشتباه ارسال
تصمیم پشتیبانی / Admin
```

رخ دهد.

Rule کامل Refund:

```text
TBD
```

Recommendation غیرقطعی:

```text
Reward مصرف‌شده در Refund به Wallet بازگردد.
Reward ایجادشده توسط Order Reverse شده نیز Reversal شود.
```

---

# 42. Minimum / Maximum Order

```text
Minimum Order:
TBD

Maximum Order:
TBD
```

---

# 43. Account

Route:

```text
/account
```

ساختار:

```text
Profile Summary
Personal Information
Addresses
Notifications
Support
Legal
Privacy
Logout
```

---

# 44. Profile

Route:

```text
/account/profile
```

Fields:

```text
Phone
First Name
Last Name
Birth Date
National ID
```

---

# 45. Address Management

```text
/account/addresses
```

Actions:

```text
Add
Edit
Delete
Set Default
```

---

# 46. Notifications

Route:

```text
/account/notifications
```

Types:

```text
Order Created
Payment Confirmed
Order Shipped
Order Delivered
Reward Received
Referral Reward Received
Card To Card Approved
Card To Card Rejected
Important Campaign
```

Deep Link:

```text
Order Notification → Order Detail
Reward Notification → Rewards
```

---

# 47. Support

Route:

```text
/account/support
```

ساختار:

```text
FAQ
Contact Support
Submit Ticket
Track Ticket
```

---

# 48. Product Reviews

```text
Delivered Order
 ↓
Write Review
 ↓
Rating
 ↓
Comment
 ↓
Submit
```

---

# 49. Empty / Error States

```text
Empty Cart
No Orders
No Rewards
No Friends
No Addresses
No Notifications
No Search Result
No Products
Network Error
Server Error
Unauthorized
Forbidden
Not Found
Payment Failed
Payment Pending
```

---

# 50. PWA

فقط Customer App:

```text
app.sodaneh.ir
```

قابلیت‌ها:

```text
Installable
Standalone Mode
Manifest
App Icon
Safe Area
Mobile Navigation
Offline State
```

Checkout و Payment در Offline نباید انجام شوند.

---

# 51. Super Admin

دامنه:

```text
https://admin.sodaneh.ir
```

ساختار:

```text
Desktop First
Responsive
RTL
```

Layout:

```text
Sidebar
+
Topbar
+
Breadcrumb
+
Main Content
```

---

# 52. Admin Navigation

```text
عملیات
├── داشبورد
├── سفارشات
├── گزارش فروش
├── فروش ویژه
└── رصد تقلب

مشتریان و شبکه
├── مشتریان
├── معرفی‌ها
└── پاداش‌ها

کاتالوگ
├── کالاها
└── دسته‌بندی‌ها

یکپارچه‌سازی
├── حسابداری
├── درگاه‌ها
└── SMS

سیستم
├── کاربران
├── دسترسی‌ها
└── تنظیمات
```

---

# 53. Admin Product Definition

برای هر Product:

```text
General Information
Images
Category
Unit
Description
Price
Discount
Stock
Buyer Reward Amount
Direct Referrer Reward Amount
Dynamic Attributes
Payment / Visibility Settings
```

Reward Fields:

```text
پاداش خریدار:
[ ______ ] تومان

پاداش معرف مستقیم:
[ ______ ] تومان
```

---

# 54. Admin Orders

```text
Order Information
Customer
Products
Address
Delivery
Payment
Reward Transactions
Timeline
Internal Notes
```

برای Card To Card:

```text
Receipt
Payment Information
Approve
Reject
```

Approve:

```text
Order Confirmed
+
Reward Created Immediately
```

---

# 55. Admin Reward Management

Admin بتواند:

```text
مشاهده Reward Transactions
Filter By User
Filter By Order
Filter By Type
Filter By Date
View Buyer Rewards
View Referral Rewards
View Expiry Date
```

Types:

```text
BUYER_REWARD
DIRECT_REFERRAL_REWARD
REWARD_USAGE
REWARD_REVERSAL
ADMIN_ADJUSTMENT
```

---

# 56. User Model

```text
User
├── id
├── phone
├── firstName
├── lastName
├── birthDate
├── nationalId
├── referralCode
└── referredByUserId
```

---

# 57. Product Model

```text
Product
├── id
├── name
├── slug
├── sku
├── category
├── images
├── price
├── discount
├── finalPrice
├── stock
├── buyerRewardAmount
├── referrerRewardAmount
├── attributes
└── status
```

---

# 58. Reward Transaction Model

```text
RewardTransaction
├── id
├── userId
├── orderId
├── orderItemId
├── productId
├── type
├── amount
├── status
├── createdAt
└── expiryReference
```

---

# 59. Order Status پیشنهادی

```text
CREATED
WAITING_FOR_PAYMENT
WAITING_FOR_TRANSFER_APPROVAL
CONFIRMED
PREPARING
SHIPPED
DELIVERED
PAYMENT_REJECTED
REVERSED
```

---

# 60. Payment Status پیشنهادی

```text
PENDING
PAID
FAILED
WAITING_FOR_APPROVAL
APPROVED
REJECTED
REFUNDED
```

---

# 61. معماری Frontend Customer App

```text
apps/customer/
└── src/
    ├── app/
    ├── components/
    │   ├── ui/
    │   ├── shared/
    │   └── layout/
    ├── features/
    │   ├── auth/
    │   ├── home/
    │   ├── search/
    │   ├── categories/
    │   ├── products/
    │   ├── special/
    │   ├── cart/
    │   ├── checkout/
    │   ├── payment/
    │   ├── orders/
    │   ├── rewards/
    │   ├── account/
    │   ├── addresses/
    │   ├── notifications/
    │   └── support/
    ├── services/
    ├── store/
    ├── schemas/
    ├── types/
    ├── hooks/
    ├── utils/
    └── styles/
```

---

# 62. State Management

Server State:

```text
TanStack Query
```

برای:

```text
Products
Categories
Orders
Rewards
Wallet
Profile
Addresses
Campaigns
Admin Reports
```

Client State:

```text
Zustand
```

برای:

```text
Cart
Checkout
UI
Temporary Filters
```

---

# 63. API Architecture

```text
Page
 ↓
Feature
 ↓
Hook
 ↓
Service
 ↓
API Client
```

Server State:

```text
API
 ↓
TanStack Query
 ↓
Feature Hook
 ↓
Component
```

---

# 64. API Base URL

```text
NEXT_PUBLIC_API_URL=https://api.sodaneh.ir
```

---

# 65. Standard Ecommerce Flows

تمام Flowهای استاندارد فروشگاه آنلاین حتی اگر تک‌تک در این سند نیامده باشند، پیش‌فرض محصول هستند:

```text
Product Discovery
Search
Category Browsing
Filters
Sorting
Product Detail
Stock Handling
Add To Cart
Remove From Cart
Quantity Change
Cart Validation
Address Management
Delivery Selection
Payment Failure
Payment Retry
Order Tracking
Notifications
Support
Empty States
Loading States
Error States
Reviews
Responsive States
Session Handling
```

---

# 66. Business Rules قطعی

```text
1. هر Product یک Buyer Reward Amount دارد.

2. هر Product یک Direct Referrer Reward Amount دارد.

3. Reward مبلغ ثابت تومان است.

4. فقط Direct Referrer Reward وجود دارد.

5. Referral چندسطحی یا هرمی وجود ندارد.

6. Reward بلافاصله بعد از Order Confirmation فعال می‌شود.

7. Online Order بعد از Verify موفق Confirm می‌شود.

8. Card To Card بعد از تأیید رسید توسط Admin Confirm می‌شود.

9. Reward در Card To Card قبل از Admin Approval ایجاد نمی‌شود.

10. Reward Expiry = سه ماه از آخرین Reward دریافت‌شده.

11. Shipping Cost با Reward قابل پرداخت نیست.

12. User بعد از Finalize Order امکان Cancel ندارد.

13. Referral می‌تواند هنگام Registration ثبت شود.

14. Referral Link می‌تواند Code را به‌صورت خودکار اعمال کند.

15. User بعد از Registration نیز می‌تواند Referral Code وارد کند.

16. Product Reward Amountها توسط Admin برای هر کالا مستقل تعریف می‌شوند.
```

---

# 67. موارد TBD

```text
1. حداقل مبلغ سفارش

2. حداکثر مبلغ سفارش

3. سقف Reward قابل استفاده در هر Order

4. Reward بر اساس Quantity:
   Per Unit یا Per Line Item

5. بازه زمانی مجاز برای ثبت Referral Code بعد از Registration

6. Rule کامل Refund / Operational Reversal

7. Policy کامل Return / مرجوعی

8. در صورت Refund، نحوه دقیق بازگشت Reward مصرف‌شده

9. نحوه Reverse شدن Reward دریافت‌شده در سفارش Refund شده
```

---

# 68. Recommendationهای غیرقطعی

```text
1. Reward بهتر است Per Unit محاسبه شود.

2. Direct Referrer پس از ثبت معتبر بهتر است قابل تغییر آزادانه نباشد.

3. Refund بهتر است فقط توسط Admin / Support انجام شود.

4. Reward ایجادشده توسط Order Reverse شده باید Reversal شود.

5. Reward پرداخت‌شده در Order Refund شده بهتر است به Wallet بازگردد.

6. User-facing Referral UI نباید Tree یا Level داشته باشد.

7. اصطلاح رسمی:
   Direct Referral Reward
   به‌جای MLM / Two-Level Network
```

---

# 69. Journey اصلی سودانه

```text
User Enters
 ↓
Login / Register
 ↓
Home
 ↓
Search / Category / Special
 ↓
Product Detail
 ↓
See:
Price
Buyer Reward
Direct Referrer Reward
 ↓
Add To Cart
 ↓
Cart
 ↓
Address
 ↓
Delivery
 ↓
Use Reward?
 ↓
Payment Method
 ↓
Payment
 ↓
Order Confirmed
 ↓
Buyer Reward Active
 ↓
Direct Referrer Reward Active
 ↓
Order Tracking
 ↓
Reward Wallet
 ↓
Use Reward In Future Purchase
```

---

# 70. Referral Journey

```text
User A
 ↓
Shares Referral Link
 ↓
User B Opens Link
 ↓
Referral Code Saved
 ↓
B Registers
 ↓
A Becomes Direct Referrer
 ↓
B Buys Product
 ↓
B Receives Buyer Reward
 ↓
A Receives Direct Referrer Reward
```

اگر B کاربر C را معرفی کند:

```text
C Buys
 ↓
C Gets Buyer Reward
 ↓
B Gets Direct Referrer Reward
 ↓
A Gets Nothing
```

---

# 71. Card To Card Journey

```text
Checkout
 ↓
Card To Card
 ↓
Bank Information
 ↓
User Transfers
 ↓
User Sends Receipt
 ↓
Waiting For Admin Approval
 ↓
Admin Reviews
 ↓
Approve
 ↓
Order Confirmed
 ↓
Rewards Active
```

یا:

```text
Admin Rejects
 ↓
Payment Rejected
 ↓
User Notification
```

---

# 72. خلاصه ساختار نهایی

```text
Sodaneh
│
├── sodaneh.ir
│   ├── Landing
│   ├── Blog
│   └── Blog Article
│
├── app.sodaneh.ir
│   ├── Home
│   ├── Special
│   ├── Search
│   ├── Categories
│   ├── Products
│   ├── Cart
│   ├── Checkout
│   ├── Payment
│   ├── Orders
│   ├── Rewards
│   └── Account
│
└── admin.sodaneh.ir
    ├── Dashboard
    ├── Orders
    ├── Reports
    ├── Campaigns
    ├── Customers
    ├── Referrals
    ├── Rewards
    ├── Products
    ├── Categories
    ├── Integrations
    ├── Users
    ├── Permissions
    └── Settings
```

---

# 73. اصل معماری محصول

سودانه باید در UI و Backend به‌عنوان:

```text
E-commerce
+
Reward Wallet
+
Direct Referral Reward
```

مدل‌سازی شود.

نباید به‌عنوان:

```text
MLM
Multi-Level Referral
Pyramid Network
Two-Level Commission Tree
```

پیاده‌سازی شود.

هسته Business Logic:

```text
هر خرید
├── پاداش برای خریدار
└── پاداش برای معرف مستقیم خریدار

و تمام.
```

---

**پایان سند**
