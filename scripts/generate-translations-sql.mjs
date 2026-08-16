// Reads a CSV of product translations and emits an idempotent SQL file.
// Usage: node scripts/generate-translations-sql.mjs <input.csv> [output.sql]

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "csv-parse/sync";

const [, , inputArg, outputArg] = process.argv;

if (!inputArg) {
  console.error(
    "Usage: node scripts/generate-translations-sql.mjs <input.csv> [output.sql]"
  );
  process.exit(1);
}

const inputPath = resolve(inputArg);
const outputPath = resolve(outputArg ?? "scripts/product_translations_import.sql");

const raw = readFileSync(inputPath, "utf8").replace(/^﻿/, "");

const records = parse(raw, {
  columns: true,
  skip_empty_lines: true,
  trim: false,
  relax_quotes: true,
});

const REQUIRED = [
  "product_id",
  "locale",
  "name",
  "description_1",
  "description_2",
  "description_3",
];
for (const col of REQUIRED) {
  if (!(col in records[0])) {
    console.error(`Missing required column in CSV: ${col}`);
    process.exit(1);
  }
}

const ALLOWED_LOCALES = new Set(["sq", "en", "mk"]);

const quote = (v) => {
  if (v === null || v === undefined || v === "") return "NULL";
  return `'${String(v).replace(/'/g, "''")}'`;
};

const rows = [];
const seen = new Set();
for (const r of records) {
  const productId = Number(r.product_id);
  const locale = String(r.locale).trim();
  if (!Number.isInteger(productId)) {
    console.error(`Skipping row with non-integer product_id: ${r.product_id}`);
    continue;
  }
  if (!ALLOWED_LOCALES.has(locale)) {
    console.error(`Skipping row with unknown locale: ${locale}`);
    continue;
  }
  const key = `${productId}|${locale}`;
  if (seen.has(key)) {
    console.error(`Duplicate row for (${productId}, ${locale}) — keeping last`);
  }
  seen.add(key);
  rows.push({
    product_id: productId,
    locale,
    name: r.name?.trim() ?? "",
    description_1: r.description_1 ?? "",
    description_2: r.description_2 ?? "",
    description_3: r.description_3 ?? "",
  });
}

if (rows.length === 0) {
  console.error("No valid rows found in CSV. Aborting.");
  process.exit(1);
}

const values = rows
  .map(
    (r) =>
      `  (${r.product_id}, ${quote(r.locale)}, ${quote(r.name)}, ${quote(
        r.description_1
      )}, ${quote(r.description_2)}, ${quote(r.description_3)})`
  )
  .join(",\n");

const sql = `-- Product translations import
-- Generated from: ${inputArg}
-- Rows: ${rows.length}
-- Idempotent: safe to re-run. Existing (product_id, locale) rows will be updated.

BEGIN;

INSERT INTO public.product_translations
  (product_id, locale, name, description_1, description_2, description_3)
VALUES
${values}
ON CONFLICT (product_id, locale) DO UPDATE SET
  name          = EXCLUDED.name,
  description_1 = EXCLUDED.description_1,
  description_2 = EXCLUDED.description_2,
  description_3 = EXCLUDED.description_3,
  updated_at    = now();

-- Verify counts per locale
DO $$
DECLARE
  cnt_en int;
  cnt_mk int;
BEGIN
  SELECT COUNT(*) INTO cnt_en FROM public.product_translations WHERE locale = 'en';
  SELECT COUNT(*) INTO cnt_mk FROM public.product_translations WHERE locale = 'mk';
  RAISE NOTICE 'After import: en=%, mk=%', cnt_en, cnt_mk;
END $$;

COMMIT;
`;

writeFileSync(outputPath, sql, "utf8");
console.log(`Wrote ${rows.length} upserts to ${outputPath}`);
const byLocale = rows.reduce((acc, r) => {
  acc[r.locale] = (acc[r.locale] ?? 0) + 1;
  return acc;
}, {});
console.log("Breakdown by locale:", byLocale);
