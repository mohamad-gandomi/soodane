const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');
const { parseEnv } = require('node:util');

function privateWrite(target, contents) {
  fs.writeFileSync(target, contents, { flag: 'wx', mode: 0o600 });
}

function initializeProductionEnv(rootDirectory, adminEmail) {
  const email = typeof adminEmail === 'string' ? adminEmail.trim().toLowerCase() : '';
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Provide the intended administrator email as the first argument.');
  }
  const deployment = path.join(rootDirectory, 'frontend', 'deploy');
  const apiTarget = path.join(rootDirectory, 'core', '.env');
  const results = [];
  if (!fs.existsSync(apiTarget)) {
    const database = parseEnv(fs.readFileSync(path.join(deployment, '.env.database'), 'utf8'));
    if (!database.POSTGRES_USER || !database.POSTGRES_DB || !database.POSTGRES_PASSWORD) {
      throw new Error('Initialize the private database configuration first.');
    }
    const connection = new URL('postgresql://127.0.0.1:5434/');
    connection.username = database.POSTGRES_USER;
    connection.password = database.POSTGRES_PASSWORD;
    connection.pathname = '/' + encodeURIComponent(database.POSTGRES_DB);
    connection.searchParams.set('schema', 'public');
    const replacements = {
      DATABASE_URL: connection.href,
      JWT_SECRET: randomBytes(32).toString('hex'),
      ORDER_PAYMENT_SECRET: randomBytes(32).toString('hex'),
      ORDER_TRACKING_SECRET: randomBytes(32).toString('hex'),
      ADMIN_DEFAULT_EMAIL: email,
      ADMIN_INITIAL_PASSWORD: randomBytes(24).toString('hex'),
    };
    let api = fs.readFileSync(path.join(deployment, 'api.production.env.example'), 'utf8');
    for (const [key, value] of Object.entries(replacements)) {
      const assignment = new RegExp('^' + key + '=.*$', 'gm');
      if ([...api.matchAll(assignment)].length !== 1) throw new Error('Invalid API template.');
      api = api.replace(assignment, () => key + '=' + value);
    }
    privateWrite(apiTarget, api);
    results.push('Created core/.env with independent random secrets and administrator password.');
  } else {
    results.push('Preserved existing core/.env; no credentials changed.');
  }
  const publicFiles = [
    [path.join(deployment, 'admin.production.env.example'), path.join(rootDirectory, 'core', 'frontend', '.env.local'), 'dashboard'],
    [path.join(rootDirectory, 'frontend', '.env.example'), path.join(rootDirectory, 'frontend', '.env.local'), 'storefront'],
  ];
  for (const [source, target, label] of publicFiles) {
    if (fs.existsSync(target)) {
      results.push('Preserved existing ' + label + ' configuration.');
    } else {
      privateWrite(target, fs.readFileSync(source, 'utf8'));
      results.push('Created ' + label + ' configuration for sodaneh.ir.');
    }
  }
  return results;
}

if (require.main === module) {
  try {
    for (const message of initializeProductionEnv(path.resolve(__dirname, '..', '..'), process.argv[2])) {
      console.log(message);
    }
    console.log('No secrets printed. Payment and SMS providers still require configuration before customer use.');
  } catch {
    console.error('Production configuration failed. Check the email argument, database configuration and directory permissions. Existing files were not overwritten.');
    process.exitCode = 1;
  }
}
module.exports = { initializeProductionEnv };
