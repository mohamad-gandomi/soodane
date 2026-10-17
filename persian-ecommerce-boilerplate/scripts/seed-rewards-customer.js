const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customer = await prisma.user.findFirst({
    where: { phone: '09355396804' },
  });

  if (!customer) {
    console.error('Customer 09355396804 not found!');
    return;
  }

  console.log('Customer found:', customer.id);

  // 1. Ensure wallet has 380,000 balance
  const wallet = await prisma.wallet.upsert({
    where: { userId: customer.id },
    create: {
      userId: customer.id,
      balance: 380000,
      currency: 'IRT',
      isActive: true,
    },
    update: {
      balance: 380000,
      isActive: true,
    },
  });
  console.log('Wallet updated:', wallet.id, wallet.balance);

  // 2. Ensure transactions exist for this wallet matching Image 1 & Image 3
  // Clear any existing transactions for this wallet first to have exact clean data
  await prisma.walletTransaction.deleteMany({
    where: { walletId: wallet.id },
  });

  const now = new Date();
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);
  const sixDaysAgo = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);

  const transactionsData = [
    {
      walletId: wallet.id,
      amount: 12000,
      balanceBefore: 368000,
      balanceAfter: 380000,
      type: 'CASHBACK',
      description: 'پاداش خرید (برنج هاشمی ممتاز)',
      referenceId: '10248',
      createdAt: twoHoursAgo,
    },
    {
      walletId: wallet.id,
      amount: 6000,
      balanceBefore: 362000,
      balanceAfter: 368000,
      type: 'REFERRAL_REWARD',
      description: 'پاداش معرفی مستقیم - خرید مریم احمدی (سفارش #۱۰۲۴۷)',
      referenceId: '10247',
      createdAt: fiveHoursAgo,
    },
    {
      walletId: wallet.id,
      amount: -50000,
      balanceBefore: 412000,
      balanceAfter: 362000,
      type: 'ORDER_PAYMENT',
      description: 'استفاده از پاداش (سفارش #۱۰۲۳۹)',
      referenceId: '10239',
      createdAt: twoDaysAgo,
    },
    {
      walletId: wallet.id,
      amount: 8000,
      balanceBefore: 404000,
      balanceAfter: 412000,
      type: 'CASHBACK',
      description: 'پاداش خرید (چای سیاه ممتاز)',
      referenceId: '10238',
      createdAt: twoDaysAgo,
    },
    {
      walletId: wallet.id,
      amount: 20000,
      balanceBefore: 384000,
      balanceAfter: 404000,
      type: 'REFUND',
      description: 'بازگشت پاداش مصرف‌شده (اصلاح سفارش #۱۰۲۱۰)',
      referenceId: '10210',
      createdAt: sixDaysAgo,
    },
  ];

  for (const t of transactionsData) {
    await prisma.walletTransaction.create({ data: t });
  }
  console.log('5 transactions created for wallet', wallet.id);

  // 3. Referral code for customer: REF-CVSP
  const refCode = await prisma.referralCode.upsert({
    where: { ownerId: customer.id },
    create: {
      ownerId: customer.id,
      code: 'REF-CVSP',
      clickCount: 48,
      successfulReferrals: 2,
      totalEarned: 330000,
      isActive: true,
    },
    update: {
      code: 'REF-CVSP',
      clickCount: 48,
      successfulReferrals: 2,
      totalEarned: 330000,
      isActive: true,
    },
  });
  console.log('Referral code updated:', refCode.code, refCode.totalEarned);

  // 4. Ensure referee users exist:
  // Maryam Ahmadi (مریم احمدی)
  let maryam = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'maryam.ahmadi@example.com' },
        { phone: '09121234567' },
      ],
    },
  });
  if (maryam) {
    await prisma.user.update({
      where: { id: maryam.id },
      data: { firstName: 'مریم', lastName: 'احمدی' },
    });
  } else {
    maryam = await prisma.user.create({
      data: {
        email: 'maryam.ahmadi@example.com',
        phone: '09121234567',
        firstName: 'مریم',
        lastName: 'احمدی',
        passwordHash: '$2a$10$abcdefghij',
      },
    });
  }

  // Reza Karimi (رضا کریمی)
  let reza = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'reza.karimi@example.com' },
        { phone: '09123333333' },
      ],
    },
  });
  if (reza) {
    await prisma.user.update({
      where: { id: reza.id },
      data: { firstName: 'رضا', lastName: 'کریمی' },
    });
  } else {
    reza = await prisma.user.create({
      data: {
        email: 'reza.karimi@example.com',
        phone: '09123333333',
        firstName: 'رضا',
        lastName: 'کریمی',
        passwordHash: '$2a$10$abcdefghij',
      },
    });
  }

  // Delete existing referrals pointing to this referralCode or with these referees
  await prisma.referral.deleteMany({
    where: {
      OR: [
        { referralCodeId: refCode.id },
        { refereeId: maryam.id },
        { refereeId: reza.id },
      ],
    },
  });

  // Create referrals
  // Maryam Ahmadi: joined 10 Shahrivar 1404 (~ Sep 1, 2025/2026), 3 purchases, reward 35,000
  await prisma.referral.create({
    data: {
      referralCodeId: refCode.id,
      referrerId: customer.id,
      refereeId: maryam.id,
      status: 'COMPLETED',
      rewardAmountReferrer: 35000,
      rewardAmountReferee: 15000,
      rewardedAt: new Date('2026-09-01T10:00:00Z'),
      createdAt: new Date('2026-09-01T08:00:00Z'),
    },
  });

  // Reza Karimi: joined 18 Mordad 1404 (~ Aug 9, 2025/2026), 1 purchase, reward 12,000
  await prisma.referral.create({
    data: {
      referralCodeId: refCode.id,
      referrerId: customer.id,
      refereeId: reza.id,
      status: 'COMPLETED',
      rewardAmountReferrer: 12000,
      rewardAmountReferee: 10000,
      rewardedAt: new Date('2026-08-09T14:30:00Z'),
      createdAt: new Date('2026-08-09T12:00:00Z'),
    },
  });

  console.log('Referrals created for Maryam and Reza!');

  // 5. Notifications matching Image 1
  await prisma.notification.deleteMany({
    where: { userId: customer.id },
  });

  const notifDate = new Date('2026-10-07T10:00:00Z'); // ۱۴۰۵/۷/۱۵

  await prisma.notification.createMany({
    data: [
      {
        userId: customer.id,
        title: 'فروش ویژه امروز',
        message: 'روی کالاهای منتخب تا ۳۰٪ تخفیف بگیرید.',
        type: 'SYSTEM',
        isRead: false,
        createdAt: notifDate,
      },
      {
        userId: customer.id,
        title: 'سفارش شما در حال آماده‌سازی است',
        message: 'سفارش #۱۰۲۴۸ اکنون در مرحله آماده‌سازی قرار دارد.',
        type: 'ORDER',
        isRead: false,
        createdAt: notifDate,
      },
      {
        userId: customer.id,
        title: 'پاداش خرید فعال شد',
        message: '۱۲,۰۰۰ تومان به کیف پول پاداش شما اضافه شد.',
        type: 'WALLET',
        isRead: false,
        createdAt: notifDate,
      },
    ],
  });
  console.log('3 notifications created for customer!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
