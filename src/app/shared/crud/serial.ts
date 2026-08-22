import { FormField } from '../../core/models/common.models';

type Draft = Record<string, string | number | boolean>;
type Row = Record<string, unknown>;

/** Next document code, e.g. PR-2026-0302, from the highest trailing digits. */
export function nextGenerated(rows: object[], key: string, prefix: string): string {
  const year = String(new Date().getFullYear());
  let max = 0;
  for (const row of rows) {
    const raw = String((row as Row)[key] ?? '');
    if (prefix && !raw.includes(prefix)) continue;
    const match = raw.match(/(\d+)$/);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `${prefix}-${year}-${String(max + 1).padStart(4, '0')}`;
}

export function withGenerated(
  fields: FormField[],
  draft: Draft,
  rows: Row[],
): Draft {
  const next = { ...draft };
  for (const field of fields) {
    if (!field.generated || next[field.key]) continue;
    if (field.type === 'number') {
      let max = 0;
      for (const row of rows) {
        const value = Number(row[field.key]);
        if (Number.isFinite(value)) max = Math.max(max, value);
      }
      next[field.key] = max + 1;
      continue;
    }
    next[field.key] = nextGenerated(rows, field.key, field.generatedPrefix ?? 'DOC');
  }
  if (!next['date'] && fields.some((field) => field.key === 'date')) {
    next['date'] = new Date().toISOString().slice(0, 10);
  }
  return next;
}
