const { test } = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const http = require('node:http');
const net = require('node:net');
const path = require('node:path');
const fs = require('node:fs');
const { once } = require('node:events');
const { setTimeout: delay } = require('node:timers/promises');

const frontend = path.resolve(__dirname, '..');

async function unusedPort() {
  const probe = net.createServer();
  probe.listen(0, '127.0.0.1');
  await once(probe, 'listening');
  const port = probe.address().port;
  await new Promise((resolve, reject) => probe.close(error => error ? reject(error) : resolve()));
  return port;
}

function request(port, host, pathname, protocol = 'https', options = {}) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: '127.0.0.1', port, path: pathname, method: options.method || 'GET',
      headers: { Host: host, 'X-Forwarded-Host': host, 'X-Forwarded-Proto': protocol, 'X-Forwarded-Port': protocol === 'https' ? '443' : '80', ...options.headers },
    }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      res.on('error', reject);
    });
    req.setTimeout(5000, () => req.destroy(new Error('Request timed out')));
    req.on('error', reject);
  });
}

test('production domain routing behind an HTTPS reverse proxy', { timeout: 120000 }, async t => {
  assert.ok(fs.existsSync(path.join(frontend, '.next', 'BUILD_ID')), 'Build the frontend with sodaneh.ir production domains first.');
  const backend = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.url === '/api/v1/auth/me' && req.headers.authorization === 'Bearer valid-test-session') {
      res.end(JSON.stringify({ success: true, data: { id: 'test-user' } }));
    } else { res.statusCode = 401; res.end('{}'); }
  });
  backend.listen(0, '127.0.0.1');
  await once(backend, 'listening');
  const backendPort = backend.address().port;
  const port = await unusedPort();
  const child = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: frontend,
    env: {
      ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1',
      CORE_API_INTERNAL_URL: `http://127.0.0.1:${backendPort}/api/v1`,
      LANDING_DOMAIN: 'sodaneh.ir', APP_DOMAIN: 'app.sodaneh.ir',
      NEXT_PUBLIC_APP_URL: 'https://app.sodaneh.ir', NEXT_PUBLIC_SITE_URL: 'https://sodaneh.ir',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let logs = '';
  for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { logs = (logs + chunk.toString()).slice(-12000); });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      if (child.exitCode !== null) throw new Error('Production server exited: ' + logs);
      try { ready = (await request(port, 'app.sodaneh.ir', '/auth', 'http')).status === 200; } catch { /* Wait for the listener. */ }
      if (ready) break;
      await delay(250);
    }
    assert.ok(ready, 'Production server did not become ready: ' + logs);
    for (const protocol of ['http', 'https']) {
      for (const host of ['sodaneh.ir', 'www.sodaneh.ir']) {
        await t.test(protocol + ' landing at ' + host, async () => {
          const response = await request(port, host, '/', protocol);
          assert.equal(response.status, 200, logs);
          assert.ok(response.body.includes('class="landing-scope"'));
        });
      }
    }
    await t.test('authenticated customer app keeps its own homepage', async () => {
      const response = await request(port, 'app.sodaneh.ir', '/', 'https', { headers: { Cookie: 'sodaneh_session=valid-test-session' } });
      assert.equal(response.status, 200);
      assert.ok(!response.body.includes('class="landing-scope"'));
      assert.match(response.headers['cache-control'], /no-store/);
    });
    await t.test('landing preview works behind HTTPS', async () => {
      const response = await request(port, 'app.sodaneh.ir', '/?__domain=landing');
      assert.equal(response.status, 200);
      assert.ok(response.body.includes('class="landing-scope"'));
    });
    await t.test('blog remains on the main domain', async () => {
      const response = await request(port, 'sodaneh.ir', '/blog');
      assert.equal(response.status, 200);
    });
    await t.test('app blog redirects to main domain', async () => {
      const response = await request(port, 'app.sodaneh.ir', '/blog');
      assert.equal(response.status, 307);
      assert.equal(response.headers.location, 'https://sodaneh.ir/blog');
    });
    await t.test('shopping routes redirect to app and preserve query', async () => {
      const response = await request(port, 'sodaneh.ir', '/cart?check=1');
      assert.equal(response.status, 307);
      assert.equal(response.headers.location, 'https://app.sodaneh.ir/cart?check=1');
    });
    await t.test('guests cannot open store pages or dotted product slugs', async () => {
      for (const pathname of ['/', '/products', '/products/item.webp', '/cart?check=1', '/checkout', '/account', '/orders', '/rewards', '/notifications']) {
        const response = await request(port, 'app.sodaneh.ir', pathname);
        assert.equal(response.status, 307, pathname);
        const location = new URL(response.headers.location);
        assert.equal(location.origin, 'https://app.sodaneh.ir');
        assert.equal(location.pathname, '/auth');
        assert.equal(location.searchParams.get('redirect'), pathname);
        assert.match(response.headers['cache-control'], /no-store/);
      }
    });
    await t.test('forged session is rejected and removed', async () => {
      const response = await request(port, 'app.sodaneh.ir', '/cart', 'https', { headers: { Cookie: 'sodaneh_session=forged' } });
      assert.equal(response.status, 307);
      assert.ok(response.headers['set-cookie']);
    });
    await t.test('login and public help pages remain accessible', async () => {
      for (const pathname of ['/auth', '/support', '/legal', '/manifest.json', '/fonts/IRANSansXFaNum-Regular.woff2']) {
        assert.equal((await request(port, 'app.sodaneh.ir', pathname)).status, 200);
      }
    });
    await t.test('session creation validates token, same origin and cookie flags', async () => {
      const options = { method: 'POST', headers: { Origin: 'https://app.sodaneh.ir', Authorization: 'Bearer valid-test-session' } };
      const response = await request(port, 'app.sodaneh.ir', '/api/session', 'https', options);
      assert.equal(response.status, 200);
      const cookie = response.headers['set-cookie'].join(';');
      assert.match(cookie, /HttpOnly/i);
      assert.match(cookie, /Secure/i);
      assert.match(cookie, /SameSite=lax/i);
      assert.ok(!cookie.includes('Domain='));
      assert.equal((await request(port, 'app.sodaneh.ir', '/api/session', 'https', { method: 'POST', headers: { ...options.headers, Origin: 'https://external.invalid' } })).status, 403);
      assert.equal((await request(port, 'app.sodaneh.ir', '/api/session', 'https', { method: 'POST', headers: { Origin: 'https://app.sodaneh.ir', Authorization: 'Bearer forged' } })).status, 401);
      const logout = await request(port, 'app.sodaneh.ir', '/api/session', 'https', { method: 'DELETE', headers: { Origin: 'https://app.sodaneh.ir' } });
      assert.equal(logout.status, 200);
      assert.match(logout.headers['set-cookie'].join(';'), /Max-Age=0/i);
    });
    assert.ok(!logs.includes('Failed to proxy https://localhost'), logs);
  } finally {
    await new Promise(resolve => backend.close(resolve));
    if (child.exitCode === null) {
      const stopped = once(child, 'exit');
      child.kill();
      await stopped;
    }
  }
});
