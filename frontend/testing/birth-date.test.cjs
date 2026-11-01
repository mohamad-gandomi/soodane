const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const requireFrontend = createRequire(path.resolve(__dirname, '../package.json'));
const ts = requireFrontend('typescript');
const root = path.resolve(__dirname, '..');

// Exercise production TypeScript with only the storage/network boundary isolated.
function loadSource(relative, overrides = {}, cache = new Map()) {
  const filename = path.resolve(root, relative);
  if (cache.has(filename)) return cache.get(filename).exports;
  const module = { exports: {} };
  cache.set(filename, module);
  const localRequire = (name) => {
    if (Object.hasOwn(overrides, name)) return overrides[name];
    if (name.startsWith('@/') || name.startsWith('.')) {
      const base = name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : path.resolve(path.dirname(filename), name);
      const target = ['.ts', '.tsx', '/index.ts'].map(ext => base + ext).find(p => fs.existsSync(p));
      if (target) return loadSource(path.relative(root, target), overrides, cache);
    }
    return requireFrontend(name);
  };
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    fileName: filename,
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(output, { module, exports: module.exports, require: localRequire, process, console, Date, URLSearchParams, fetch: (...args) => global.fetch(...args) }, { filename });
  return module.exports;
}

function profileService() {
  const calls = [];
  const storage = { setUser() {}, getToken() { return null; } };
  const service = loadSource('src/services/auth.service.ts', {
    '@/lib/storage': { storage },
    '@/lib/api-client': { apiClient: async (endpoint, options) => { calls.push({ endpoint, ...options, body: JSON.parse(options.body) }); return { id: 'fixture-user', ...JSON.parse(options.body) }; } },
  });
  return { service: service.authService, calls };
}

test('profile update converts a Persian birth date to Gregorian ISO before sending', async () => {
  const { service, calls } = profileService();
  await service.updateProfile({ firstName: 'Fixture', birthDate: '۱۳۷۵/۰۶/۲۱' });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].endpoint, '/auth/profile');
  assert.equal(calls[0].body.birthDate, '1996-09-11T00:00:00.000Z');
});

test('typing a first day digit stays incomplete instead of becoming a different date', () => {
  const { maskShamsiDateInput } = loadSource('src/lib/date-utils.ts');
  const result = maskShamsiDateInput('۱۳۷۵/۰۶/۲', '۱۳۷۵/۰۶/');
  assert.equal(result.displayValue, '۱۳۷۵/۰۶/۲');
  assert.equal(result.isValid, false);
});

test('conversion rejects impossible dates rather than rolling them into another month', () => {
  const { shamsiToGregorianIso } = loadSource('src/lib/date-utils.ts');
  assert.equal(shamsiToGregorianIso('۱۴۰۴/۰۷/۳۱'), null);
  assert.equal(shamsiToGregorianIso('۱۴۰۴/۱۲/۳۰'), null);
});

test('optional birth date can be omitted without sending a clearing value', async () => {
  for (const birthDate of [undefined, '', '   ']) {
    const { service, calls } = profileService();
    await service.updateProfile({ firstName: 'Fixture', birthDate });
    assert.equal(Object.hasOwn(calls[0].body, 'birthDate'), false);
  }
});

test('Gregorian ISO values are preserved and Arabic digit dates are converted', async () => {
  for (const birthDate of ['1996-09-11T00:00:00.000Z', '١٣٧٥/٠٦/٢١', '1375/06/21']) {
    const { service, calls } = profileService();
    await service.updateProfile({ birthDate });
    assert.equal(calls[0].body.birthDate, '1996-09-11T00:00:00.000Z');
  }
});

test('complete date keyboard masking and conversion round-trip correctly', () => {
  const dates = loadSource('src/lib/date-utils.ts');
  for (const value of ['1375/06/21', '1399/12/30', '1403/12/30', '1404/12/29']) {
    const masked = dates.maskShamsiDateInput(value);
    assert.equal(masked.isValid, true);
    const iso = dates.shamsiToGregorianIso(value);
    assert.equal(dates.gregorianToShamsiString(iso, false), value);
    const formatted = new Intl.DateTimeFormat('en-US-u-ca-persian', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(iso));
    const part = (type) => formatted.find(p => p.type === type).value;
    assert.equal(`${part('year')}/${part('month')}/${part('day')}`, value);
  }
});

test('profile update rejects invalid or incomplete Shamsi dates before a request', async () => {
  for (const birthDate of ['۱۳۷۵/۰۶/۲', '۱۴۰۴/۰۷/۳۱', '۱۴۰۴/۱۲/۳۰']) {
    const { service, calls } = profileService();
    await assert.rejects(service.updateProfile({ birthDate }), /تاریخ تولد/);
    assert.equal(calls.length, 0);
  }
});
