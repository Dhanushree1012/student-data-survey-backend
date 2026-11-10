import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const requiredDirectories = [
  'public',
  'src',
  'src/app',
  'src/components',
  'src/features',
  'src/services',
  'src/core',
  'src/styles',
  'supabase',
  'tests',
  'scripts',
  'infrastructure',
  'docs',
  '.github'
];

test('required project directories exist', () => {
  for (const dir of requiredDirectories) {
    const target = path.join(rootDir, dir);
    assert.equal(fs.existsSync(target), true, `Missing directory: ${dir}`);
  }
});

test('entry points exist', () => {
  const entryFiles = ['index.html', 'src/main.js', 'src/app/app-entry.js'];

  for (const file of entryFiles) {
    const target = path.join(rootDir, file);
    assert.equal(fs.existsSync(target), true, `Missing file: ${file}`);
  }
});
