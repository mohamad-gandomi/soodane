const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = '/opt/soodane';
const serviceUser = 'sodaneh-app';
const services = ['api', 'dashboard', 'storefront'].map(name => 'sodaneh-' + name + '.service');
const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' });
const capture = (command, args) => execFileSync(command, args, {
  encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], env: { ...process.env, LC_ALL: 'C' },
}).trim();

function applicationPath(relative) {
  const resolved = fs.realpathSync(path.join(root, relative));
  if (!resolved.startsWith(root + '/')) throw new Error('Application path leaves the deployment directory.');
  return resolved;
}

function installServices() {
  if (process.platform !== 'linux' || process.getuid() !== 0) throw new Error('Run this installer as root on the Linux server.');
  if (fs.realpathSync(path.resolve(__dirname, '..', '..')) !== root || fs.realpathSync(root) !== root) {
    throw new Error('Expected the deployment at /opt/soodane.');
  }
  const firewall = capture('ufw', ['status']);
  if (!/^Status: active$/m.test(firewall) || !/^4000\/tcp\s+DENY\s+/m.test(firewall)) {
    throw new Error('Enable the firewall and deny direct access to TCP port 4000 before starting the API.');
  }
  fs.accessSync('/usr/local/bin/node', fs.constants.X_OK);
  for (const artifact of [
    'core/dist/main.js',
    'core/frontend/.next/BUILD_ID', 'frontend/.next/BUILD_ID',
    'core/frontend/node_modules/next/dist/bin/next', 'frontend/node_modules/next/dist/bin/next',
  ]) applicationPath(artifact);
  const privateFiles = ['core/.env', 'core/frontend/.env.local', 'frontend/.env.local'].map(applicationPath);
  const templateDirectory = path.join(__dirname, 'systemd');
  const units = services.map(name => {
    const contents = fs.readFileSync(path.join(templateDirectory, name), 'utf8');
    const target = '/etc/systemd/system/' + name;
    if (fs.existsSync(target) && !fs.readFileSync(target, 'utf8').startsWith('# Managed by Sodaneh deployment.')) {
      throw new Error('Refusing to replace a service not managed by this deployment: ' + name);
    }
    return { contents, target };
  });
  let userExists = false;
  try { capture('id', ['-u', serviceUser]); userExists = true; } catch { /* Create the dedicated account below. */ }
  if (!userExists) {
    run('useradd', ['--system', '--user-group', '--no-create-home', '--home-dir', '/nonexistent', '--shell', '/usr/sbin/nologin', serviceUser]);
  }
  if (capture('id', ['-u', serviceUser]) === '0' || capture('id', ['-gn', serviceUser]) !== serviceUser) {
    throw new Error('The dedicated service account has unexpected privileges or group.');
  }
  // Source files and Git metadata remain owned by the deployment administrator.
  fs.mkdirSync(path.join(root, 'core', 'uploads'), { recursive: true });
  const writable = ['core/uploads', 'core/frontend/.next', 'frontend/.next'].map(applicationPath);
  for (const target of privateFiles) {
    run('chown', ['--no-dereference', serviceUser + ':' + serviceUser, target]);
    fs.chmodSync(target, 0o600);
  }
  for (const target of writable) {
    run('chown', ['--recursive', '--no-dereference', serviceUser + ':' + serviceUser, target]);
  }
  for (const { contents, target } of units) fs.writeFileSync(target, contents, { mode: 0o644 });
  run('systemctl', ['daemon-reload']);
  run('systemctl', ['enable', ...services]);
  run('systemctl', ['restart', ...services]);
  console.log('Installed and started API, dashboard and storefront services. No credentials printed.');
  console.log('Next: verify local HTTP responses, then configure Nginx, DNS and HTTPS.');
}

try { installServices(); }
catch (error) {
  console.error('Service installation stopped: ' + error.message);
  process.exitCode = 1;
}
