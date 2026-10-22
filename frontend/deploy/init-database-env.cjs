const fs = require('node:fs');
const path = require('node:path');
const { randomBytes } = require('node:crypto');

function initializeDatabaseEnv(directory) {
  const target = path.join(directory, '.env.database');
  if (fs.existsSync(target)) return false;
  fs.writeFileSync(target, [
    'POSTGRES_USER=sodaneh_user',
    'POSTGRES_DB=sodaneh_db',
    'POSTGRES_PASSWORD=' + randomBytes(32).toString('hex'),
    '',
  ].join('\n'), { flag: 'wx', mode: 0o600 });
  return true;
}

if (require.main === module) {
  try {
    const created = initializeDatabaseEnv(__dirname);
    console.log(created ? 'Database configuration created with a random password; no secrets printed.' : 'Existing database configuration preserved; password unchanged.');
  } catch {
    console.error('Database configuration could not be created; no existing file was overwritten.');
    process.exitCode = 1;
  }
}
module.exports = { initializeDatabaseEnv };
