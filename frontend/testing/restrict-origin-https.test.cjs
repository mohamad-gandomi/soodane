const { test } = require('node:test');
const assert = require('node:assert/strict');
const { parseFirewall, restrictHttps } = require('../deploy/restrict-origin-https.cjs');
const ranges = ['185.143.232.0/22', '188.229.116.16/30'];

function model(failDelete = false) {
  let broad = true;
  const allowed = new Set();
  const actions = [];
  const status = () => [
    'Status: active', 'Logging: on (low)',
    'Default: deny (incoming), allow (outgoing), deny (routed)',
    'New profiles: skip', '',
    'To                         Action      From',
    '--                         ------      ----',
    '22/tcp                     ALLOW IN    Anywhere',
    '80/tcp                     ALLOW IN    Anywhere',
    ...(broad ? ['443/tcp                    ALLOW IN    Anywhere', '443/tcp (v6)               ALLOW IN    Anywhere (v6)'] : []),
    '4000/tcp                   DENY IN     Anywhere',
    '22/tcp (v6)                ALLOW IN    Anywhere (v6)',
    '80/tcp (v6)                ALLOW IN    Anywhere (v6)',
    '4000/tcp (v6)              DENY IN     Anywhere (v6)',
    ...[...allowed].map(range => '443/tcp                    ALLOW IN    ' + range),
    '',
  ].join('\n');
  const execute = args => {
    actions.push(args);
    if (args[0] === 'allow' && args[1] === 'proto') allowed.add(args[4]);
    if (args[0] === '--force') {
      assert.equal(allowed.size, ranges.length);
      broad = false;
      if (failDelete) throw Error('Simulated failure after rule change');
    }
    if (args.join(' ') === 'allow 443/tcp') broad = true;
  };
  return { status, execute, actions };
}

test('CDN allowances are complete before removing public HTTPS; SSH and HTTP are preserved', () => {
  const good = model();
  restrictHttps(ranges, good.status, good.execute);
  assert.equal(parseFirewall(good.status(), ranges).broadHttps, false);
  assert.ok(good.actions.every(args => !args.includes('22/tcp') && !args.includes('80/tcp')));
  restrictHttps(ranges, good.status, good.execute);
  assert.equal(parseFirewall(good.status(), ranges).broadHttps, false);
});

test('failure after deleting public HTTPS restores its original access', () => {
  const rollback = model(true);
  assert.throws(() => restrictHttps(ranges, rollback.status, rollback.execute));
  assert.equal(parseFirewall(rollback.status(), ranges).broadHttps, true);
});

test('incomplete CDN allowances do not remove public HTTPS access', () => {
  const incomplete = model();
  assert.throws(() => restrictHttps(ranges, incomplete.status, args => {
    if (args[0] === 'allow' && args[1] === 'proto' && args[4] === ranges[1]) return;
    incomplete.execute(args);
  }));
  assert.equal(parseFirewall(incomplete.status(), ranges).broadHttps, true);
  assert.ok(!incomplete.actions.some(args => args[0] === '--force'));
});

test('unexpected, inactive or permissive firewall configurations stop without mutations', () => {
  const sample = model().status();
  for (const status of [
    sample.replace('deny (incoming)', 'allow (incoming)'),
    sample.replace('Status: active', 'Status: inactive'),
    sample + 'Nginx Full                 ALLOW IN    Anywhere\n',
    sample.replace('22/tcp                     ALLOW IN    Anywhere\n', ''),
    sample.replace('80/tcp                     ALLOW IN    Anywhere\n', ''),
  ]) {
    const actions = [];
    assert.throws(() => restrictHttps(ranges, () => status, args => actions.push(args)));
    assert.equal(actions.length, 0);
  }
});
