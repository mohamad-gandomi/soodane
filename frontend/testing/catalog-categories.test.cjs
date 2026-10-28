const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
function load(name, imports = {}) {
  const source = fs.readFileSync(path.join(__dirname, '..', name), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(key => imports[key] ?? require(key), mod, mod.exports);
  return mod.exports;
}
const { matchesProductCategories } = load('src/lib/catalog.ts');
const categories = [
  { id: 'food', slug: 'food-slug', name: 'مواد غذایی' },
  { id: 'rice', slug: 'rice-slug', name: 'برنج', parentId: 'food' },
  { id: 'local-rice', slug: 'local-rice-slug', name: 'برنج ایرانی', parentId: 'rice' },
  { id: 'beauty', slug: 'beauty-slug', name: 'آرایشی' },
];
test('backend category IDs/slugs include nested descendants and exclude unrelated products', () => {
  const product = { categoryId: 'local-rice' };
  assert.equal(matchesProductCategories(product, [], categories), true);
  for (const selection of ['food-slug', 'rice-slug', 'local-rice-slug', 'food']) {
    assert.equal(matchesProductCategories(product, [selection], categories), true);
  }
  assert.equal(matchesProductCategories(product, ['beauty-slug'], categories), false);
  assert.equal(matchesProductCategories(product, ['removed-category'], categories), false);
});
test('missing category metadata and cycles cannot produce false matches or hang', () => {
  assert.equal(matchesProductCategories({ category: { id: 'rice', slug: 'rice-slug' } }, ['rice-slug'], []), true);
  assert.equal(matchesProductCategories({ categories: ['tea'] }, ['tea'], []), true);
  assert.equal(matchesProductCategories({}, ['rice'], categories), false);
  assert.equal(matchesProductCategories({ categoryId: 'a' }, ['absent'], [{ id: 'a', slug: 'a', parentId: 'b' }, { id: 'b', slug: 'b', parentId: 'a' }]), false);
});
test('API product normalization keeps zero sale prices, primary image and real categories', async () => {
  const { productsService } = load('src/services/products.service.ts', {
    '@/lib/api-client': { apiClient: async () => [
      { id: 'p', basePrice: '100', salePrice: 0, category: { slug: 'real-rice' }, images: [{ url: 'secondary' }, { url: 'primary', isPrimary: true }] },
      { id: 'q', basePrice: '200', categories: [{ category: { slug: 'tea' } }] },
      { id: 'r', basePrice: '300' },
    ] },
  });
  const [first, second, third] = await productsService.getProducts();
  assert.equal(first.price, 0);
  assert.equal(first.oldPrice, 100);
  assert.equal(first.image, 'primary');
  assert.deepEqual(first.categories, ['real-rice']);
  assert.deepEqual(second.categories, ['tea']);
  assert.deepEqual(third.categories, []);
});
