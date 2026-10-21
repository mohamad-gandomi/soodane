'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './landing.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '/';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="landing-scope">
      {/* 1. Announcement Banner */}
      <a
        className="announcement"
        href={`${APP_URL}/special`}
        aria-label="مشاهده تخفیف‌های ویژه"
      >
        <img src="/assets/promotions/top-promo.gif" alt="تخفیف‌های ویژه سودانه" />
      </a>

      {/* 2. Navigation */}
      <div className="nav-wrap">
        <nav
          className={`nav ${menuOpen ? 'menu-open' : ''}`}
          aria-label="ناوبری اصلی"
        >
          <a className="brand" href="#top">
            <span className="brand-mark" aria-hidden="true"></span>
            سودانه
          </a>

          <div className="nav-links">
            <a href="#features" onClick={() => setMenuOpen(false)}>
              چرا سودانه
            </a>
            <a href="#platform" onClick={() => setMenuOpen(false)}>
              ویژگی‌های پلتفرم
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              چطور کار می‌کند
            </a>
            <a href="#rewards" onClick={() => setMenuOpen(false)}>
              پاداش‌ها
            </a>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>
              سودانه مگ
            </Link>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              سوالات متداول
            </a>
          </div>

          <a className="nav-cta" href={`${APP_URL}/auth`}>
            ثبت نام
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label="باز کردن منو"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </nav>
      </div>

      <main id="top">
        {/* 3. Hero Section */}
        <section className="hero">
          <div className="hero-inner">
            <div>
              <span className="eyebrow">خرید هوشمند با پاداش واقعی</span>
              <h1>
                خرید روزمره را به <em>پاداش بیشتر</em> تبدیل کن.
              </h1>
              <p className="hero-copy">
                سودانه یک تجربهٔ ساده و یکپارچه برای خرید کالاهای روزمره، استفاده
                از تخفیف‌های ویژه و دریافت پاداش خرید است.
              </p>
              <div className="hero-actions">
                <a className="button-primary" href={`${APP_URL}/auth`}>
                  ثبت نام رایگان در سودانه
                </a>
                <a className="button-secondary" href={APP_URL}>
                  مشاهده تجربهٔ اپلیکیشن
                </a>
              </div>
              <div className="hero-note">
                <span>تخفیف‌های روزانه</span>
                <span>پاداش خرید</span>
                <span>پیگیری شفاف سفارش</span>
              </div>
            </div>

            <div className="hero-products" aria-label="نمونه‌ای از کالاهای سودانه">
              <div className="hero-card rice">
                <img src="/assets/products/rice.png" alt="برنج هاشمی" />
              </div>
              <div className="hero-card oil">
                <img src="/assets/products/oil.jpg" alt="روغن سرخ‌کردنی" />
              </div>
              <div className="hero-card tea">
                <img src="/assets/products/tea.jpg" alt="چای سیاه" />
              </div>
              <div className="reward-float">
                پاداش خرید فعال<b>+ ۱۲٬۰۰۰ تومان</b>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Features Section */}
        <section id="features" className="section">
          <div className="section-head">
            <span className="section-kicker">چرا سودانه؟</span>
            <h2 className="section-title">
              همه‌چیز برای یک خرید لذت‌بخش و قابل‌پیگیری
            </h2>
            <p className="section-copy">
              از انتخاب محصول تا دریافت پاداش و پیگیری تحویل، سودانه خرید روزمره
              را ساده‌تر می‌کند.
            </p>
          </div>
          <div className="benefits">
            <article className="benefit">
              <span className="benefit-icon">
                <i className="fa-solid fa-gift" aria-hidden="true"></i>
              </span>
              <h3>پاداش برای هر خرید</h3>
              <p>
                روی کالاهای واجد شرایط پاداش بگیرید و در خریدهای بعدی از آن
                استفاده کنید.
              </p>
            </article>
            <article className="benefit">
              <span className="benefit-icon">
                <i className="fa-solid fa-tags" aria-hidden="true"></i>
              </span>
              <h3>تخفیف‌های انتخاب‌شده</h3>
              <p>
                پیشنهادهای ویژه و تخفیف‌های روزانه را در یک تجربهٔ ساده پیدا کنید.
              </p>
            </article>
            <article className="benefit">
              <span className="benefit-icon">
                <i className="fa-solid fa-truck-fast" aria-hidden="true"></i>
              </span>
              <h3>پیگیری شفاف سفارش</h3>
              <p>
                از آماده‌سازی تا تحویل، وضعیت سفارش و جزئیات خریدتان در دسترس
                است.
              </p>
            </article>
          </div>
        </section>

        {/* 5. Platform Section */}
        <section id="platform" className="platform-section">
          <div className="section">
            <div className="section-head">
              <span className="section-kicker">یک اکوسیستم، سه لایهٔ به‌هم‌پیوسته</span>
              <h2 className="section-title">ویژگی‌های پلتفرم سودانه</h2>
              <p className="section-copy">
                سودانه فقط یک ویترین خرید نیست؛ تجربهٔ مشتری، اجرای سفارش و
                مدیریت کسب‌وکار را در یک جریان قابل‌پیگیری کنار هم قرار می‌دهد.
              </p>
            </div>
            <div className="platform-grid">
              <article className="platform-card customer">
                <div className="platform-icon">
                  <i
                    className="fa-solid fa-mobile-screen-button"
                    aria-hidden="true"
                  ></i>
                </div>
                <span className="platform-label">تجربه مشتری</span>
                <h3>خرید ساده، پاداش روشن</h3>
                <p>
                  جست‌وجوی کالا، سبد خرید، Checkout یک‌صفحه‌ای، کیف پول پاداش و
                  پیگیری وضعیت سفارش در یک اپلیکیشن.
                </p>
                <ul>
                  <li>جست‌وجو، فیلتر و پیشنهادهای ویژه</li>
                  <li>پاداش قابل استفاده در سفارش بعدی</li>
                  <li>آدرس، ارسال و پرداخت شفاف</li>
                </ul>
              </article>
              <article className="platform-card operations">
                <div className="platform-icon">
                  <i className="fa-solid fa-boxes-stacked" aria-hidden="true"></i>
                </div>
                <span className="platform-label">عملیات فروشگاه</span>
                <h3>سفارش و انبار هماهنگ</h3>
                <p>
                  مدیریت جریان سفارش از ثبت تا آماده‌سازی و تحویل، با دید بهتر
                  روی موجودی و شیوه ارسال.
                </p>
                <ul>
                  <li>وضعیت‌های مشخص سفارش</li>
                  <li>کنترل موجودی و کاهش خطای آماده‌سازی</li>
                  <li>هماهنگی ارسال و اطلاع‌رسانی تحویل</li>
                </ul>
              </article>
              <article className="platform-card management">
                <div className="platform-icon">
                  <i className="fa-solid fa-chart-line" aria-hidden="true"></i>
                </div>
                <span className="platform-label">مدیریت و رشد</span>
                <h3>داده برای تصمیم بهتر</h3>
                <p>
                  داشبورد مدیریتی برای مشاهده روند فروش، تخفیف‌ها، پاداش‌ها و
                  خلاصه حسابداری اولیه.
                </p>
                <ul>
                  <li>گزارش فروش و عملکرد کالاها</li>
                  <li>نمایش هزینه، تخفیف و پاداش</li>
                  <li>نمای کلی عملیات روزانه</li>
                </ul>
              </article>
            </div>
            <div className="platform-flow" aria-label="جریان یکپارچه سودانه">
              <div>
                <b>۱</b>
                <span>مشتری سفارش می‌دهد</span>
              </div>
              <i></i>
              <div>
                <b>۲</b>
                <span>فروشگاه آماده می‌کند</span>
              </div>
              <i></i>
              <div>
                <b>۳</b>
                <span>سفارش ارسال و پیگیری می‌شود</span>
              </div>
              <i></i>
              <div>
                <b>۴</b>
                <span>داده فروش و پاداش ثبت می‌شود</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. How it works */}
        <section id="how-it-works" className="steps-wrap">
          <div className="section">
            <div className="section-head">
              <span className="section-kicker">ساده و سریع</span>
              <h2 className="section-title">سودانه چطور کار می‌کند؟</h2>
              <p className="section-copy">
                پاداش سودانه اعتبار خرید است؛ قابل برداشت یا تبدیل به وجه نقد
                نیست و فقط برای خرید کالاهای واجد شرایط در خود سودانه استفاده
                می‌شود.
              </p>
            </div>
            <div className="steps">
              <article className="step">
                <h3>کالای موردنظرت را پیدا کن</h3>
                <p>
                  با جستجو، دسته‌بندی و فیلترهای دقیق، محصول مناسب را انتخاب کن.
                </p>
              </article>
              <article className="step">
                <h3>سفارش را ثبت کن</h3>
                <p>
                  آدرس، روش ارسال و شیوهٔ پرداخت را انتخاب کن و سفارش را نهایی
                  کن.
                </p>
              </article>
              <article className="step">
                <h3>پاداشت را در خرید بعدی استفاده کن</h3>
                <p>
                  پس از تأیید سفارش، پاداش خرید در کیف پول سودانه فعال می‌شود؛
                  این اعتبار فقط هنگام خرید از سودانه قابل استفاده است و امکان
                  برداشت نقدی ندارد.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 7. Rewards Layout */}
        <section id="rewards" className="section">
          <div className="rewards-layout">
            <div className="wallet-mock">
              <div className="wallet-top">
                <span>کیف پول پاداش سودانه</span>
                <span className="wallet-chip"></span>
              </div>
              <div className="wallet-amount">
                ۳۸۰٬۰۰۰ <small>تومان</small>
              </div>
              <p className="wallet-note">موجودی قابل استفاده تا ۲۸ آذر</p>
              <div className="wallet-reward">
                <span>پاداش خرید جدید</span>
                <b>+ ۱۲٬۰۰۰ تومان</b>
              </div>
            </div>
            <div className="rewards-copy">
              <span className="section-kicker">کیف پول پاداش</span>
              <h2>خرید کن، پاداش بگیر، در خرید بعدی استفاده کن.</h2>
              <p>
                پاداش سودانه یک مسیر روشن و قابل‌فهم دارد؛ مبلغ پاداش هر کالا را
                همان‌جا می‌بینی و هنگام Checkout انتخاب می‌کنی که از آن استفاده
                شود.
              </p>
              <div className="check-list">
                <div>
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                  نمایش شفاف پاداش روی کارت هر محصول
                </div>
                <div>
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                  کیف پول یکپارچه و تاریخ اعتبار مشخص
                </div>
                <div>
                  <i className="fa-solid fa-check" aria-hidden="true"></i>
                  مدل معرفی مستقیم، بدون ساختار چندسطحی
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. Stats Section */}
        <section className="stats">
          <div className="section">
            <div className="stats-grid">
              <div className="stat">
                <strong>+۱٬۵۶۰٬۰۰۰</strong>
                <span>تومان پاداش ثبت‌شده</span>
              </div>
              <div className="stat">
                <strong>۴.۸ / ۵</strong>
                <span>میانگین رضایت کاربران</span>
              </div>
              <div className="stat">
                <strong>۱ تا ۲ روز</strong>
                <span>بازهٔ ارسال عادی</span>
              </div>
              <div className="stat">
                <strong>۶ دسته</strong>
                <span>دسته‌بندی اصلی کالا</span>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Mag Section */}
        <section id="mag" className="mag-section">
          <div className="section">
            <div className="section-head">
              <span className="section-kicker">از سودانه مگ</span>
              <h2 className="section-title">
                راهنمای خرید آگاهانه و تجربه بهتر با سودانه
              </h2>
              <p className="section-copy">
                مقاله‌های کوتاه و کاربردی برای مدیریت بهتر خرید روزمره، استفاده
                از پاداش و پیگیری سفارش‌ها.
              </p>
            </div>
            <div className="mag-layout">
              <article className="mag-feature">
                <span className="mag-tag">مقاله منتخب</span>
                <h3>
                  راهنمای پاداش سودانه؛ از دریافت تا استفاده در سفارش بعدی
                </h3>
                <p>
                  با مسیر ثبت پاداش، مشاهده تراکنش‌ها و انتخاب آن هنگام Checkout
                  آشنا شوید.
                </p>
                <Link href="/blog/rewards">
                  خواندن مقاله <span>←</span>
                </Link>
              </article>
              <div className="mag-list">
                <article className="mag-post">
                  <Link
                    className="mag-post-art amber"
                    href="/blog/shopping"
                    aria-label="خواندن مقاله خرید روزمره هوشمند"
                  >
                    <img
                      src="/assets/products/tea.jpg"
                      alt="راهنمای خرید روزمره هوشمند"
                    />
                  </Link>
                  <div className="mag-post-copy">
                    <div className="mag-post-meta">
                      <strong>راهنمای خرید</strong>
                      <i></i>
                      <span>۴ دقیقه مطالعه</span>
                    </div>
                    <h3>
                      چطور خرید روزمره را سریع‌تر و به‌صرفه‌تر انجام دهیم؟
                    </h3>
                    <p>
                      چند عادت ساده برای انتخاب هدفمند، بررسی تخفیف و پاداش
                      کالاها.
                    </p>
                    <Link href="/blog/shopping">ادامه مطلب ←</Link>
                  </div>
                </article>
                <article className="mag-post">
                  <Link
                    className="mag-post-art blue"
                    href="/blog/order"
                    aria-label="خواندن مقاله پیگیری سفارش"
                  >
                    <img src="/assets/products/oil.jpg" alt="پیگیری سفارش سودانه" />
                  </Link>
                  <div className="mag-post-copy">
                    <div className="mag-post-meta">
                      <strong>سفارش</strong>
                      <i></i>
                      <span>۳ دقیقه مطالعه</span>
                    </div>
                    <h3>
                      پیگیری سفارش در سودانه؛ هر مرحله چه معنایی دارد؟
                    </h3>
                    <p>
                      از تأیید پرداخت تا تحویل، مسیر سفارش را شفاف و
                      مرحله‌به‌مرحله ببینید.
                    </p>
                    <Link href="/blog/order">ادامه مطلب ←</Link>
                  </div>
                </article>
              </div>
            </div>
            <Link className="mag-all" href="/blog">
              مشاهده همه مقاله‌های سودانه مگ <span>←</span>
            </Link>
          </div>
        </section>

        {/* 10. FAQ Section */}
        <section id="faq" className="section">
          <div className="section-head">
            <span className="section-kicker">پرسش‌های متداول</span>
            <h2 className="section-title">هرچه لازم است بدانید</h2>
          </div>
          <div className="faq">
            <article className={`faq-item ${openFaq === 0 ? 'open' : ''}`}>
              <button
                className="faq-question"
                type="button"
                onClick={() => toggleFaq(0)}
              >
                پاداش خرید چه زمانی فعال می‌شود؟ <i>›</i>
              </button>
              <p className="faq-answer">
                پس از تأیید نهایی سفارش، پاداش خرید در کیف پول سودانه ثبت و قابل
                استفاده می‌شود.
              </p>
            </article>
            <article className={`faq-item ${openFaq === 1 ? 'open' : ''}`}>
              <button
                className="faq-question"
                type="button"
                onClick={() => toggleFaq(1)}
              >
                آیا می‌توانم از پاداش برای هزینه ارسال استفاده کنم؟ <i>›</i>
              </button>
              <p className="faq-answer">
                پاداش از مبلغ کالاهای واجد شرایط کسر می‌شود و هزینهٔ ارسال از آن
                مستثنا است.
              </p>
            </article>
            <article className={`faq-item ${openFaq === 2 ? 'open' : ''}`}>
              <button
                className="faq-question"
                type="button"
                onClick={() => toggleFaq(2)}
              >
                پاداش معرفی چطور محاسبه می‌شود؟ <i>›</i>
              </button>
              <p className="faq-answer">
                با خرید مستقیم دوست دعوت‌شده، پاداش معرفی همان محصول برای معرف
                ثبت می‌شود.
              </p>
            </article>
          </div>
        </section>

        {/* 11. Final CTA */}
        <section className="final-cta">
          <h2>آماده‌ای خریدت پاداش داشته باشد؟</h2>
          <p>
            همین حالا به سودانه بپیوند و تجربهٔ خرید روزمره را ساده‌تر کن.
          </p>
          <div className="hero-actions">
            <a className="button-primary" href={`${APP_URL}/auth`}>
              شروع رایگان
            </a>
            <a className="button-secondary" href={`${APP_URL}/special`}>
              دیدن فروش‌های ویژه
            </a>
          </div>
        </section>
      </main>

      {/* 12. Site Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <a className="brand" href="#top">
              <span className="brand-mark" aria-hidden="true"></span>
              سودانه
            </a>
            <p>
              پلتفرم خرید روزمره، پاداش و مدیریت یکپارچه سفارش؛ از انتخاب کالا
              تا تحویل و خرید بعدی.
            </p>
            <div className="footer-social" aria-label="شبکه‌های اجتماعی">
              <a
                href="#"
                data-network="instagram"
                aria-label="اینستاگرام سودانه"
                title="اینستاگرام"
              >
                <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
              <a
                href="#"
                data-network="telegram"
                aria-label="تلگرام سودانه"
                title="تلگرام"
              >
                <i className="fa-brands fa-telegram" aria-hidden="true"></i>
              </a>
              <a
                href="#"
                data-network="youtube"
                aria-label="یوتیوب سودانه"
                title="یوتیوب"
              >
                <i className="fa-brands fa-youtube" aria-hidden="true"></i>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div>
              <h3>سودانه</h3>
              <a href="#features">چرا سودانه</a>
              <a href="#platform">ویژگی‌های پلتفرم</a>
              <a href="#rewards">باشگاه پاداش</a>
              <Link href="/blog">سودانه مگ</Link>
            </div>
            <div>
              <h3>راهنما و پشتیبانی</h3>
              <a href="#faq">سوالات متداول</a>
              <a href={`${APP_URL}/support`}>ارتباط با پشتیبانی</a>
              <a href={`${APP_URL}/legal`}>قوانین و حریم خصوصی</a>
              <a href={`${APP_URL}/auth`}>ساخت حساب</a>
            </div>
          </div>

          <div className="footer-trust">
            <div
              className="enamad-placeholder"
              aria-label="محل نمایش نماد اعتماد الکترونیکی"
            >
              <span className="enamad-mark">
                نماد
                <br />
                اعتماد
              </span>
              <div>
                <b>نماد اعتماد الکترونیکی</b>
                <small>محل نمایش نماد پس از تأیید مجوز</small>
              </div>
            </div>
            <p>
              برای پیگیری سفارش یا دریافت راهنمایی، از بخش پشتیبانی سودانه
              استفاده کنید.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© ۱۴۰۵ سودانه. همه حقوق محفوظ است.</span>
          <span>خرید روزمره، تخفیف و پاداش در یک تجربهٔ واحد</span>
        </div>
      </footer>
    </div>
  );
}
