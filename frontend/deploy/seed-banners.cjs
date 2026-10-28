// Run on the deployment host after the storefront assets are published.
// node seed-banners.cjs /opt/soodane/core /path/to/private/backup-directory
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { createRequire } = require('node:module');

async function main() {
  const core = path.resolve(process.argv[2] || '../core');
  const backup = process.argv[3];
  const refreshImages = process.argv.includes('--refresh-images');
  if (!backup) throw new Error('A private backup directory is required.');
  const backendRequire = createRequire(path.join(core, 'package.json'));
  const configRequire = createRequire(fs.realpathSync(path.join(core, 'node_modules/@nestjs/config/package.json')));
  const env = { ...configRequire('dotenv').parse(fs.readFileSync(path.join(core, '.env'))), ...process.env };
  if (!env.JWT_SECRET || !env.DATABASE_URL) throw new Error('Backend configuration is incomplete.');
  const { PrismaClient } = backendRequire('@prisma/client');
  const prisma = new PrismaClient({ datasources: { db: { url: env.DATABASE_URL } } });
  let admin;
  try { admin = await prisma.user.findFirst({ where: { role: 'ADMIN', isActive: true }, select: { id: true, email: true } }); }
  finally { await prisma.$disconnect(); }
  if (!admin) throw new Error('An active administrator is required.');
  const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const unsigned = b64({ alg: 'HS256', typ: 'JWT' }) + '.' + b64({ sub: admin.id, email: admin.email, role: 'ADMIN', iat: now, exp: now + 300 });
  const token = unsigned + '.' + crypto.createHmac('sha256', env.JWT_SECRET).update(unsigned).digest('base64url');
  const base = 'http://127.0.0.1:' + (env.PORT || 4000) + '/' + (env.API_PREFIX || 'api/v1');
  async function api(endpoint, options = {}) {
    const response = await fetch(base + endpoint, { ...options, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error('Banner API returned status ' + response.status);
    return (await response.json()).data;
  }
  const content = JSON.parse(fs.readFileSync(path.join(__dirname, 'banner-content.json'), 'utf8'));
  const before = {};
  for (const key of Object.keys(content)) before[key] = await api('/banners/admin/placements/' + key);
  fs.mkdirSync(backup, { recursive: true, mode: 0o700 });
  fs.writeFileSync(path.join(backup, 'banners-before-' + Date.now() + '.json'), JSON.stringify(before, null, 2), { mode: 0o600, flag: 'wx' });
  const replacementImages = new Map(['oil', 'rice', 'tea'].map(name => [
    'https://app.sodaneh.ir/assets/products/' + name + (name === 'rice' ? '.png' : '.jpg'),
    'https://app.sodaneh.ir/assets/promotions/' + name + '-cutout.webp',
  ]));
  const fields = ['title', 'imageUrl', 'mobileImageUrl', 'altText', 'linkUrl', 'isActive', 'contentType', 'eyebrow', 'displayTitle', 'subtitle', 'buttonText', 'buttonUrl', 'backgroundColor', 'textColor'];
  for (const [key, initialItems] of Object.entries(content)) {
    const current = before[key];
    let items = initialItems;
    if (refreshImages) {
      items = current.items.map(item => {
        const input = Object.fromEntries(fields.filter(field => item[field] !== undefined).map(field => [field, item[field]]));
        input.imageUrl = replacementImages.get(item.imageUrl) || item.imageUrl;
        input.mobileImageUrl = replacementImages.get(item.mobileImageUrl) || item.mobileImageUrl;
        return input;
      });
      const changed = items.some((item, index) => item.imageUrl !== current.items[index].imageUrl || item.mobileImageUrl !== current.items[index].mobileImageUrl);
      if (!changed) { console.log(key + ': no image changes needed'); continue; }
    } else if (current.items.length > 0) { console.log(key + ': preserved existing content'); continue; }
    await api('/banners/admin/placements/' + key, {
      method: 'PUT',
      body: JSON.stringify({ version: current.version, configRevision: current.configRevision, items }),
    });
    const published = await api('/banners/' + key);
    if (published.items.length !== items.filter(item => item.isActive).length) throw new Error('Published count mismatch for ' + key);
    console.log(key + ': published ' + published.items.length + ' items');
  }
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
