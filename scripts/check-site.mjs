import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [];
for (const entry of ['index.html', '404.html', 'assets', 'data', 'apps']) {
  const visit = file => {
    if (!fs.existsSync(file)) throw new Error(`Missing public file: ${file}`);
    if (fs.statSync(file).isDirectory()) fs.readdirSync(file).forEach(name => visit(path.join(file, name)));
    else files.push(file);
  };
  visit(path.join(root, entry));
}
let localLinks = 0;
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  if (/\.[cm]?js$/.test(file)) execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  if (!/\.html$/.test(file)) continue;
  if (!/<title>.+<\/title>/s.test(text)) throw new Error(`Missing title: ${file}`);
  for (const match of text.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
    const href = match[1];
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i.test(href)) continue;
    const pathname = href.split(/[?#]/)[0];
    if (!pathname) continue;
    let target = path.resolve(path.dirname(file), pathname);
    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
    if (!fs.existsSync(target)) throw new Error(`Broken local link in ${path.relative(root, file)}: ${href}`);
    localLinks++;
  }
}
console.log(`Checked ${files.length} public source files and ${localLinks} local links; JavaScript syntax valid.`);
