'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { MarkdownContent } from '@/components/common/markdown-content';
import './blog-detail.css';
import { blogService } from '@/services/blog.service';
import { BlogPost } from '@/types/blog';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || '/';

interface CategoryGuide {
  title: string;
  copy: string;
  href: string;
  link: string;
}

const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  'پاداش': {
    title: 'کیف پول پاداشت را بررسی کن',
    copy: 'موجودی، تراکنش‌ها و تاریخ اعتبار پاداش را در بخش پاداش ببین و برای سفارش بعدی استفاده کن.',
    href: `${APP_URL}/wallet`,
    link: 'مشاهده کیف پول پاداش',
  },
  'راهنمای خرید': {
    title: 'خریدت را با یک سبد روشن شروع کن',
    copy: 'از جست‌وجو و فیلتر استفاده کن، کالاها را به سبد اضافه کن و پیش از پرداخت خلاصه قیمت را مرور کن.',
    href: `${APP_URL}`,
    link: 'مشاهده همه کالاها',
  },
  'سفارش و پیگیری': {
    title: 'وضعیت سفارش را همیشه پیگیری کن',
    copy: 'از بخش سفارش‌ها، مرحله آماده‌سازی، ارسال، تحویل و جزئیات مبلغ را در یک نمای روشن ببین.',
    href: `${APP_URL}/orders`,
    link: 'مشاهده سفارش‌ها',
  },
  'سفارش': {
    title: 'وضعیت سفارش را همیشه پیگیری کن',
    copy: 'از بخش سفارش‌ها، مرحله آماده‌سازی، ارسال، تحویل و جزئیات مبلغ را در یک نمای روشن ببین.',
    href: `${APP_URL}/orders`,
    link: 'مشاهده سفارش‌ها',
  },
  'کسب‌وکار': {
    title: 'عملیات را یکپارچه‌تر ببین',
    copy: 'سفارش، موجودی، ارسال و گزارش فروش وقتی کنار هم قرار می‌گیرند، تصمیم‌های روزانه دقیق‌تر می‌شوند.',
    href: '/landing#platform',
    link: 'مشاهده ویژگی‌های پلتفرم',
  },
  'سبک زندگی و سلامت': {
    title: 'انتخاب بهترین محصولات سوپرمارکتی',
    copy: 'تغذیه سالم با کالاهای اصیل و تازه ایرانی در سوپرمارکت آنلاین سودانه.',
    href: `${APP_URL}`,
    link: 'مشاهده اقلام تازه و ارگانیک',
  },
};

// Tone color mappings for card backgrounds
function getTone(categoryName?: string, slug?: string): string {
  const text = `${categoryName || ''} ${slug || ''}`.toLowerCase();
  if (text.includes('خرید') || text.includes('shopping')) return 'amber';
  if (text.includes('سفارش') || text.includes('order')) return 'blue';
  if (text.includes('کسب') || text.includes('business')) return 'lilac';
  return '';
}

function calculateReadTime(text: string): string {
  const words = text ? text.trim().split(/\s+/).length : 0;
  const minutes = Math.max(2, Math.ceil(words / 150));
  return `${minutes.toLocaleString('fa-IR')} دقیقه مطالعه`;
}

function formatPersianDate(dateStr?: string): string {
  if (!dateStr) return 'به‌تازگی';
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

export default function BlogPostDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';

  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'like' | 'idea' | null>(null);

  // Load real post and related articles from backend
  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const fetchedPost = await blogService.getPostBySlug(slug);
        setPost(fetchedPost);

        // Fetch related posts from real backend
        const allPostsRes = await blogService.getPosts({ limit: 10 });
        if (allPostsRes && Array.isArray(allPostsRes.posts)) {
          const others = allPostsRes.posts.filter((p) => p.slug !== slug);
          setRelatedPosts(others.slice(0, 4));
        }
      } catch (err) {
        console.warn('Error loading blog post from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  // Track window scroll for the reading progress bar
  useEffect(() => {
    const updateProgress = () => {
      const top = document.documentElement.scrollTop || document.body.scrollTop;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (top / total) * 100)));
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  // Split markdown into intro and H2 sections for Table of Contents & Section Layout
  const parsedSections = useMemo(() => {
    if (!post?.content) return { intro: '', sections: [] };

    // Split at start of H2 lines (## )
    const parts = post.content.split(/(?=^##\s+)/m);
    const intro = parts[0]?.trim() || '';

    const sections = parts.slice(1).map((part, idx) => {
      const lines = part.trim().split('\n');
      const firstLine = lines[0] || '';
      const title = firstLine.replace(/^##\s+/, '').trim();
      const body = lines.slice(1).join('\n').trim();
      return {
        id: `part-${idx + 1}`,
        number: (idx + 1).toLocaleString('fa-IR'),
        title,
        body,
      };
    });

    return { intro, sections };
  }, [post?.content]);

  const handleShare = async () => {
    if (typeof window !== 'undefined') {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        setCopied(false);
      }
    }
  };

  const handleFeedback = (type: 'like' | 'idea') => {
    setFeedback(type);
  };

  if (loading) {
    return (
      <div className="blog-detail-scope" dir="rtl">
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center', color: '#71827a', fontSize: '13px' }}>
          در حال بارگذاری مقاله از سودانه مگ...
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-scope" dir="rtl">
        <main className="article-page" style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{ fontSize: '38px', marginBottom: '12px' }}>📖</div>
          <h1 style={{ fontSize: '20px', color: '#20382c', margin: '0 0 10px' }}>مقاله یافت نشد</h1>
          <p style={{ fontSize: '13px', color: '#71827a', maxWidth: '400px', margin: 'auto', lineHeight: '2' }}>
            ممکن است این مقاله به آدرس دیگری منتقل شده یا موقتاً در دسترس نباشد.
          </p>
          <div style={{ marginTop: '24px' }}>
            <Link
              href="/blog"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '9px',
                background: '#17815a',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '800',
              }}
            >
              بازگشت به همه مقاله‌ها
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const categoryName = post.category?.name || 'سودانه مگ';
  const tone = getTone(categoryName, post.slug);
  const readTime = calculateReadTime(post.content);
  const formattedDate = formatPersianDate(post.publishedAt || post.createdAt);
  const guide = CATEGORY_GUIDES[categoryName] || CATEGORY_GUIDES['راهنمای خرید'];
  const coverImage = post.featuredImage || '/assets/products/rice.png';
  const authorName = post.author
    ? `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'تیم محتوای سودانه'
    : 'تیم محتوای سودانه';

  return (
    <div className="blog-detail-scope" dir="rtl">
      {/* 1. Announcement Banner */}
      <a
        className="announcement"
        href={`${APP_URL}/special`}
        aria-label="مشاهده تخفیف‌های ویژه"
      >
        <img src="/assets/promotions/top-promo.gif" alt="تخفیف‌های ویژه سودانه" />
      </a>

      {/* 2. Sticky Navigation */}
      <div className="nav-wrap">
        <nav className={`nav ${mobileMenuOpen ? 'menu-open' : ''}`} aria-label="ناوبری اصلی">
          <Link className="brand" href="/landing">
            <span className="brand-mark" aria-hidden="true" />
            سودانه
          </Link>

          <div className="nav-links">
            <Link href="/landing#features">چرا سودانه</Link>
            <Link href="/landing#platform">ویژگی‌های پلتفرم</Link>
            <Link className="active" href="/blog">
              سودانه مگ
            </Link>
            <Link href="/landing#faq">سوالات متداول</Link>
          </div>

          <a className="nav-cta" href={`${APP_URL}/auth`}>
            شروع رایگان
          </a>

          <button
            className="menu-toggle"
            type="button"
            aria-label="باز کردن منو"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            ☰
          </button>
        </nav>
      </div>

      {/* 3. Reading Progress Bar */}
      <div className="read-progress" aria-hidden="true">
        <span id="read-progress-bar" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* 4. Main Article Page */}
      <main className="article-page">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link href="/landing">سودانه</Link>
          <span>‹</span>
          <Link href="/blog">سودانه مگ</Link>
          <span>‹</span>
          <span id="breadcrumb-title">{post.title}</span>
        </div>

        <article>
          {/* Article Cover */}
          <div className={`cover ${tone}`} id="cover">
            <img id="cover-image" src={coverImage} alt={post.title} />
            <span className="category" id="article-category">
              {categoryName}
            </span>
          </div>

          {/* Heading & Meta */}
          <header className="article-heading">
            <div className="meta">
              <strong id="article-category-meta">{categoryName}</strong>
              <i />
              <time id="article-date">{formattedDate}</time>
              <i />
              <span id="article-read">{readTime}</span>
            </div>

            <h1 id="article-title">{post.title}</h1>
            {post.excerpt && (
              <p className="lead" id="article-lead">
                {post.excerpt}
              </p>
            )}

            <div className="article-byline">
              <span className="author-avatar">س</span>
              <div>
                <b>{authorName}</b>
                <span id="article-updated">به‌روزرسانی در {formattedDate}</span>
              </div>
              <span className="verified-copy">
                <i className="fa-solid fa-circle-check" aria-hidden="true" /> محتوای راهنما
              </span>
            </div>
          </header>

          {/* Actions */}
          <div className="article-actions">
            <button id="share-button" type="button" onClick={handleShare}>
              {copied ? (
                <>
                  <i className="fa-solid fa-check" aria-hidden="true" /> لینک کپی شد
                </>
              ) : (
                <>
                  <i className="fa-solid fa-share-nodes" aria-hidden="true" /> اشتراک‌گذاری مقاله
                </>
              )}
            </button>
            <Link href="/blog">همه مقاله‌ها</Link>
          </div>

          {/* Layout: TOC + Body */}
          <div className="article-layout">
            {/* Table of Contents Sticky Aside */}
            <aside className="toc">
              <b>در این مقاله می‌خوانید</b>
              <ol id="toc">
                {parsedSections.sections.map((sec) => (
                  <li key={sec.id}>
                    <a href={`#${sec.id}`}>
                      {sec.number}. {sec.title}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="toc-reading">
                <span>زمان مطالعه</span>
                <b id="toc-read">{readTime}</b>
              </div>
              <Link className="toc-back" href="/blog">
                ← بازگشت به همه مقاله‌ها
              </Link>
            </aside>

            {/* Article Body */}
            <div className="article-body">
              {/* Intro markdown text (if present) */}
              {parsedSections.intro && (
                <div id="intro" style={{ margin: '0 0 20px', color: '#536a5e', fontSize: '13px', lineHeight: '2.35' }}>
                  <MarkdownContent content={parsedSections.intro} />
                </div>
              )}

              {/* Summary Box with Key Points from H2 Titles */}
              <aside className="article-summary">
                <span>خلاصه این مقاله</span>
                <h2 id="summary-title">
                  {parsedSections.sections.length > 0
                    ? `${parsedSections.sections.length.toLocaleString('fa-IR')} نکته کلیدی از «${categoryName}»`
                    : 'نکته‌های کلیدی این مقاله'}
                </h2>
                <ul id="key-points">
                  {parsedSections.sections.length > 0 ? (
                    parsedSections.sections.map((sec) => (
                      <li key={sec.id}>{sec.title}</li>
                    ))
                  ) : (
                    <li>{post.excerpt || 'نکات و مهارت‌های کاربردی برای خرید به‌صرفه و مدیریت پاداش.'}</li>
                  )}
                </ul>
              </aside>

              {/* Numbered Sections Extracted from Markdown H2 */}
              <div id="sections">
                {parsedSections.sections.length > 0 ? (
                  parsedSections.sections.map((sec) => (
                    <section id={sec.id} key={sec.id}>
                      <span>{sec.number}</span>
                      <div>
                        <h2>{sec.title}</h2>
                        <MarkdownContent content={sec.body} />
                      </div>
                    </section>
                  ))
                ) : (
                  <section id="part-1">
                    <span>۱</span>
                    <div>
                      <h2>{post.title}</h2>
                      <MarkdownContent content={post.content} />
                    </div>
                  </section>
                )}
              </div>

              {/* Action Guide CTA */}
              <aside className="article-guide">
                <span>اقدام پیشنهادی</span>
                <h2 id="guide-title">{guide.title}</h2>
                <p id="guide-copy">{guide.copy}</p>
                <a id="guide-link" href={guide.href}>
                  {guide.link} <span>←</span>
                </a>
              </aside>

              {/* Note Box */}
              <aside className="note">
                <b>نکته سودانه</b>
                <p>
                  قابلیت‌های مرتبط را می‌توانید همین حالا در تجربه اپلیکیشن سودانه بررسی کنید؛ از
                  کیف پول پاداش تا وضعیت‌های سفارش.
                </p>
                <a href={APP_URL}>مشاهده تجربه اپلیکیشن ←</a>
              </aside>

              {/* Feedback Widget (FAQ section completely removed as requested) */}
              <section className="article-feedback">
                <div>
                  <b>این مقاله برایتان مفید بود؟</b>
                  <p>بازخورد شما برای بهتر شدن سودانه مگ ارزشمند است.</p>
                </div>
                <div className="feedback-actions">
                  <button
                    type="button"
                    className={feedback === 'like' ? 'active' : ''}
                    onClick={() => handleFeedback('like')}
                  >
                    {feedback === 'like' ? (
                      <>
                        <i className="fa-solid fa-check" aria-hidden="true" /> ممنون از بازخورد شما
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-thumbs-up" aria-hidden="true" /> بله
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className={feedback === 'idea' ? 'active' : ''}
                    onClick={() => handleFeedback('idea')}
                  >
                    {feedback === 'idea' ? (
                      <>
                        <i className="fa-solid fa-check" aria-hidden="true" /> پیشنهادتان ثبت شد
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-lightbulb" aria-hidden="true" /> پیشنهاد دارم
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </article>

        {/* Related Articles from real backend */}
        {relatedPosts.length > 0 && (
          <section className="related">
            <div className="related-head">
              <div>
                <h2>مطالب مرتبط</h2>
                <p>خواندن این مقاله‌ها را هم از دست ندهید.</p>
              </div>
              <Link href="/blog">همه مقاله‌ها</Link>
            </div>

            <div className="related-list" id="related-list">
              {relatedPosts.map((rel) => {
                const relCat = rel.category?.name || 'سودانه مگ';
                const relTone = getTone(relCat, rel.slug);
                const relImg = rel.featuredImage || '/assets/products/rice.png';
                return (
                  <article className="related-card" key={rel.id || rel.slug}>
                    <Link className={`related-art ${relTone}`} href={`/blog/${rel.slug}`}>
                      <img src={relImg} alt={rel.title} />
                    </Link>
                    <div>
                      <span>{relCat}</span>
                      <h3>
                        <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* 5. Site Footer */}
      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <Link className="brand" href="/landing">
              <span className="brand-mark" aria-hidden="true" />
              سودانه
            </Link>
            <p>
              پلتفرم خرید روزمره، پاداش و مدیریت یکپارچه سفارش؛ از انتخاب کالا تا تحویل و خرید بعدی.
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
            <p>برای پیگیری سفارش یا دریافت راهنمایی، از بخش پشتیبانی سودانه استفاده کنید.</p>
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
