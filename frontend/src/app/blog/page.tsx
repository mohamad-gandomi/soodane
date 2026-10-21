'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import './blog.css';
import { blogService } from '@/services/blog.service';
import { BlogPost } from '@/types/blog';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '/';

interface BlogArticleItem {
  slug: string;
  category: string;
  label: string;
  date: string;
  read: string;
  image: string;
  tone: string;
  title: string;
  excerpt: string;
}

const STATIC_ARTICLES: BlogArticleItem[] = [
  {
    slug: 'rewards',
    category: 'reward',
    label: 'پاداش',
    date: '۸ مهر ۱۴۰۵',
    read: '۵ دقیقه مطالعه',
    image: '/assets/products/rice.png',
    tone: '',
    title: 'راهنمای پاداش سودانه؛ از دریافت تا استفاده در سفارش بعدی',
    excerpt:
      'پاداش خرید چیست، چه زمانی در کیف پول ثبت می‌شود و چطور در مرحله تکمیل سفارش از آن استفاده کنید؟',
  },
  {
    slug: 'shopping',
    category: 'shopping',
    label: 'راهنمای خرید',
    date: '۳ مهر ۱۴۰۵',
    read: '۴ دقیقه مطالعه',
    image: '/assets/products/tea.jpg',
    tone: 'amber',
    title: 'چطور خرید روزمره را سریع‌تر و به‌صرفه‌تر انجام دهیم؟',
    excerpt:
      'چند عادت ساده برای انتخاب هدفمند، بررسی تخفیف و پاداش کالاها.',
  },
  {
    slug: 'order',
    category: 'order',
    label: 'سفارش',
    date: '۲۷ شهریور ۱۴۰۵',
    read: '۳ دقیقه مطالعه',
    image: '/assets/products/oil.jpg',
    tone: 'blue',
    title: 'پیگیری سفارش در سودانه؛ هر مرحله چه معنایی دارد؟',
    excerpt:
      'از تأیید پرداخت تا تحویل، مسیر سفارش را شفاف و مرحله‌به‌مرحله ببینید.',
  },
  {
    slug: 'business',
    category: 'business',
    label: 'کسب‌وکار',
    date: '۲۲ شهریور ۱۴۰۵',
    read: '۶ دقیقه مطالعه',
    image: '/assets/products/tissue.jpg',
    tone: 'lilac',
    title: 'چرا سفارش، انبار و گزارش باید کنار هم باشند؟',
    excerpt:
      'نگاهی به نقش عملیات یکپارچه در تجربه بهتر مشتری و تیم فروش.',
  },
  {
    slug: 'reward-expiry',
    category: 'reward',
    label: 'پاداش',
    date: '۱۷ شهریور ۱۴۰۵',
    read: '۴ دقیقه مطالعه',
    image: '/assets/products/rice.png',
    tone: '',
    title: 'چطور تاریخ اعتبار پاداش‌ها را مدیریت کنیم؟',
    excerpt:
      'با مشاهده تراکنش‌ها و برنامه‌ریزی سفارش بعدی، پاداش قابل استفاده را از دست ندهید.',
  },
  {
    slug: 'cart-planning',
    category: 'shopping',
    label: 'راهنمای خرید',
    date: '۱۲ شهریور ۱۴۰۵',
    read: '۵ دقیقه مطالعه',
    image: '/assets/products/tea.jpg',
    tone: 'amber',
    title: 'سبد خرید هفتگی را با چند قدم ساده بچینید',
    excerpt:
      'یک الگوی ساده برای خرید اقلام ضروری، کنترل هزینه و کاهش خریدهای تکراری.',
  },
  {
    slug: 'delivery-windows',
    category: 'order',
    label: 'سفارش',
    date: '۷ شهریور ۱۴۰۵',
    read: '۳ دقیقه مطالعه',
    image: '/assets/products/oil.jpg',
    tone: 'blue',
    title: 'انتخاب روش ارسال؛ چطور زمان تحویل مناسب‌تری داشته باشیم؟',
    excerpt:
      'تفاوت ارسال عادی و سریع و نکاتی برای انتخاب درست‌تر در مرحله Checkout.',
  },
  {
    slug: 'inventory-basics',
    category: 'business',
    label: 'کسب‌وکار',
    date: '۲ شهریور ۱۴۰۵',
    read: '۷ دقیقه مطالعه',
    image: '/assets/products/tissue.jpg',
    tone: 'lilac',
    title: 'کنترل موجودی؛ نقطه شروع یک تجربه قابل اعتماد',
    excerpt:
      'چرا موجودی دقیق، خطای آماده‌سازی و لغو سفارش را کاهش می‌دهد؟',
  },
  {
    slug: 'direct-invite',
    category: 'reward',
    label: 'پاداش',
    date: '۲۸ مرداد ۱۴۰۵',
    read: '۴ دقیقه مطالعه',
    image: '/assets/products/rice.png',
    tone: '',
    title: 'پاداش معرفی مستقیم در سودانه چگونه محاسبه می‌شود؟',
    excerpt:
      'با منطق معرفی مستقیم و شیوه ثبت پاداش برای خریدهای واجد شرایط آشنا شوید.',
  },
  {
    slug: 'checkout-guide',
    category: 'shopping',
    label: 'راهنمای خرید',
    date: '۲۳ مرداد ۱۴۰۵',
    read: '۴ دقیقه مطالعه',
    image: '/assets/products/tea.jpg',
    tone: 'amber',
    title: 'راهنمای Checkout؛ از آدرس تا پرداخت در یک صفحه',
    excerpt:
      'مرور کوتاه آدرس تحویل، روش ارسال، استفاده از پاداش و انتخاب نوع پرداخت.',
  },
  {
    slug: 'invoice-guide',
    category: 'order',
    label: 'سفارش',
    date: '۱۸ مرداد ۱۴۰۵',
    read: '۳ دقیقه مطالعه',
    image: '/assets/products/oil.jpg',
    tone: 'blue',
    title: 'فاکتور سفارش را از کجا دانلود کنیم؟',
    excerpt:
      'جزئیات مبلغ، تخفیف، هزینه ارسال و مسیر دریافت فاکتور در صفحه سفارش.',
  },
  {
    slug: 'sales-dashboard',
    category: 'business',
    label: 'کسب‌وکار',
    date: '۱۳ مرداد ۱۴۰۵',
    read: '۶ دقیقه مطالعه',
    image: '/assets/products/tissue.jpg',
    tone: 'lilac',
    title: 'گزارش فروش روزانه چه کمکی به فروشگاه می‌کند؟',
    excerpt:
      'سه نمای کلیدی برای دیدن روند فروش، تخفیف و پاداش در عملیات روزانه.',
  },
];

const LABELS: Record<string, [string, string]> = {
  all: ['آخرین مقاله‌ها', 'مطالب تازه سودانه مگ را دنبال کنید'],
  reward: ['مقاله‌های پاداش', 'راهنمای دریافت و استفاده از پاداش خرید'],
  shopping: ['راهنمای خرید', 'انتخاب دقیق‌تر برای خریدهای روزمره'],
  order: ['راهنمای سفارش', 'پیگیری شفاف مراحل سفارش'],
  business: ['مقاله‌های کسب‌وکار', 'مدیریت بهتر جریان فروش و عملیات'],
};

const PER_PAGE = 6;
const fa = (num: number) => num.toLocaleString('fa-IR');

function getTone(categoryName?: string, slug?: string): string {
  const text = `${categoryName || ''} ${slug || ''}`.toLowerCase();
  if (text.includes('خرید') || text.includes('shopping')) return 'amber';
  if (text.includes('سفارش') || text.includes('order')) return 'blue';
  if (text.includes('کسب') || text.includes('business')) return 'lilac';
  return '';
}

function calculateReadTime(text?: string): string {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(2, Math.ceil(words / 150));
  return `${minutes.toLocaleString('fa-IR')} دقیقه مطالعه`;
}

function formatPersianDate(dateStr?: string): string {
  if (!dateStr) return '۸ مهر ۱۴۰۵';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export default function BlogListingPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [articles, setArticles] = useState<BlogArticleItem[]>(STATIC_ARTICLES);

  useEffect(() => {
    async function fetchBackendPosts() {
      try {
        const res = await blogService.getPosts({ limit: 50 });
        if (res && Array.isArray(res.posts) && res.posts.length > 0) {
          const mapped: BlogArticleItem[] = res.posts.map((p) => {
            const catSlug = p.category?.slug || '';
            const catName = p.category?.name || 'سودانه مگ';
            let catType = 'all';
            if (catSlug.includes('reward') || catName.includes('پاداش')) catType = 'reward';
            else if (catSlug.includes('shop') || catName.includes('خرید')) catType = 'shopping';
            else if (catSlug.includes('order') || catName.includes('سفارش')) catType = 'order';
            else if (catSlug.includes('business') || catName.includes('کسب')) catType = 'business';

            return {
              slug: p.slug,
              category: catType,
              label: catName,
              date: formatPersianDate(p.publishedAt || p.createdAt),
              read: calculateReadTime(p.content),
              image: p.featuredImage || '/assets/products/rice.png',
              tone: getTone(catName, p.slug),
              title: p.title,
              excerpt: p.excerpt || (p.content ? p.content.slice(0, 110) + '...' : ''),
            };
          });
          setArticles(mapped);
        }
      } catch (err) {
        console.warn('Fallback to static articles:', err);
      }
    }
    fetchBackendPosts();
  }, []);

  // Filter articles based on active category
  const filtered = articles.filter(
    (a) => activeCategory === 'all' || a.category === activeCategory
  );

  const featuredArticle = articles.find((a) => a.slug === 'rewards') || articles[0];

  // When 'all' is selected, featured article is placed on top in featured block
  const visible =
    activeCategory === 'all'
      ? filtered.filter((a) => a.slug !== featuredArticle?.slug)
      : filtered;

  const totalPages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const pageItems = visible.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE
  );

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    const el = document.querySelector('.list-wrap');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSubscribed(true);
  };

  return (
    <div className="blog-scope">
      {/* 1. Announcement */}
      <a
        className="announcement"
        href={`${APP_URL}/special`}
        aria-label="مشاهده تخفیف‌های ویژه"
      >
        <img src="/assets/promotions/top-promo.gif" alt="تخفیف‌های ویژه سودانه" />
      </a>

      {/* 2. Nav */}
      <div className="nav-wrap">
        <nav
          className={`nav ${menuOpen ? 'menu-open' : ''}`}
          aria-label="ناوبری اصلی"
        >
          <Link className="brand" href="/">
            <span className="brand-mark" aria-hidden="true"></span>
            سودانه
          </Link>
          <div className="nav-links">
            <Link href="/landing#features" onClick={() => setMenuOpen(false)}>
              چرا سودانه
            </Link>
            <Link href="/landing#platform" onClick={() => setMenuOpen(false)}>
              ویژگی‌های پلتفرم
            </Link>
            <Link
              className="active"
              href="/blog"
              onClick={() => setMenuOpen(false)}
            >
              سودانه مگ
            </Link>
            <Link href="/landing#faq" onClick={() => setMenuOpen(false)}>
              سوالات متداول
            </Link>
          </div>
          <a className="nav-cta" href={`${APP_URL}/auth`}>
            شروع رایگان
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

      {/* 3. Main Page Content */}
      <main className="page">
        {/* Blog Hero */}
        <section className="blog-hero">
          <div className="blog-hero-copy">
            <span className="eyebrow">مجله سودانه</span>
            <h1>راهنمای خرید آگاهانه و تجربه بهتر با سودانه</h1>
            <p>
              مقاله‌های کوتاه و کاربردی برای مشتریان، فروشگاه‌ها و تیم‌های
              عملیاتی؛ از پاداش خرید و پیگیری سفارش تا مدیریت بهتر جریان فروش.
            </p>
          </div>
          <div className="hero-figure" aria-hidden="true">
            <div className="paper"></div>
            <span className="hero-chip">راهنمای کاربردی</span>
            <span className="hero-chip bottom">خرید · پاداش · عملیات</span>
          </div>
        </section>

        {/* Categories Bar */}
        <nav className="categories" aria-label="دسته‌بندی مقاله‌ها">
          <button
            className={activeCategory === 'all' ? 'active' : ''}
            onClick={() => handleCategoryChange('all')}
          >
            همه مقاله‌ها
          </button>
          <button
            className={activeCategory === 'reward' ? 'active' : ''}
            onClick={() => handleCategoryChange('reward')}
          >
            پاداش
          </button>
          <button
            className={activeCategory === 'shopping' ? 'active' : ''}
            onClick={() => handleCategoryChange('shopping')}
          >
            راهنمای خرید
          </button>
          <button
            className={activeCategory === 'order' ? 'active' : ''}
            onClick={() => handleCategoryChange('order')}
          >
            سفارش
          </button>
          <button
            className={activeCategory === 'business' ? 'active' : ''}
            onClick={() => handleCategoryChange('business')}
          >
            کسب‌وکار
          </button>
        </nav>

        {/* Featured Article Section (shown when activeCategory is 'all') */}
        {activeCategory === 'all' && featuredArticle && (
          <section className="featured-wrap">
            <div className="section-head">
              <div>
                <h2>مقاله منتخب</h2>
                <p>راهنمایی برای استفاده بهتر از امکانات سودانه</p>
              </div>
              <Link href={`/blog/${featuredArticle.slug}`}>مشاهده مقاله</Link>
            </div>
            <article className="featured">
              <Link
                className="featured-art"
                href={`/blog/${featuredArticle.slug}`}
                aria-label={`خواندن ${featuredArticle.title}`}
              >
                <img src={featuredArticle.image} alt={featuredArticle.title} />
              </Link>
              <div className="featured-copy">
                <div className="meta">
                  <strong>{featuredArticle.label}</strong>
                  <i></i>
                  <span>{featuredArticle.date}</span>
                  <i></i>
                  <span>{featuredArticle.read}</span>
                </div>
                <h3>{featuredArticle.title}</h3>
                <p>{featuredArticle.excerpt}</p>
                <Link className="button" href={`/blog/${featuredArticle.slug}`}>
                  خواندن مقاله <span>←</span>
                </Link>
              </div>
            </article>
          </section>
        )}

        {/* Articles List Wrap */}
        <section className="list-wrap">
          <div className="section-head">
            <div>
              <h2 id="list-title">{LABELS[activeCategory]?.[0] || 'مقاله‌ها'}</h2>
              <p id="list-copy">
                {LABELS[activeCategory]?.[1] || 'مطالب سودانه مگ را دنبال کنید'}
              </p>
            </div>
            <span id="article-count">{fa(visible.length)} مقاله</span>
          </div>

          <div className="articles" aria-live="polite">
            {pageItems.length > 0 ? (
              pageItems.map((article) => (
                <article className="post" key={article.slug}>
                  <Link
                    className={`post-art ${article.tone}`}
                    href={`/blog/${article.slug}`}
                    aria-label={`خواندن ${article.title}`}
                  >
                    <img src={article.image} alt={article.title} />
                  </Link>
                  <div className="post-copy">
                    <div className="meta">
                      <strong>{article.label}</strong>
                      <i></i>
                      <span>{article.read}</span>
                    </div>
                    <h3>
                      <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p>{article.excerpt}</p>
                    <div className="post-bottom">
                      <small>{article.date}</small>
                      <Link href={`/blog/${article.slug}`}>ادامه مطلب ←</Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty">برای این دسته هنوز مقاله‌ای منتشر نشده است.</p>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="شماره‌گذاری مقاله‌ها">
              <button
                className="pagination-direction"
                disabled={safePage === 1}
                onClick={() => handlePageChange(safePage - 1)}
              >
                صفحه قبل
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((idx) => (
                <button
                  key={idx}
                  className={safePage === idx ? 'active' : ''}
                  onClick={() => handlePageChange(idx)}
                >
                  {fa(idx)}
                </button>
              ))}
              <button
                className="pagination-direction"
                disabled={safePage === totalPages}
                onClick={() => handlePageChange(safePage + 1)}
              >
                صفحه بعد
              </button>
            </nav>
          )}
        </section>

        {/* Newsletter Box */}
        <section className="newsletter">
          <div>
            <h2>مقاله‌های کاربردی سودانه را از دست ندهید</h2>
            <p>
              برای دریافت خبرهای محصول، راهنماهای خرید و مطالب جدید سودانه مگ
              ثبت‌نام کنید.
            </p>
          </div>
          <form
            className="newsletter-form"
            onSubmit={handleNewsletterSubmit}
          >
            <input
              type="email"
              required
              placeholder="ایمیل شما"
              disabled={newsletterSubscribed}
            />
            <button type="submit" disabled={newsletterSubscribed}>
              {newsletterSubscribed ? (
                <span>
                  <i className="fa-solid fa-check" aria-hidden="true"></i> ثبت شد
                </span>
              ) : (
                'عضویت در خبرنامه'
              )}
            </button>
          </form>
        </section>
      </main>

      {/* 4. Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" href="/">
              <span className="brand-mark" aria-hidden="true"></span>
              سودانه
            </Link>
            <p>
              پلتفرم خرید روزمره، پاداش و مدیریت یکپارچه سفارش؛ از انتخاب کالا
              تا تحویل و خرید بعدی.
            </p>
          </div>
          <div className="footer-links">
            <div>
              <h3>سودانه</h3>
              <Link href="/landing#features">چرا سودانه</Link>
              <Link href="/landing#platform">ویژگی‌های پلتفرم</Link>
              <Link href="/landing#rewards">باشگاه پاداش</Link>
              <Link href="/blog">سودانه مگ</Link>
            </div>
            <div>
              <h3>راهنما و پشتیبانی</h3>
              <Link href="/landing#faq">سوالات متداول</Link>
              <a href={`${APP_URL}/support`}>ارتباط با پشتیبانی</a>
              <a href={`${APP_URL}/legal`}>قوانین و حریم خصوصی</a>
              <a href={`${APP_URL}/auth`}>ساخت حساب</a>
            </div>
          </div>
          <div className="footer-trust">
            <div className="enamad" aria-label="محل نمایش نماد اعتماد الکترونیکی">
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
