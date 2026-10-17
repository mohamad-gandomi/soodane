const { spawnSync } = require('node:child_process');

function run(args) {
  const result = spawnSync('pnpm', args, { stdio: 'inherit', env: process.env });
  if (result.error || result.status !== 0) throw new Error(`Demo setup failed: ${args[0]}`);
}

async function main() {
  if (process.env.DEMO_BOOTSTRAP !== 'true') return;
  const url = new URL(process.env.DATABASE_URL);
  if (url.pathname !== '/soodane_demo') {
    throw new Error('Demo setup is restricted to the separate soodane_demo database');
  }
  run(['exec', 'prisma', 'db', 'push', '--skip-generate']);
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  let empty;
  try {
    empty = (await prisma.user.count()) === 0 && (await prisma.product.count()) === 0;
  } finally {
    await prisma.$disconnect();
  }
  if (empty) run(['prisma:seed']);
  else console.log('Demo database already contains data; skipping seed.');
}

main().catch(() => {
  console.error('Demo database setup failed. Check the database connection and schema.');
  process.exitCode = 1;
});
