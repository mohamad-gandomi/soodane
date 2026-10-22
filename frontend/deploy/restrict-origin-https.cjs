const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { createConfiguration } = require('./update-arvan-realip.cjs');

function parseFirewall(status, ranges) {
  if (!/^Status: active$/m.test(status) || !/^Default: deny \(incoming\),/m.test(status)) {
    throw new Error('Expected an active firewall with incoming traffic denied by default.');
  }
  const lines = status.split(/\r?\n/);
  const start = lines.findIndex(line => /^-+\s+-+\s+-+\s*$/.test(line));
  if (start < 0) throw new Error('Could not read the firewall rule table.');
  const rows = [];
  for (const line of lines.slice(start + 1).filter(line => line.trim())) {
    const match = /^(.+?)\s{2,}(ALLOW|DENY) IN\s{2,}(.+?)\s*$/.exec(line);
    if (!match) throw new Error('Unexpected firewall rule format; review before changing access.');
    const destination = match[1].replace(/\s+\(v6\)$/, '');
    const source = match[3].replace(/\s+\(v6\)$/, '');
    const action = match[2];
    const baseline = source === 'Anywhere' && (
      (['22/tcp', '80/tcp', '443/tcp'].includes(destination) && action === 'ALLOW')
      || (destination === '4000/tcp' && action === 'DENY')
    );
    const cdn = destination === '443/tcp' && action === 'ALLOW' && ranges.includes(source);
    if (!baseline && !cdn) throw new Error('Unexpected firewall rule; existing rules need review before restricting HTTPS.');
    rows.push({ destination, source, action, ipv6: /\(v6\)$/.test(match[1]) });
  }
  const families = rows.some(row => row.ipv6) ? [false, true] : [false];
  for (const ipv6 of families) {
    for (const port of ['22/tcp', '80/tcp']) {
      if (!rows.some(row => row.ipv6 === ipv6 && row.destination === port && row.source === 'Anywhere' && row.action === 'ALLOW')) {
        throw new Error('Expected SSH and HTTP access rules are missing.');
      }
    }
  }
  return {
    broadHttps: rows.some(row => row.destination === '443/tcp' && row.source === 'Anywhere' && row.action === 'ALLOW'),
    allowedRanges: new Set(rows.filter(row => row.destination === '443/tcp' && row.action === 'ALLOW' && row.source !== 'Anywhere').map(row => row.source)),
  };
}

function restrictHttps(ranges, capture, execute) {
  const initial = parseFirewall(capture(), ranges);
  // Every CDN range is added and verified before removing public HTTPS access.
  for (const range of ranges) execute(['allow', 'proto', 'tcp', 'from', range, 'to', 'any', 'port', '443']);
  const prepared = parseFirewall(capture(), ranges);
  if (!ranges.every(range => prepared.allowedRanges.has(range))) throw new Error('CDN access rules are incomplete; public access was not removed.');
  try {
    if (initial.broadHttps) execute(['--force', 'delete', 'allow', '443/tcp']);
    const final = parseFirewall(capture(), ranges);
    if (final.broadHttps || !ranges.every(range => final.allowedRanges.has(range))) throw new Error('HTTPS access verification failed.');
  } catch (error) {
    if (initial.broadHttps) {
      try { execute(['allow', '443/tcp']); }
      catch { throw new Error('HTTPS restriction failed and public access could not be restored. Check ufw status from this SSH session.'); }
    }
    throw error;
  }
}

function main() {
  if (process.platform !== 'linux' || process.getuid() !== 0) throw new Error('Run as root on the Linux server.');
  const config = fs.readFileSync('/etc/nginx/conf.d/sodaneh-arvan-realip.conf', 'utf8');
  const ranges = [...config.matchAll(/^set_real_ip_from ([^;]+);$/gm)].map(match => match[1]);
  if (config !== createConfiguration(ranges.join('\n'))) throw new Error('Update the managed Arvan real-IP configuration first.');
  const capture = () => execFileSync('ufw', ['status', 'verbose'], {
    encoding: 'utf8', env: { ...process.env, LC_ALL: 'C' },
  });
  parseFirewall(capture(), ranges);
  fs.mkdirSync('/var/backups/sodaneh', { recursive: true, mode: 0o700 });
  const backup = fs.mkdtempSync('/var/backups/sodaneh/ufw-before-origin-');
  fs.chmodSync(backup, 0o700);
  for (const name of ['user.rules', 'user6.rules', 'ufw.conf']) fs.copyFileSync('/etc/ufw/' + name, backup + '/' + name);
  console.log('Firewall backup: ' + backup);
  restrictHttps(ranges, capture, args => execFileSync('ufw', args, { stdio: 'inherit' }));
  console.log('Public HTTPS access removed; only the installed Arvan CDN ranges are allowed on TCP 443.');
  console.log('SSH port 22 and HTTP port 80 rules were preserved.');
  process.stdout.write(capture());
}

if (require.main === module) {
  try { main(); }
  catch (error) { console.error('Origin HTTPS restriction stopped: ' + error.message); process.exitCode = 1; }
}
module.exports = { parseFirewall, restrictHttps };
