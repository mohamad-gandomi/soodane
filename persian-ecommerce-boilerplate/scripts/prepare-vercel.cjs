const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../src');
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { walk(file); continue; }
    if (!file.endsWith('.ts')) continue;
    const source = fs.readFileSync(file, 'utf8');
    const output = source.replace(/(['"])@\/([^'"]+)\1/g, (_, quote, target) => {
      let relative = path.relative(path.dirname(file), path.join(root, target)).split(path.sep).join('/');
      if (!relative.startsWith('.')) relative = './' + relative;
      return quote + relative + quote;
    });
    if (source !== output) fs.writeFileSync(file, output);
  }
}
walk(root);
