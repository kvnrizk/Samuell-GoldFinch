import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const nextDir = path.join(root, '.next');

try {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('Removed .next');
} catch (err) {
  console.warn('Could not remove .next:', err.message);
  process.exitCode = 1;
}
