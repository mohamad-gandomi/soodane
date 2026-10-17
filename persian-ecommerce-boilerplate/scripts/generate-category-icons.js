const fs = require('fs');
const path = require('path');

const categories = [
  {
    slug: 'supermarket',
    bg: '#E8F5E9',
    accent: '#2E7D32',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#E8F8F0"/>
      <path d="M28 32h7l6 24h21l5-18H37" stroke="#007749" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      <circle cx="43" cy="63" r="4" fill="#007749"/>
      <circle cx="59" cy="63" r="4" fill="#007749"/>
      <path d="M46 38v8M42 42h8" stroke="#16A34A" stroke-width="2.5" stroke-linecap="round"/>
    `
  },
  {
    slug: 'grocery',
    bg: '#FEF3C7',
    accent: '#D97706',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#FEF9E7"/>
      <path d="M30 40h40l-4 24H34L30 40z" fill="#FDE68A" stroke="#D97706" stroke-width="3" stroke-linejoin="round"/>
      <path d="M36 40c0-8 6-14 14-14s14 6 14 14" stroke="#B45309" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M42 48v8M50 46v10M58 48v8" stroke="#D97706" stroke-width="2" stroke-linecap="round"/>
    `
  },
  {
    slug: 'restaurant',
    bg: '#FFEDD5',
    accent: '#EA580C',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#FFF7ED"/>
      <path d="M30 44c0-10 9-18 20-18s20 8 20 18H30z" fill="#FED7AA" stroke="#EA580C" stroke-width="3"/>
      <rect x="26" y="47" width="48" height="6" rx="3" fill="#FB923C"/>
      <circle cx="50" cy="22" r="3.5" fill="#EA580C"/>
      <path d="M34 57h32c0 8-7 14-16 14s-16-6-16-14z" fill="#FED7AA" stroke="#EA580C" stroke-width="2.5"/>
    `
  },
  {
    slug: 'cafe',
    bg: '#EFEBE9',
    accent: '#6D4C41',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#F7F3F0"/>
      <path d="M32 40h28v18c0 6-5 11-11 11h-6c-6 0-11-5-11-11V40z" fill="#D7CCC8" stroke="#6D4C41" stroke-width="3"/>
      <path d="M60 45h6a6 6 0 0 1 0 12h-6" stroke="#6D4C41" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M40 33c0-3 2-4 2-7M46 33c0-3 2-4 2-7M52 33c0-3 2-4 2-7" stroke="#A1887F" stroke-width="2" stroke-linecap="round"/>
      <path d="M26 71h48" stroke="#6D4C41" stroke-width="3" stroke-linecap="round"/>
    `
  },
  {
    slug: 'pastry',
    bg: '#FCE7F3',
    accent: '#DB2777',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#FDF2F8"/>
      <path d="M34 50h32l-3 18H37L34 50z" fill="#FBCFE8" stroke="#DB2777" stroke-width="3"/>
      <path d="M32 50c0-6 4-10 9-10 2 0 4 1 5 3 2-4 7-6 10-3 3 2 4 6 4 10H32z" fill="#F472B6"/>
      <circle cx="48" cy="33" r="4.5" fill="#E11D48"/>
      <path d="M32 50c3 3 7 3 10 0s7-3 10 0 7 3 10 0" stroke="#BE185D" stroke-width="2" fill="none"/>
    `
  },
  {
    slug: 'bakery',
    bg: '#FFFBEB',
    accent: '#D97706',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#FEF3C7"/>
      <ellipse cx="50" cy="52" rx="22" ry="14" fill="#FDE68A" stroke="#B45309" stroke-width="3"/>
      <path d="M38 48c2 4 4 6 6 8M48 46c2 4 4 6 5 8M58 48c1 3 3 5 4 7" stroke="#B45309" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M34 58c3 5 9 8 16 8s13-3 16-8" stroke="#92400E" stroke-width="2" fill="none"/>
    `
  },
  {
    slug: 'fruit',
    bg: '#FEE2E2',
    accent: '#DC2626',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#FEF2F2"/>
      <path d="M42 38c-8 0-14 7-14 16 0 11 8 18 16 18 3 0 5-1 6-2 1 1 3 2 6 2 8 0 16-7 16-18 0-9-6-16-14-16-4 0-7 2-10 5-3-3-6-5-10-5z" fill="#FCA5A5" stroke="#DC2626" stroke-width="3"/>
      <path d="M50 38c0-8 4-12 8-14" stroke="#16A34A" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M54 26c4 0 8 3 8 7-4 0-8-3-8-7z" fill="#22C55E"/>
    `
  },
  {
    slug: 'protein',
    bg: '#FEE2E2',
    accent: '#B91C1C',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#FFF1F2"/>
      <path d="M36 62c-8-6-10-16-4-24 7-9 22-12 32-4 8 7 8 19 2 26-6 7-22 9-30 2z" fill="#FDA4AF" stroke="#BE123C" stroke-width="3"/>
      <ellipse cx="44" cy="50" rx="5" ry="4" fill="#FFF" stroke="#E11D48" stroke-width="2"/>
      <path d="M56 42c2 3 3 7 1 11M63 46c1 2 2 6 0 9" stroke="#E11D48" stroke-width="2" stroke-linecap="round"/>
    `
  },
  {
    slug: 'juice',
    bg: '#E0F2FE',
    accent: '#0284C7',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#F0F9FF"/>
      <path d="M34 40l4 28c1 4 4 7 8 7h8c4 0 7-3 8-7l4-28H34z" fill="#BAE6FD" stroke="#0284C7" stroke-width="3"/>
      <path d="M32 40h36" stroke="#0284C7" stroke-width="3" stroke-linecap="round"/>
      <path d="M54 40l6-16h8" stroke="#F59E0B" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="44" cy="54" r="5" fill="#38BDF8"/>
      <circle cx="54" cy="62" r="3" fill="#38BDF8"/>
    `
  },
  {
    slug: 'fresh-produce',
    bg: '#ECFDF5',
    accent: '#059669',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#F0FDF4"/>
      <path d="M30 44h40l-4 22H34L30 44z" fill="#A7F3D0" stroke="#059669" stroke-width="3"/>
      <path d="M35 44c2-6 8-12 15-12s13 6 15 12" stroke="#047857" stroke-width="3" fill="none"/>
      <path d="M44 44v8M56 44v8" stroke="#059669" stroke-width="2"/>
    `
  },
  {
    slug: 'home',
    bg: '#F3E8FF',
    accent: '#7E22CE',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#FAF5FF"/>
      <path d="M30 45l20-16 20 16v24a2 2 0 0 1-2 2H32a2 2 0 0 1-2-2V45z" fill="#E9D5FF" stroke="#7E22CE" stroke-width="3"/>
      <path d="M44 71V53h12v18" fill="#FAF5FF" stroke="#7E22CE" stroke-width="2.5"/>
      <path d="M38 38h4v-7h-4v7z" fill="#A855F7"/>
    `
  },
  {
    slug: 'hygiene',
    bg: '#CCFBF1',
    accent: '#0F766E',
    icon: `
      <circle cx="50" cy="50" r="44" fill="#F0FDFA"/>
      <rect x="36" y="42" width="28" height="28" rx="6" fill="#99F6E4" stroke="#0F766E" stroke-width="3"/>
      <path d="M46 42V32h8v10" stroke="#0F766E" stroke-width="3" fill="none"/>
      <path d="M42 32h16" stroke="#0F766E" stroke-width="3" stroke-linecap="round"/>
      <path d="M50 51v10M45 56h10" stroke="#0D9488" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M68 36l3 3M64 30l2 2" stroke="#14B8A6" stroke-width="2" stroke-linecap="round"/>
    `
  }
];

const targetDirs = [
  path.resolve(__dirname, '../uploads/categories'),
  path.resolve(__dirname, '../../frontend/public/assets/categories')
];

targetDirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

for (const cat of categories) {
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  ${cat.icon}
</svg>`;

  for (const dir of targetDirs) {
    const filePath = path.join(dir, `${cat.slug}.svg`);
    fs.writeFileSync(filePath, svgContent.trim(), 'utf8');
  }
  console.log(`Generated category icon: ${cat.slug}.svg`);
}

console.log('✅ All category icons generated successfully!');
