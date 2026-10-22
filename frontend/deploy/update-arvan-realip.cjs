const fs = require('node:fs');
const net = require('node:net');
const { execFileSync } = require('node:child_process');

const sourceUrl = 'https://www.arvancloud.ir/fa/ips.txt';
const marker = '# Managed by Sodaneh: trusted Arvan CDN peers.\n';
const target = '/etc/nginx/conf.d/sodaneh-arvan-realip.conf';

function createConfiguration(text) {
  if (typeof text !== 'string' || text.length > 32768) throw new Error('Invalid CDN address list.');
  const ranges = [...new Set(text.trim().split(/\s+/))];
  if (ranges.length < 1 || ranges.length > 200) throw new Error('Invalid CDN address count.');
  for (const range of ranges) {
    const parts = range.split('/');
    const version = net.isIP(parts[0]);
    const prefix = /^\d{1,3}$/.test(parts[1] || '') ? Number(parts[1]) : NaN;
    if (parts.length !== 2 || !version || /[^a-fA-F0-9:.]/.test(parts[0])
      || !Number.isInteger(prefix) || prefix < (version === 4 ? 8 : 16) || prefix > (version === 4 ? 32 : 128)) {
      throw new Error('Invalid or overly broad CDN address range.');
    }
  }
  return marker + '# Source: ' + sourceUrl + '\n'
    + ranges.map(range => 'set_real_ip_from ' + range + ';').join('\n')
    + '\nreal_ip_header X-Real-IP;\nreal_ip_recursive off;\n';
}

function applyConfiguration(configuration, destination = target, execute = execFileSync) {
  let previous = null;
  try {
    const metadata = fs.lstatSync(destination);
    if (!metadata.isFile() || metadata.isSymbolicLink()) throw new Error('Refusing to replace a non-regular configuration.');
    previous = fs.readFileSync(destination, 'utf8');
    if (!previous.startsWith(marker)) throw new Error('Refusing to replace an unmanaged configuration.');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (!configuration.startsWith(marker)) throw new Error('Unmanaged configuration input.');
  const temporary = destination + '.tmp-' + process.pid;
  const write = contents => {
    fs.writeFileSync(temporary, contents, { flag: 'wx', mode: 0o644 });
    try { fs.renameSync(temporary, destination); }
    finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  };
  write(configuration);
  try {
    execute('nginx', ['-t'], { stdio: 'inherit' });
    execute('systemctl', ['reload', 'nginx'], { stdio: 'inherit' });
  } catch {
    if (previous === null) fs.unlinkSync(destination);
    else write(previous);
    throw new Error('Nginx validation/reload failed; the previous configuration file was restored. Check nginx status before retrying.');
  }
}

async function main() {
  if (process.platform !== 'linux' || process.getuid() !== 0) throw new Error('Run as root on the Linux server.');
  const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(20000) });
  const resolved = new URL(response.url);
  if (!response.ok || resolved.protocol !== 'https:' || !['arvancloud.ir', 'www.arvancloud.ir'].includes(resolved.hostname)) {
    throw new Error('Could not retrieve the official Arvan CDN address list.');
  }
  const configuration = createConfiguration(await response.text());
  applyConfiguration(configuration);
  console.log('Installed trusted Arvan peers and reloaded Nginx. Client addresses are accepted only from the official CDN ranges.');
  console.log('Application code, TLS certificate configuration and firewall rules were not changed.');
}

if (require.main === module) main().catch(error => {
  console.error('Arvan real-IP setup stopped: ' + error.message);
  process.exitCode = 1;
});
module.exports = { createConfiguration, applyConfiguration };
