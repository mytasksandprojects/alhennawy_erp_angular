import { AuditLogEntry, SystemToggle } from '../../core/models/system.models';
import { MockApiError } from '../mock-backend.interceptor';

/** MOCK LAYER — audit trail entries (newest first). */
export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'al-101', at: '2026-08-14T17:52:00', username: 'admin', actionKey: 'system.actions.toggleUpdated', moduleKey: 'menu.system', reference: 'einvoice-integration', ip: '192.168.1.10', result: 'success' },
  { id: 'al-100', at: '2026-08-14T17:45:00', username: 'store1', actionKey: 'system.actions.labelPrinted', moduleKey: 'menu.cutter', reference: '8444/268621', ip: '192.168.1.34', result: 'success' },
  { id: 'al-099', at: '2026-08-14T17:31:00', username: 'store1', actionKey: 'system.actions.weighingCompleted', moduleKey: 'menu.weighbridge', reference: 'WB-2026-03042', ip: '192.168.1.34', result: 'success' },
  { id: 'al-098', at: '2026-08-14T16:58:00', username: 'finance', actionKey: 'system.actions.invoiceIssued', moduleKey: 'menu.sales', reference: 'INV-2026-0812', ip: '192.168.1.21', result: 'success' },
  { id: 'al-097', at: '2026-08-14T16:40:00', username: 'store1', actionKey: 'system.actions.priceViewDenied', moduleKey: 'menu.sales', reference: 'WO-2026-118', ip: '192.168.1.34', result: 'denied' },
  { id: 'al-096', at: '2026-08-14T15:22:00', username: 'admin', actionKey: 'system.actions.userLoggedIn', moduleKey: 'menu.system', reference: 'u-1', ip: '192.168.1.10', result: 'success' },
  { id: 'al-095', at: '2026-08-14T14:50:00', username: 'finance', actionKey: 'system.actions.journalPosted', moduleKey: 'menu.finance', reference: 'JE-2026-0455', ip: '192.168.1.21', result: 'success' },
  { id: 'al-094', at: '2026-08-14T13:05:00', username: 'hr-sync', actionKey: 'system.actions.zkSyncFailed', moduleKey: 'menu.hr', reference: 'ZK-GATE-2', ip: '192.168.1.60', result: 'failed' },
  { id: 'al-093', at: '2026-08-14T12:12:00', username: 'store1', actionKey: 'system.actions.weighingCreated', moduleKey: 'menu.weighbridge', reference: 'WB-2026-03041', ip: '192.168.1.34', result: 'success' },
  { id: 'al-092', at: '2026-08-14T09:03:00', username: 'unknown', actionKey: 'system.actions.loginFailed', moduleKey: 'menu.system', reference: 'admin', ip: '41.33.128.9', result: 'failed' },
];

/** MOCK LAYER — integration / feature switches, mutable in-memory. */
const TOGGLES: SystemToggle[] = [
  { id: 'einvoice-integration', labelKey: 'system.toggles.einvoice', descriptionKey: 'system.toggles.einvoiceDesc', enabled: true, updatedAt: '2026-08-14T17:52:00', updatedBy: 'admin' },
  { id: 'zk-auto-sync', labelKey: 'system.toggles.zkSync', descriptionKey: 'system.toggles.zkSyncDesc', enabled: true, updatedAt: '2026-08-10T08:00:00', updatedBy: 'admin' },
  { id: 'weighbridge-alerts', labelKey: 'system.toggles.weighbridgeAlerts', descriptionKey: 'system.toggles.weighbridgeAlertsDesc', enabled: true, updatedAt: '2026-08-01T10:15:00', updatedBy: 'admin' },
  { id: 'cargox-integration', labelKey: 'system.toggles.cargox', descriptionKey: 'system.toggles.cargoxDesc', enabled: false, updatedAt: '2026-07-22T14:30:00', updatedBy: 'admin' },
  { id: 'price-visibility-enforcement', labelKey: 'system.toggles.priceGuard', descriptionKey: 'system.toggles.priceGuardDesc', enabled: true, updatedAt: '2026-06-30T09:00:00', updatedBy: 'admin' },
  { id: 'auto-production-orders', labelKey: 'system.toggles.autoProduction', descriptionKey: 'system.toggles.autoProductionDesc', enabled: true, updatedAt: '2026-06-12T11:45:00', updatedBy: 'admin' },
];

export function listToggles(): SystemToggle[] {
  return [...TOGGLES];
}

export function updateToggle(id: string, body: unknown): SystemToggle {
  const toggle = TOGGLES.find((item) => item.id === id);
  if (!toggle) throw new MockApiError(404, 'unknown-toggle');
  toggle.enabled = Boolean((body as { enabled: boolean }).enabled);
  toggle.updatedAt = new Date().toISOString();
  toggle.updatedBy = 'admin';
  return { ...toggle };
}
