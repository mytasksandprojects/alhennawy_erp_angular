import { TableColumn } from '../../core/models/common.models';

export const STATUS_KEYS = new Set(['status', 'stage', 'result', 'accepted']);

export interface StatusPick {
  row: Record<string, unknown>;
  key: string;
  status: string;
}

export function isStatusKey(key: string): boolean {
  return STATUS_KEYS.has(key);
}

export function statusFlowOf(col: TableColumn): string[] {
  return col.statusFlow ?? Object.keys(col.badgeToneMap ?? {});
}

/** Next step, the other value of a pair, plus any danger branch (reject / cancel). */
export function statusChoices(col: TableColumn, current: string): string[] {
  const tones = col.badgeToneMap ?? {};
  const flow = statusFlowOf(col);
  if (flow.length <= 2) return flow.filter((status) => status !== current);
  const index = flow.indexOf(current);
  const next = index >= 0 && index < flow.length - 1 ? [flow[index + 1]] : [];
  const extra = Object.keys(tones).filter(
    (status) => status !== current && !next.includes(status) && tones[status] === 'danger',
  );
  return [...next, ...extra];
}

export function coerceStatus(value: string): string | boolean {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value;
}
