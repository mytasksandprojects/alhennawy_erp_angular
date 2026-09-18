import { TableColumn } from '../../core/models/common.models';

export const STATUS_KEYS = new Set(['status', 'stage', 'result', 'accepted']);

/**
 * Badge columns that also render row action buttons (approval / reschedule
 * decisions) — not used for the status filter, which stays on STATUS_KEYS.
 */
export const ACTION_STATUS_KEYS = new Set([
  ...STATUS_KEYS,
  'approvalStatus',
  'rescheduleStatus',
]);

export interface StatusPick {
  row: Record<string, unknown>;
  key: string;
  status: string;
  extra?: Record<string, string>;
}

export function isStatusKey(key: string): boolean {
  return STATUS_KEYS.has(key);
}

/** True when the column should render row action buttons. */
export function isActionStatusKey(key: string): boolean {
  return ACTION_STATUS_KEYS.has(key);
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
