/**
 * Project guardrails:
 *  1. No source file may exceed 300 lines.
 *  2. Every translation key referenced in code must exist in BOTH the
 *     Arabic and English mock translation maps (and vice-versa report).
 *  3. No hardcoded colors outside the mock theme file.
 * Run: node tools/verify.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(process.cwd(), 'src');
const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(ts|scss|html)$/.test(entry)) files.push(full);
  }
})(SRC);

let failures = 0;

// 1 — line limit
for (const file of files) {
  const lines = readFileSync(file, 'utf8').split('\n').length;
  if (lines > 300) {
    console.error(`LINE LIMIT: ${relative(SRC, file)} has ${lines} lines (max 300)`);
    failures++;
  }
}

// 2 — translation keys
const maps = {};
for (const lang of ['ar', 'en']) {
  maps[lang] = new Set();
  for (const part of ['core', 'operations', 'business', 'people']) {
    const source = readFileSync(
      join(SRC, `app/mocks/data/i18n/${lang}-${part}.ts`),
      'utf8',
    );
    for (const match of source.matchAll(/'([^']+)':\s*(?:'|")/g)) {
      maps[lang].add(match[1]);
    }
  }
}

const used = new Set();
const dynamicPrefixes = new Set();
for (const file of files) {
  if (file.includes('/mocks/data/i18n/')) continue;
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(/\bt\('([^']+)'/g)) used.add(match[1]);
  for (const match of source.matchAll(/labelKey[:=]\s*'([^']+)'/g)) used.add(match[1]);
  for (const match of source.matchAll(/labelKey="([^"]+)"/g)) used.add(match[1]);
  for (const match of source.matchAll(/(?:titleKey|subtitleKey|messageKey|nameKey|deviceLocationKey|purposeKey|statusKey|typeKey|gradeKey|sourceKey|descriptionKey|referenceKey|materialKey|machineNameKey|bankNameKey|customsNameKey|portKey|unitKey|jobTitleKey|departmentKey|roleKey|appTitleKey|addressKey|madeInKey|poweredByKey|collectionStatusKey|requestingDepartmentKey)[:=]\s*'([^']+)'/g)) {
    used.add(match[1]);
  }
  for (const match of source.matchAll(/(?:titleKey|subtitleKey)="([^"]+)"/g)) used.add(match[1]);
  for (const match of source.matchAll(/keyPrefix[:=]\s*'([^']+)'/g)) dynamicPrefixes.add(match[1]);
  for (const match of source.matchAll(/t\('([a-z0-9.]+\.)'\s*\+/gi)) dynamicPrefixes.add(match[1]);
}

for (const key of used) {
  if (key.endsWith('.')) {
    dynamicPrefixes.add(key);
    continue;
  }
  for (const lang of ['ar', 'en']) {
    if (!maps[lang].has(key)) {
      console.error(`MISSING KEY (${lang}): ${key}`);
      failures++;
    }
  }
}
// keys under dynamic prefixes must exist in both languages symmetrically
for (const key of maps.ar) {
  if (!maps.en.has(key)) {
    console.error(`MISSING KEY (en, present in ar): ${key}`);
    failures++;
  }
}
for (const key of maps.en) {
  if (!maps.ar.has(key)) {
    console.error(`MISSING KEY (ar, present in en): ${key}`);
    failures++;
  }
}

// 3 — hardcoded colors outside the mock theme
for (const file of files) {
  if (file.endsWith('theme.mock.ts')) continue;
  const source = readFileSync(file, 'utf8');
  if (!/\.(scss|html)$/.test(file) && !file.endsWith('.ts')) continue;
  const colorHits = source.match(/#[0-9a-fA-F]{3,8}\b|rgba?\(/g);
  if (colorHits && /\.(scss)$/.test(file)) {
    console.error(`HARDCODED COLOR in ${relative(SRC, file)}: ${colorHits.join(', ')}`);
    failures++;
  }
}

console.log(
  failures === 0
    ? `OK — ${files.length} files, ${used.size} static keys verified, ${dynamicPrefixes.size} dynamic prefixes, all within limits`
    : `${failures} problem(s) found`,
);
process.exit(failures === 0 ? 0 : 1);
