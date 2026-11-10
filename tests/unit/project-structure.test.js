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
  'src/pages',
  'src/components',
  'src/context',
  'src/hooks',
  'src/lib',
  'supabase/migrations',
  'tests',
  'docs',
  '.github',
];

test('required project directories exist', () => {
  for (const dir of requiredDirectories) {
    const target = path.join(rootDir, dir);
    assert.equal(fs.existsSync(target), true, `Missing directory: ${dir}`);
  }
});

test('entry points exist', () => {
  const entryFiles = [
    'index.html',
    'src/main.tsx',
    'src/App.tsx',
    'src/lib/dataService.ts',
    'supabase/migrations/002_live_backend.sql',
  ];

  for (const file of entryFiles) {
    const target = path.join(rootDir, file);
    assert.equal(fs.existsSync(target), true, `Missing file: ${file}`);
  }
});

test('demo data and placeholder backend clients are absent', () => {
  const removedFiles = [
    'src/data/mockData.ts',
    'src/lib/localData.ts',
    'src/services/supabase/client.js',
    'src/services/supabase/auth.service.js',
    'src/services/supabase/database.service.js',
  ];

  for (const file of removedFiles) {
    assert.equal(fs.existsSync(path.join(rootDir, file)), false, `Unexpected demo or placeholder file: ${file}`);
  }
});
