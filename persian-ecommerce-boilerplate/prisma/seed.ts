import {
  PrismaClient,
  Role,
  ProductType,
  ProductStatus,
  PostStatus,
  OrderStatus,
  PaymentStatus,
  DiscountType,
  ReferralStatus,
  RewardType,
  WalletTransactionType,
  NotificationType,
  NotificationPriority,
  Prisma,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';
import * as sharpModule from 'sharp';

const sharp = (sharpModule as any).default || sharpModule;
const prisma = new PrismaClient();

interface MediaDef {
  filename: string;
  originalName: string;
  relativePath: string;
  altText: string;
  mimeType: string;
}

const MEDIA_DEFINITIONS: MediaDef[] = [
  // Products
  {
    filename: 'rice.png',
    originalName: 'rice.png',
    relativePath: 'products/rice.png',
    altText: 'تصویر برنج هاشمی ممتاز ۱ کیلوگرم کشت اول گیلان',
    mimeType: 'image/png',
  },
  {
    filename: 'basmati-rice-bag-product-packshot-white--3.png',
    originalName: 'basmati-rice-bag-product-packshot-white--3.png',
    relativePath: 'products/basmati-rice-bag-product-packshot-white--3.png',
    altText: 'نمای زاویه‌دار بسته‌بندی برنج هاشمی خوش‌عطر',
    mimeType: 'image/png',
  },
  {
    filename: 'oil.jpg',
    originalName: 'oil.jpg',
    relativePath: 'products/oil.jpg',
    altText: 'تصویر بطری روغن سرخ‌کردنی شفاف گیاهی ۱.۵ لیتر',
    mimeType: 'image/jpeg',
  },
  {
    filename: 'cooking-oil-bottle-product-white-backgro-1.jpg',
    originalName: 'cooking-oil-bottle-product-white-backgro-1.jpg',
    relativePath: 'products/cooking-oil-bottle-product-white-backgro-1.jpg',
    altText: 'نمای بطری روغن سرخ‌کردنی و روغن زیتون',
    mimeType: 'image/jpeg',
  },
  {
    filename: 'tea.jpg',
    originalName: 'tea.jpg',
    relativePath: 'products/tea.jpg',
    altText: 'تصویر بسته چای سیاه ممتاز ۵۰۰ گرم بهاره لاهیجان',
    mimeType: 'image/jpeg',
  },
  {
    filename: 'black-tea-package-product-white-backgrou-1.jpg',
    originalName: 'black-tea-package-product-white-backgrou-1.jpg',
    relativePath: 'products/black-tea-package-product-white-backgrou-1.jpg',
    altText: 'نمای پاکت بسته‌بندی چای سرگل ممتاز ایرانی',
    mimeType: 'image/jpeg',
  },
  {
    filename: 'tissue.jpg',
    originalName: 'tissue.jpg',
    relativePath: 'products/tissue.jpg',
    altText: 'تصویر جعبه دستمال کاغذی اقتصادی نرم و لطیف ۲۰۰ برگ',
    mimeType: 'image/jpeg',
  },
  {
    filename: 'tissue-paper-box-product-white-backgroun-1.jpg',
    originalName: 'tissue-paper-box-product-white-backgroun-1.jpg',
    relativePath: 'products/tissue-paper-box-product-white-backgroun-1.jpg',
    altText: 'نمای جعبه دستمال کاغذی اقتصادی رومیزی',
    mimeType: 'image/jpeg',
  },
  {
    filename: 'basmati-rice-bag-product-packshot-white--1.jpg',
    originalName: 'basmati-rice-bag-product-packshot-white--1.jpg',
    relativePath: 'products/basmati-rice-bag-product-packshot-white--1.jpg',
    altText: 'تصویر کیسه برنج باسماتی درجه یک هندی ۵ کیلوگرم',
    mimeType: 'image/jpeg',
  },
  // Categories (WebP icons with transparent background)
  {
    filename: 'supermarket.webp',
    originalName: 'supermarket.webp',
    relativePath: 'categories/supermarket.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی سوپرمارکت',
    mimeType: 'image/webp',
  },
  {
    filename: 'grocery.webp',
    originalName: 'grocery.webp',
    relativePath: 'categories/grocery.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی مواد غذایی',
    mimeType: 'image/webp',
  },
  {
    filename: 'restaurant.webp',
    originalName: 'restaurant.webp',
    relativePath: 'categories/restaurant.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی رستوران',
    mimeType: 'image/webp',
  },
  {
    filename: 'cafe.webp',
    originalName: 'cafe.webp',
    relativePath: 'categories/cafe.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی کافه',
    mimeType: 'image/webp',
  },
  {
    filename: 'pastry.webp',
    originalName: 'pastry.webp',
    relativePath: 'categories/pastry.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی شیرینی',
    mimeType: 'image/webp',
  },
  {
    filename: 'bakery.webp',
    originalName: 'bakery.webp',
    relativePath: 'categories/bakery.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی نانوایی',
    mimeType: 'image/webp',
  },
  {
    filename: 'fruit.webp',
    originalName: 'fruit.webp',
    relativePath: 'categories/fruit.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی میوه',
    mimeType: 'image/webp',
  },
  {
    filename: 'protein.webp',
    originalName: 'protein.webp',
    relativePath: 'categories/protein.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی پروتئین',
    mimeType: 'image/webp',
  },
  {
    filename: 'juice.webp',
    originalName: 'juice.webp',
    relativePath: 'categories/juice.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی آبمیوه بستنی',
    mimeType: 'image/webp',
  },
  {
    filename: 'fresh-produce.webp',
    originalName: 'fresh-produce.webp',
    relativePath: 'categories/fresh-produce.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی تره‌بار',
    mimeType: 'image/webp',
  },
  {
    filename: 'home.webp',
    originalName: 'home.webp',
    relativePath: 'categories/home.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی خانه و آشپزخانه',
    mimeType: 'image/webp',
  },
  {
    filename: 'hygiene.webp',
    originalName: 'hygiene.webp',
    relativePath: 'categories/hygiene.webp',
    altText: 'آیکون ۳ بعدی دسته‌بندی بهداشت',
    mimeType: 'image/webp',
  },
];

async function main() {
  console.log('🌱 Starting Sodaneh database seed...');

  if (process.env.DEMO_BOOTSTRAP === 'true' && new URL(process.env.DATABASE_URL!).pathname !== '/soodane_demo') {
    throw new Error('Demo seeding is restricted to soodane_demo');
  }

  // 1. Check for existing ADMIN user to preserve, or create one
  const existingAdmin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
  });

  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash('Admin@123456', salt);
  const customerPasswordHash = await bcrypt.hash('Customer@123456', salt);

  let adminId: string;
  if (existingAdmin) {
    adminId = existingAdmin.id;
    console.log(`🛡️ Preserved existing admin: ${existingAdmin.email} (ID: ${existingAdmin.id})`);
  } else {
    const createdAdmin = await prisma.user.create({
      data: {
        email: 'admin@store.local',
        passwordHash: adminPasswordHash,
        firstName: 'مدیر',
        lastName: 'کل سیستم',
        phone: '09121111111',
        role: Role.ADMIN,
        nationalId: '0010350810',
        birthDate: new Date('1990-03-21T00:00:00.000Z'),
      },
    });
    adminId = createdAdmin.id;
    console.log(`🛡️ Created super admin: admin@store.local (ID: ${adminId})`);
  }

  // 2. Clear all other data in reverse dependency order
  console.log('🧹 Clearing old store data...');
  await prisma.walletTransaction.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.orderTransaction.deleteMany();
  await prisma.orderTimeline.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.referral.deleteMany();
  await prisma.referralCode.deleteMany();
  await prisma.flashDealItem.deleteMany();
  await prisma.flashDeal.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.media.deleteMany();
  await prisma.variantAttributeValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.attributeValue.deleteMany();
  await prisma.attribute.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.otpVerification.deleteMany();
  await prisma.shippingMethod.deleteMany();
  await prisma.address.deleteMany();

  // Delete all users EXCEPT the admin
  await prisma.user.deleteMany({
    where: {
      id: { not: adminId },
    },
  });

  console.log('✅ Database cleaned. All non-admin records removed.');

  // 3. Register All Media Assets in Media Library (کتابخانه پرونده‌های چندرسانه‌ای)
  console.log('🖼️ Registering images in Media Library (کتابخانه پرونده‌های چندرسانه‌ای)...');
  const uploadsBaseDir = path.resolve(__dirname, '../uploads');
  const mediaMap = new Map<string, { id: string; url: string; altText: string }>();

  for (const def of MEDIA_DEFINITIONS) {
    const fullPath = path.join(uploadsBaseDir, def.relativePath);
    let size = 0;
    let width: number | null = null;
    let height: number | null = null;

    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      size = stats.size;

      if (def.mimeType.startsWith('image/') && !def.mimeType.includes('svg')) {
        try {
          const meta = await sharp(fullPath).metadata();
          width = meta.width || null;
          height = meta.height || null;
        } catch {
          // fallback
        }
      } else if (def.mimeType.includes('svg')) {
        width = 100;
        height = 100;
      }
    }

    const staticName = def.relativePath.startsWith('categories/')
      ? def.relativePath
      : def.filename.includes('rice') ? 'products/rice.png'
      : def.filename.includes('oil') ? 'products/oil.jpg'
      : def.filename.includes('tea') ? 'products/tea.jpg'
      : 'products/tissue.jpg';
    const publicUrl = process.env.SEED_ASSET_BASE_URL
      ? `${process.env.SEED_ASSET_BASE_URL.replace(/\/$/, '')}/${staticName}`
      : `http://localhost:4000/uploads/${def.relativePath}`;

    const mediaRecord = await prisma.media.create({
      data: {
        filename: def.filename,
        originalName: def.originalName,
        mimeType: def.mimeType,
        size,
        width,
        height,
        url: publicUrl,
        altText: def.altText,
      },
    });

    mediaMap.set(def.filename, {
      id: mediaRecord.id,
      url: mediaRecord.url,
      altText: mediaRecord.altText || def.altText,
    });
    console.log(`   📁 [Media Library] ${def.filename} -> ${publicUrl} (Alt: "${def.altText}")`);
  }

  // 4. Create Customers matching Sodaneh sample
  console.log('👥 Seeding Sodaneh customers...');
  const maryam = await prisma.user.create({
    data: {
      email: 'maryam.ahmadi@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'مریم',
      lastName: 'احمدی',
      phone: '09121234567',
      role: Role.CUSTOMER,
      nationalId: '0012345678',
      birthDate: new Date('1996-09-12T00:00:00.000Z'),
      addresses: {
        create: [
          {
            title: 'خانه',
            recipientName: 'مریم احمدی',
            phone: '09121234567',
            street: 'تهران، سعادت‌آباد، بلوار دریا، پلاک ۲۴',
            city: 'تهران',
            province: 'تهران',
            postalCode: '1998877665',
            isDefaultShipping: true,
            isDefaultBilling: true,
          },
          {
            title: 'محل کار',
            recipientName: 'مریم احمدی',
            phone: '09121234567',
            street: 'تهران، ونک، خیابان ملاصدرا، پلاک ۸',
            city: 'تهران',
            province: 'تهران',
            postalCode: '1991234567',
            isDefaultShipping: false,
            isDefaultBilling: false,
          },
        ],
      },
    },
  });

  const reza = await prisma.user.create({
    data: {
      email: 'reza.karimi@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'رضا',
      lastName: 'کریمی',
      phone: '09123333333',
      role: Role.CUSTOMER,
      nationalId: '0499370856',
    },
  });

  const ali = await prisma.user.create({
    data: {
      email: 'ali.hosseini@example.com',
      passwordHash: customerPasswordHash,
      firstName: 'علی',
      lastName: 'حسینی',
      phone: '09124444444',
      role: Role.CUSTOMER,
      nationalId: '1270425897',
    },
  });

  // 5. Referral Code & Referrals for Maryam (SOD-8K2F6)
  console.log('🎁 Seeding referral system...');
  const referralCode = await prisma.referralCode.create({
    data: {
      code: 'SOD-8K2F6',
      ownerId: maryam.id,
      clickCount: 48,
      successfulReferrals: 2,
      totalEarned: new Prisma.Decimal(47000),
      isActive: true,
    },
  });

  await prisma.referral.create({
    data: {
      referralCodeId: referralCode.id,
      referrerId: maryam.id,
      refereeId: reza.id,
      status: ReferralStatus.COMPLETED,
      rewardAmountReferrer: new Prisma.Decimal(35000),
      rewardAmountReferee: new Prisma.Decimal(15000),
      rewardedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000),
    },
  });

  await prisma.referral.create({
    data: {
      referralCodeId: referralCode.id,
      referrerId: maryam.id,
      refereeId: ali.id,
      status: ReferralStatus.COMPLETED,
      rewardAmountReferrer: new Prisma.Decimal(12000),
      rewardAmountReferee: new Prisma.Decimal(10000),
      rewardedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
    },
  });

  // 6. Wallet & Transactions for Maryam (balance: 380,000 Toman)
  console.log('💳 Seeding wallet and transactions...');
  const maryamWallet = await prisma.wallet.create({
    data: {
      userId: maryam.id,
      balance: new Prisma.Decimal(380000),
      currency: 'IRT',
      isActive: true,
    },
  });

  await prisma.walletTransaction.createMany({
    data: [
      {
        walletId: maryamWallet.id,
        amount: new Prisma.Decimal(12000),
        balanceBefore: new Prisma.Decimal(368000),
        balanceAfter: new Prisma.Decimal(380000),
        type: WalletTransactionType.CASHBACK,
        description: 'پاداش خرید - برنج هاشمی ممتاز',
        createdAt: new Date(),
      },
      {
        walletId: maryamWallet.id,
        amount: new Prisma.Decimal(6000),
        balanceBefore: new Prisma.Decimal(362000),
        balanceAfter: new Prisma.Decimal(368000),
        type: WalletTransactionType.REFERRAL_REWARD,
        description: 'پاداش معرفی مستقیم - خرید رضا کریمی',
        createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000),
      },
      {
        walletId: maryamWallet.id,
        amount: new Prisma.Decimal(-50000),
        balanceBefore: new Prisma.Decimal(412000),
        balanceAfter: new Prisma.Decimal(362000),
        type: WalletTransactionType.ORDER_PAYMENT,
        description: 'استفاده از پاداش - سفارش #۱۰۲۴۸',
        referenceId: '10248',
        createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000),
      },
      {
        walletId: maryamWallet.id,
        amount: new Prisma.Decimal(8000),
        balanceBefore: new Prisma.Decimal(404000),
        balanceAfter: new Prisma.Decimal(412000),
        type: WalletTransactionType.CASHBACK,
        description: 'پاداش خرید - چای سیاه ممتاز',
        createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000),
      },
      {
        walletId: maryamWallet.id,
        amount: new Prisma.Decimal(20000),
        balanceBefore: new Prisma.Decimal(384000),
        balanceAfter: new Prisma.Decimal(404000),
        type: WalletTransactionType.REFUND,
        description: 'بازگشت پاداش مصرف‌شده',
        createdAt: new Date(Date.now() - 7 * 24 * 3600 * 1000),
      },
    ],
  });

  // 7. Parent (Mother) Categories ONLY (دسته‌بندی‌های مادر با parentId = null)
  console.log('🏷️ Seeding parent categories linked to Media library...');
  const catRestaurant = await prisma.category.create({
    data: {
      name: 'رستوران',
      slug: 'restaurant',
      description: 'سفارش آنلاین انواع غذاهای ایرانی و فرنگی',
      image: mediaMap.get('restaurant.webp')?.url || 'http://localhost:4000/uploads/categories/restaurant.webp',
      parentId: null,
      displayOrder: 1,
    },
  });

  const catSupermarket = await prisma.category.create({
    data: {
      name: 'سوپرمارکت',
      slug: 'supermarket',
      description: 'کالاهای اساسی و خواربار با بهترین قیمت و پاداش خرید',
      image: mediaMap.get('supermarket.webp')?.url || 'http://localhost:4000/uploads/categories/supermarket.webp',
      parentId: null,
      displayOrder: 2,
    },
  });

  const catCafe = await prisma.category.create({
    data: {
      name: 'کافه',
      slug: 'cafe',
      description: 'انواع قهوه، دمنوش و نوشیدنی‌های گرم و سرد',
      image: mediaMap.get('cafe.webp')?.url || 'http://localhost:4000/uploads/categories/cafe.webp',
      parentId: null,
      displayOrder: 3,
    },
  });

  const catPastry = await prisma.category.create({
    data: {
      name: 'شیرینی',
      slug: 'pastry',
      description: 'انواع کیک، شیرینی تر و خشک تازه و مجلسی',
      image: mediaMap.get('pastry.webp')?.url || 'http://localhost:4000/uploads/categories/pastry.webp',
      parentId: null,
      displayOrder: 4,
    },
  });

  const catBakery = await prisma.category.create({
    data: {
      name: 'نانوایی',
      slug: 'bakery',
      description: 'نان‌های سنتی و فانتزی داغ و تازه',
      image: mediaMap.get('bakery.webp')?.url || 'http://localhost:4000/uploads/categories/bakery.webp',
      parentId: null,
      displayOrder: 5,
    },
  });

  const catFruit = await prisma.category.create({
    data: {
      name: 'میوه',
      slug: 'fruit',
      description: 'میوه‌های دست‌چین و فصل با تازگی تضمینی',
      image: mediaMap.get('fruit.webp')?.url || 'http://localhost:4000/uploads/categories/fruit.webp',
      parentId: null,
      displayOrder: 6,
    },
  });

  const catProtein = await prisma.category.create({
    data: {
      name: 'پروتئین',
      slug: 'protein',
      description: 'گوشت قرمز، مرغ تازه و فرآورده‌های پروتئینی',
      image: mediaMap.get('protein.webp')?.url || 'http://localhost:4000/uploads/categories/protein.webp',
      parentId: null,
      displayOrder: 7,
    },
  });

  const catJuice = await prisma.category.create({
    data: {
      name: 'آبمیوه بستنی',
      slug: 'juice',
      description: 'آبمیوه‌های طبیعی، معجون و بستنی‌های خنک',
      image: mediaMap.get('juice.webp')?.url || 'http://localhost:4000/uploads/categories/juice.webp',
      parentId: null,
      displayOrder: 8,
    },
  });

  const catFreshProduce = await prisma.category.create({
    data: {
      name: 'تره‌بار',
      slug: 'fresh-produce',
      description: 'سبزیجات تازه، صیفی‌جات و محصولات کشاورزی روز',
      image: mediaMap.get('fresh-produce.webp')?.url || 'http://localhost:4000/uploads/categories/fresh-produce.webp',
      parentId: null,
      displayOrder: 9,
    },
  });

  const catGrocery = await prisma.category.create({
    data: {
      name: 'مواد غذایی',
      slug: 'grocery',
      description: 'انواع برنج، روغن، حبوبات و مواد غذایی تازه',
      image: mediaMap.get('grocery.webp')?.url || 'http://localhost:4000/uploads/categories/grocery.webp',
      parentId: null,
      displayOrder: 10,
    },
  });

  const catHome = await prisma.category.create({
    data: {
      name: 'خانه و آشپزخانه',
      slug: 'home',
      description: 'لوازم بهداشتی، مصرفی و ملزومات خانه و آشپزخانه',
      image: mediaMap.get('home.webp')?.url || 'http://localhost:4000/uploads/categories/home.webp',
      parentId: null,
      displayOrder: 11,
    },
  });

  const catHygiene = await prisma.category.create({
    data: {
      name: 'بهداشت',
      slug: 'hygiene',
      description: 'محصولات بهداشتی، دستمال و مراقبت شخصی',
      image: mediaMap.get('hygiene.webp')?.url || 'http://localhost:4000/uploads/categories/hygiene.webp',
      parentId: null,
      displayOrder: 12,
    },
  });

  // 8. Products with linked media and Persian alt text
  console.log('📦 Seeding products with linked media library items & alt texts...');

  // Product 1: برنج هاشمی ممتاز، ۱ کیلوگرم
  const riceMedia1 = mediaMap.get('rice.png');
  const riceMedia2 = mediaMap.get('basmati-rice-bag-product-packshot-white--3.png');

  const rice = await prisma.product.create({
    data: {
      name: 'برنج هاشمی ممتاز، ۱ کیلوگرم',
      slug: 'rice-hashemi-1kg',
      sku: 'SOD-RICE-1KG',
      productType: ProductType.SIMPLE,
      description: 'برنج هاشمی ممتاز کشت اول گیلان، کاملاً الک‌شده، بوجار با کیفیت استثنایی و عطر طبیعی بی‌نظیر. گزینه‌ای ایده‌آل برای مصرف روزانه خانواده و مهمانی‌های رسمی با پخت فوق‌العاده و قدکشیدگی عالی.',
      shortDescription: 'برنج ایرانی خوش‌عطر، مناسب برای مصرف روزانه و مهمانی.',
      basePrice: new Prisma.Decimal(225000),
      salePrice: new Prisma.Decimal(198000),
      stockQuantity: 120,
      manageStock: true,
      dimensions: '25x15x8 cm',
      weight: new Prisma.Decimal(1.0),
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: catSupermarket.id,
      rewardType: RewardType.FIXED,
      refereeRewardValue: new Prisma.Decimal(12000),
      referrerRewardValue: new Prisma.Decimal(6000),
      specifications: [
        { label: 'نوع برنج', value: 'هاشمی ایرانی' },
        { label: 'وزن', value: '۱ کیلوگرم' },
        { label: 'ارسال', value: '۱ تا ۲ روز' },
        { label: 'محل کشت', value: 'گیلان، آستانه اشرفیه' },
      ],
      images: {
        create: [
          {
            url: riceMedia1?.url || 'http://localhost:4000/uploads/products/rice.png',
            altText: riceMedia1?.altText || 'تصویر برنج هاشمی ممتاز ۱ کیلوگرم گیلان',
            isPrimary: true,
            displayOrder: 0,
          },
          {
            url: riceMedia2?.url || 'http://localhost:4000/uploads/products/basmati-rice-bag-product-packshot-white--3.png',
            altText: riceMedia2?.altText || 'نمای بسته‌بندی برنج هاشمی درجه یک',
            isPrimary: false,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // Product 2: روغن سرخ‌کردنی، ۱.۵ لیتر
  const oilMedia1 = mediaMap.get('oil.jpg');
  const oilMedia2 = mediaMap.get('cooking-oil-bottle-product-white-backgro-1.jpg');

  const oil = await prisma.product.create({
    data: {
      name: 'روغن سرخ‌کردنی، ۱.۵ لیتر',
      slug: 'frying-oil-1-5l',
      sku: 'SOD-OIL-15L',
      productType: ProductType.SIMPLE,
      description: 'تهیه‌شده از باکیفیت‌ترین دانه‌های روغنی گیاهی با مقاومت حرارتی بالا بدون ایجاد بو یا دود، مناسب برای سرخ‌کردن عمیق و انواع پخت‌وپز روزانه با کمترین جذب روغن.',
      shortDescription: 'تهیه‌شده از روغن گیاهی، مناسب سرخ‌کردن و پخت‌وپز روزانه.',
      basePrice: new Prisma.Decimal(189000),
      salePrice: new Prisma.Decimal(169000),
      stockQuantity: 95,
      manageStock: true,
      dimensions: '10x10x30 cm',
      weight: new Prisma.Decimal(1.5),
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: catSupermarket.id,
      rewardType: RewardType.FIXED,
      refereeRewardValue: new Prisma.Decimal(9000),
      referrerRewardValue: new Prisma.Decimal(4500),
      specifications: [
        { label: 'نوع روغن', value: 'سرخ‌کردنی شفاف گیاهی' },
        { label: 'حجم', value: '۱.۵ لیتر' },
        { label: 'بدون پالم', value: 'بله، بدون ترانس' },
        { label: 'ارسال', value: 'تحویل سریع در تهران' },
      ],
      images: {
        create: [
          {
            url: oilMedia1?.url || 'http://localhost:4000/uploads/products/oil.jpg',
            altText: oilMedia1?.altText || 'تصویر بطری روغن سرخ‌کردنی گیاهی ۱.۵ لیتر',
            isPrimary: true,
            displayOrder: 0,
          },
          {
            url: oilMedia2?.url || 'http://localhost:4000/uploads/products/cooking-oil-bottle-product-white-backgro-1.jpg',
            altText: oilMedia2?.altText || 'نمای بطری روغن سرخ‌کردنی',
            isPrimary: false,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // Product 3: چای سیاه ممتاز، ۵۰۰ گرم
  const teaMedia1 = mediaMap.get('tea.jpg');
  const teaMedia2 = mediaMap.get('black-tea-package-product-white-backgrou-1.jpg');

  const tea = await prisma.product.create({
    data: {
      name: 'چای سیاه ممتاز، ۵۰۰ گرم',
      slug: 'black-tea-500g',
      sku: 'SOD-TEA-500G',
      productType: ProductType.SIMPLE,
      description: 'چای سیاه اصیل بهاره ایرانی، دست‌چین‌شده از بهترین مزارع لاهیجان با رنگ‌آوری طبیعی آلبالویی، بدون هیچ‌گونه اسانس مصنوعی یا رنگ شیمیایی افزوده شده.',
      shortDescription: 'چای خوش‌رنگ و خوش‌طعم ایرانی با عطر طبیعی و بسته‌بندی تازه.',
      basePrice: new Prisma.Decimal(158000),
      salePrice: new Prisma.Decimal(142000),
      stockQuantity: 80,
      manageStock: true,
      dimensions: '15x8x22 cm',
      weight: new Prisma.Decimal(0.5),
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: catSupermarket.id,
      rewardType: RewardType.FIXED,
      refereeRewardValue: new Prisma.Decimal(8000),
      referrerRewardValue: new Prisma.Decimal(4000),
      specifications: [
        { label: 'خاستگاه', value: 'مزارع سرسبز لاهیجان' },
        { label: 'وزن', value: '۵۰۰ گرم' },
        { label: 'مدت دم‌کشیدن', value: '۱۰ تا ۱۵ دقیقه' },
        { label: 'نوع فرآوری', value: 'ارتودوکس بهاره ممتاز' },
      ],
      images: {
        create: [
          {
            url: teaMedia1?.url || 'http://localhost:4000/uploads/products/tea.jpg',
            altText: teaMedia1?.altText || 'تصویر بسته چای سیاه ممتاز ۵۰۰ گرم لاهیجان',
            isPrimary: true,
            displayOrder: 0,
          },
          {
            url: teaMedia2?.url || 'http://localhost:4000/uploads/products/black-tea-package-product-white-backgrou-1.jpg',
            altText: teaMedia2?.altText || 'نمای پاکت بسته‌بندی چای لاهیجان',
            isPrimary: false,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // Product 4: دستمال کاغذی اقتصادی
  const tissueMedia1 = mediaMap.get('tissue.jpg');
  const tissueMedia2 = mediaMap.get('tissue-paper-box-product-white-backgroun-1.jpg');

  const tissue = await prisma.product.create({
    data: {
      name: 'دستمال کاغذی اقتصادی',
      slug: 'economy-facial-tissue',
      sku: 'SOD-TISSUE-200',
      productType: ProductType.SIMPLE,
      description: 'جعبه دستمال نرم و لطیف اقتصادی ۲۰۰ برگ دو لایه از تیشوی ۱۰۰ درصد طبیعی، بدون پرزدهی با قدرت جذب بالا، مناسب استفاده روزانه در خانه و آشپزخانه.',
      shortDescription: 'جعبه دستمال نرم و اقتصادی، مناسب استفاده روزانه در خانه و آشپزخانه.',
      basePrice: new Prisma.Decimal(99000),
      salePrice: new Prisma.Decimal(89000),
      stockQuantity: 200,
      manageStock: true,
      dimensions: '22x11x7 cm',
      weight: new Prisma.Decimal(0.2),
      featured: true,
      status: ProductStatus.PUBLISHED,
      categoryId: catHome.id,
      rewardType: RewardType.FIXED,
      refereeRewardValue: new Prisma.Decimal(5000),
      referrerRewardValue: new Prisma.Decimal(2500),
      specifications: [
        { label: 'تعداد برگ', value: '۲۰۰ برگ دولایه' },
        { label: 'جنس تیشو', value: '۱۰۰٪ سلولز طبیعی' },
        { label: 'ویژگی', value: 'ضد حساسیت و بدون پرز' },
        { label: 'کاربری', value: 'روزمره، منزل و خودرو' },
      ],
      images: {
        create: [
          {
            url: tissueMedia1?.url || 'http://localhost:4000/uploads/products/tissue.jpg',
            altText: tissueMedia1?.altText || 'تصویر جعبه دستمال کاغذی اقتصادی ۲۰۰ برگ',
            isPrimary: true,
            displayOrder: 0,
          },
          {
            url: tissueMedia2?.url || 'http://localhost:4000/uploads/products/tissue-paper-box-product-white-backgroun-1.jpg',
            altText: tissueMedia2?.altText || 'نمای جعبه دستمال کاغذی اقتصادی رومیزی',
            isPrimary: false,
            displayOrder: 1,
          },
        ],
      },
    },
  });

  // Product 5: برنج باسماتی درجه یک هندی، ۵ کیلوگرم
  const basmatiMedia = mediaMap.get('basmati-rice-bag-product-packshot-white--1.jpg');
  await prisma.product.create({
    data: {
      name: 'برنج باسماتی درجه یک هندی، ۵ کیلوگرم',
      slug: 'basmati-rice-5kg',
      sku: 'SOD-RICE-BASMATI-5KG',
      productType: ProductType.SIMPLE,
      description: 'برنج باسماتی دانه‌بلند ممتاز با قد کشیدن فوق‌العاده هنگام پخت، مناسب انواع پلوهای مجلسی با حفظ بافت و دانه دانه شدن عالی.',
      shortDescription: 'برنج دانه‌بلند مجلسی، قدکشیدگی عالی و دانه‌دانه.',
      basePrice: new Prisma.Decimal(480000),
      salePrice: new Prisma.Decimal(445000),
      stockQuantity: 45,
      manageStock: true,
      dimensions: '35x20x10 cm',
      weight: new Prisma.Decimal(5.0),
      featured: false,
      status: ProductStatus.PUBLISHED,
      categoryId: catGrocery.id,
      rewardType: RewardType.FIXED,
      refereeRewardValue: new Prisma.Decimal(25000),
      referrerRewardValue: new Prisma.Decimal(12000),
      specifications: [
        { label: 'نوع دانه', value: '۱۱۲۱ سوپر باسماتی' },
        { label: 'وزن', value: '۵ کیلوگرم' },
        { label: 'بسته‌بندی', value: 'کیسه پارچه‌ای زیپ‌دار' },
      ],
      images: {
        create: [
          {
            url: basmatiMedia?.url || 'http://localhost:4000/uploads/products/basmati-rice-bag-product-packshot-white--1.jpg',
            altText: basmatiMedia?.altText || 'تصویر کیسه برنج باسماتی هندی ۵ کیلوگرم',
            isPrimary: true,
            displayOrder: 0,
          },
        ],
      },
    },
  });

  // Product 6: روغن زیتون فرابکر طبیعی، ۵۰۰ میلی‌لیتر
  const oliveMedia = mediaMap.get('cooking-oil-bottle-product-white-backgro-1.jpg');
  await prisma.product.create({
    data: {
      name: 'روغن زیتون فرابکر طبیعی، ۵۰۰ میلی‌لیتر',
      slug: 'extra-virgin-olive-oil-500ml',
      sku: 'SOD-OIL-OLIVE-500',
      productType: ProductType.SIMPLE,
      description: 'روغن زیتون فرابکر پرس سرد با اسیدیته زیر ۰.۵ درصد، حاوی آنتی‌اکسیدان‌های طبیعی و عطر دلپذیر زیتون تازه مناسب سالاد و غذاهای سالم.',
      shortDescription: 'روغن زیتون فرابکر پرس سرد، کاملاً خالص و ارگانیک.',
      basePrice: new Prisma.Decimal(295000),
      salePrice: new Prisma.Decimal(270000),
      stockQuantity: 60,
      manageStock: true,
      dimensions: '8x8x26 cm',
      weight: new Prisma.Decimal(0.5),
      featured: false,
      status: ProductStatus.PUBLISHED,
      categoryId: catSupermarket.id,
      rewardType: RewardType.FIXED,
      refereeRewardValue: new Prisma.Decimal(15000),
      referrerRewardValue: new Prisma.Decimal(7500),
      specifications: [
        { label: 'روش استخراج', value: 'پرس سرد اول (Extra Virgin)' },
        { label: 'اسیدیته', value: 'کمتر از ۰.۵ درصد' },
        { label: 'حجم', value: '۵۰۰ میلی‌لیتر' },
      ],
      images: {
        create: [
          {
            url: oliveMedia?.url || 'http://localhost:4000/uploads/products/cooking-oil-bottle-product-white-backgro-1.jpg',
            altText: oliveMedia?.altText || 'تصویر بطری روغن زیتون فرابکر خالص ۵۰۰ میلی‌لیتر',
            isPrimary: true,
            displayOrder: 0,
          },
        ],
      },
    },
  });

  // 9. Flash Deals Campaign (تخفیف شگفت‌انگیز)
  console.log('⚡ Seeding Flash Deals campaign...');
  await prisma.flashDeal.create({
    data: {
      title: 'تخفیف شگفت‌انگیز',
      slug: 'shegeftangiz-deals',
      description: 'تا پایان زمان، فرصت خرید با پاداش بیشتر داری.',
      badgeText: 'فروش ویژه',
      bannerImage: '/assets/promotions/top-promo.gif',
      startDate: new Date(Date.now() - 3600 * 1000),
      endDate: new Date(Date.now() + 72 * 3600 * 1000), // 3 days active
      isActive: true,
      defaultCashback: new Prisma.Decimal(10000),
      defaultReferrerReward: new Prisma.Decimal(5000),
      items: {
        create: [
          {
            productId: rice.id,
            discountType: DiscountType.PERCENTAGE,
            discountValue: new Prisma.Decimal(12),
            specialPrice: new Prisma.Decimal(198000),
            cashbackAmount: new Prisma.Decimal(12000),
            referrerReward: new Prisma.Decimal(6000),
            stockLimit: 100,
            soldCount: 42,
          },
          {
            productId: oil.id,
            discountType: DiscountType.PERCENTAGE,
            discountValue: new Prisma.Decimal(15),
            specialPrice: new Prisma.Decimal(169000),
            cashbackAmount: new Prisma.Decimal(9000),
            referrerReward: new Prisma.Decimal(4500),
            stockLimit: 100,
            soldCount: 38,
          },
          {
            productId: tea.id,
            discountType: DiscountType.PERCENTAGE,
            discountValue: new Prisma.Decimal(10),
            specialPrice: new Prisma.Decimal(142000),
            cashbackAmount: new Prisma.Decimal(8000),
            referrerReward: new Prisma.Decimal(4000),
            stockLimit: 80,
            soldCount: 25,
          },
          {
            productId: tissue.id,
            discountType: DiscountType.PERCENTAGE,
            discountValue: new Prisma.Decimal(10),
            specialPrice: new Prisma.Decimal(89000),
            cashbackAmount: new Prisma.Decimal(5000),
            referrerReward: new Prisma.Decimal(2500),
            stockLimit: 150,
            soldCount: 71,
          },
        ],
      },
    },
  });

  // 10. Shipping Methods
  console.log('🚚 Seeding shipping methods...');
  await prisma.shippingMethod.createMany({
    data: [
      {
        name: 'ارسال عادی',
        type: 'FIXED',
        price: new Prisma.Decimal(20000),
        carrier: 'پیک سودانه',
        estimatedDays: '۱ تا ۲ روز کاری',
        description: 'تحویل منظم سفارش‌ها درب منزل',
        isDefault: true,
        displayOrder: 1,
      },
      {
        name: 'ارسال سریع',
        type: 'FIXED',
        price: new Prisma.Decimal(45000),
        carrier: 'پیک اکسپرس سودانه',
        estimatedDays: 'تحویل امروز، ۱۸ تا ۲۱',
        description: 'ارسال فوری با اولویت بالا در همان روز',
        isDefault: false,
        displayOrder: 2,
      },
    ],
  });

  // 11. Sample Orders for Maryam (#10248 and #10192)
  console.log('🛒 Seeding demo orders...');
  await prisma.order.create({
    data: {
      orderNumber: '10248',
      userId: maryam.id,
      customerName: 'مریم احمدی',
      customerEmail: 'maryam.ahmadi@example.com',
      customerPhone: '09121234567',
      status: OrderStatus.PROCESSING,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'online',
      subtotal: new Prisma.Decimal(456000),
      discountAmount: new Prisma.Decimal(89000),
      shippingAmount: new Prisma.Decimal(20000),
      totalAmount: new Prisma.Decimal(367000),
      walletAmountPaid: new Prisma.Decimal(50000),
      cashAmountPaid: new Prisma.Decimal(317000),
      currency: 'IRT',
      shippingAddress: {
        recipientName: 'مریم احمدی',
        phone: '09121234567',
        street: 'تهران، سعادت‌آباد، بلوار دریا، پلاک ۲۴',
        city: 'تهران',
        province: 'تهران',
        postalCode: '1998877665',
        country: 'ایران',
      },
      shippingMethod: 'ارسال عادی',
      items: {
        create: [
          {
            productId: rice.id,
            productName: rice.name,
            productSku: rice.sku,
            productImage: riceMedia1?.url || 'http://localhost:4000/uploads/products/rice.png',
            unitPrice: new Prisma.Decimal(198000),
            quantity: 1,
            totalPrice: new Prisma.Decimal(198000),
            cashbackEarned: new Prisma.Decimal(12000),
          },
          {
            productId: oil.id,
            productName: oil.name,
            productSku: oil.sku,
            productImage: oilMedia1?.url || 'http://localhost:4000/uploads/products/oil.jpg',
            unitPrice: new Prisma.Decimal(169000),
            quantity: 1,
            totalPrice: new Prisma.Decimal(169000),
            cashbackEarned: new Prisma.Decimal(9000),
          },
          {
            productId: tissue.id,
            productName: tissue.name,
            productSku: tissue.sku,
            productImage: tissueMedia1?.url || 'http://localhost:4000/uploads/products/tissue.jpg',
            unitPrice: new Prisma.Decimal(89000),
            quantity: 1,
            totalPrice: new Prisma.Decimal(89000),
            cashbackEarned: new Prisma.Decimal(5000),
          },
        ],
      },
      timeline: {
        create: [
          {
            status: OrderStatus.PENDING,
            note: 'ثبت اولیه سفارش در اپلیکیشن',
          },
          {
            status: OrderStatus.PROCESSING,
            note: 'تأیید پرداخت آنلاین و شروع بسته‌بندی در انبار مرکزی',
          },
        ],
      },
    },
  });

  await prisma.order.create({
    data: {
      orderNumber: '10192',
      userId: maryam.id,
      customerName: 'مریم احمدی',
      customerEmail: 'maryam.ahmadi@example.com',
      customerPhone: '09121234567',
      status: OrderStatus.DELIVERED,
      paymentStatus: PaymentStatus.PAID,
      paymentMethod: 'online',
      subtotal: new Prisma.Decimal(258000),
      discountAmount: new Prisma.Decimal(0),
      shippingAmount: new Prisma.Decimal(0),
      totalAmount: new Prisma.Decimal(258000),
      walletAmountPaid: new Prisma.Decimal(0),
      cashAmountPaid: new Prisma.Decimal(258000),
      currency: 'IRT',
      shippingAddress: {
        recipientName: 'مریم احمدی',
        phone: '09121234567',
        street: 'تهران، سعادت‌آباد، بلوار دریا، پلاک ۲۴',
        city: 'تهران',
        province: 'تهران',
        postalCode: '1998877665',
        country: 'ایران',
      },
      deliveredAt: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      items: {
        create: [
          {
            productId: oil.id,
            productName: oil.name,
            productSku: oil.sku,
            productImage: oilMedia1?.url || 'http://localhost:4000/uploads/products/oil.jpg',
            unitPrice: new Prisma.Decimal(169000),
            quantity: 1,
            totalPrice: new Prisma.Decimal(169000),
            cashbackEarned: new Prisma.Decimal(9000),
          },
          {
            productId: tissue.id,
            productName: tissue.name,
            productSku: tissue.sku,
            productImage: tissueMedia1?.url || 'http://localhost:4000/uploads/products/tissue.jpg',
            unitPrice: new Prisma.Decimal(89000),
            quantity: 1,
            totalPrice: new Prisma.Decimal(89000),
            cashbackEarned: new Prisma.Decimal(5000),
          },
        ],
      },
      timeline: {
        create: [
          { status: OrderStatus.PENDING, note: 'ثبت سفارش' },
          { status: OrderStatus.PROCESSING, note: 'آماده‌سازی بسته' },
          { status: OrderStatus.SHIPPED, note: 'تحویل به سفیر ارسال' },
          { status: OrderStatus.DELIVERED, note: 'تحویل موفق به مشتری' },
        ],
      },
    },
  });

  // 12. Customer Notifications
  console.log('🔔 Seeding notifications...');
  await prisma.notification.createMany({
    data: [
      {
        userId: maryam.id,
        title: 'سفارش شما در حال آماده‌سازی است',
        message: 'سفارش #۱۰۲۴۸ اکنون در مرحله آماده‌سازی قرار دارد.',
        type: NotificationType.ORDER,
        priority: NotificationPriority.HIGH,
        isRead: false,
      },
      {
        userId: maryam.id,
        title: 'پاداش خرید فعال شد',
        message: '۱۲٬۰۰۰ تومان به کیف پول پاداش شما اضافه شد.',
        type: NotificationType.WALLET,
        priority: NotificationPriority.NORMAL,
        isRead: false,
      },
      {
        userId: maryam.id,
        title: 'فروش ویژه امروز',
        message: 'روی کالاهای منتخب تا ۳۰٪ تخفیف بگیرید.',
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.LOW,
        isRead: true,
      },
    ],
  });

  // 13. Promotional Coupons
  console.log('🏷️ Seeding promotional coupons...');
  await prisma.coupon.create({
    data: {
      code: 'SODANEH20',
      description: '۲۰ درصد تخفیف ویژه خرید اول',
      discountType: DiscountType.PERCENTAGE,
      discountValue: new Prisma.Decimal(20),
      minOrderAmount: new Prisma.Decimal(100000),
      maxDiscountAmount: new Prisma.Decimal(50000),
      isActive: true,
      usageLimit: 500,
      usageCount: 12,
    },
  });

  // 14. Blog Articles
  console.log('📝 Seeding blog articles...');
  const blogCat = await prisma.blogCategory.create({
    data: {
      name: 'سبک زندگی و سلامت',
      slug: 'healthy-lifestyle',
      description: 'نکات سلامت، تغذیه و راهنمای خرید هوشمندانه',
      displayOrder: 1,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'راهنمای تشخیص برنج اصل ایرانی و روش پخت قدکشیده',
      slug: 'guide-iranian-rice-cooking',
      excerpt: 'چگونه برنج هاشمی و دم‌سیاه اصیل را از نمونه‌های تقلبی تشخیص دهیم و بهترین روش دم‌اندازی چیست.',
      content: 'برنج هاشمی اصیل گیلان با عطر طبیعی و بافت استخوانی شناخته می‌شود. برای پخت بهتر، برنج را حداقل ۲ ساعت در آب‌نمک ولرم خیس کنید...',
      status: PostStatus.PUBLISHED,
      authorId: adminId,
      categoryId: blogCat.id,
      featuredImage: riceMedia1?.url || 'http://localhost:4000/uploads/products/rice.png',
    },
  });

  const totalMedia = await prisma.media.count();
  console.log(`🎉 Sodaneh e-commerce seed completed successfully!`);
  console.log(`📊 Registered ${totalMedia} items in Media Library (کتابخانه پرونده‌های چندرسانه‌ای).`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
