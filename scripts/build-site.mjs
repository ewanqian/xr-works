import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist');
const entries = ['index.html', '404.html', 'assets', 'data', 'apps', 'packages'];
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const entry of entries) {
  const source = path.join(root, entry);
  if (!fs.existsSync(source)) {
    if (entry === 'packages') continue;
    throw new Error(`Missing public entry: ${entry}`);
  }
  fs.cpSync(source, path.join(out, entry), {
    recursive: true,
    filter: sourcePath => !/(?:\.test\.[cm]?js|\.md)$/.test(sourcePath),
  });
}
const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(out, 'release.json'), JSON.stringify({
  sourceRepository: 'ewanqian/xr-works', sourceCommit,
  release: 'XR Creations 0.1', studies: ['resonance', 'score', 'atlas', 'garden'],
}, null, 2) + '\n');
fs.writeFileSync(path.join(out, '.nojekyll'), '');
console.log(`Built XR Creations from ${sourceCommit} into dist/`);
