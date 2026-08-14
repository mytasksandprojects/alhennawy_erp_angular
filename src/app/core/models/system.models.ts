/** Audit trail entry — every sensitive action recorded by the backend. */
export interface AuditLogEntry {
  id: string;
  at: string;
  username: string;
  actionKey: string;
  moduleKey: string;
  reference: string;
  ip: string;
  result: 'success' | 'denied' | 'failed';
}

/**
 * Admin-managed dropdown value. Every select list in the create/edit
 * forms is fed from these records (grouped by `group`), so administrators
 * control the available options without code changes. `value` is what is
 * stored on records; seeded values reuse i18n keys so history stays
 * translated, while admin-added values display their raw labels.
 */
export interface LookupValue {
  id: string;
  group: string;
  value: string;
  labelAr: string;
  labelEn: string;
  /** currencies group only: default exchange rate to EGP (EGP itself = 1). */
  rate?: number;
}

/** A backend feature/integration switch with its live status. */
export interface SystemToggle {
  id: string;
  labelKey: string;
  descriptionKey: string;
  enabled: boolean;
  updatedAt: string;
  updatedBy: string;
}
