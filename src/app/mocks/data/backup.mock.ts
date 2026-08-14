import {
  BackupDownload,
  BackupRecord,
  BackupSchedule,
} from '../../core/models/backup.models';
import { MockApiError } from '../mock-backend.interceptor';
import { MOCK_CUSTOMERS, MOCK_WORK_ORDERS } from './sales.mock';
import { MOCK_EMPLOYEES } from './hr.mock';
import { MOCK_LOOKUP_VALUES } from './lookups.mock';

/** MOCK LAYER — stateful backup simulation (schedule + history). */
const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

let backupSerial = 5;

export const MOCK_BACKUPS: BackupRecord[] = [
  { id: 'bk-4', fileName: 'alhennawy-erp-2026-08-14-0200.json', createdAt: daysAgo(0), kind: 'scheduled', sizeMb: 48.2, status: 'completed', createdBy: 'system' },
  { id: 'bk-3', fileName: 'alhennawy-erp-2026-08-13-0200.json', createdAt: daysAgo(1), kind: 'scheduled', sizeMb: 47.9, status: 'completed', createdBy: 'system' },
  { id: 'bk-2', fileName: 'alhennawy-erp-2026-08-12-1440.json', createdAt: daysAgo(2), kind: 'manual', sizeMb: 47.8, status: 'completed', createdBy: 'admin' },
  { id: 'bk-1', fileName: 'alhennawy-erp-2026-08-11-0200.json', createdAt: daysAgo(3), kind: 'scheduled', sizeMb: 0, status: 'failed', createdBy: 'system' },
];

const SCHEDULE: BackupSchedule = {
  enabled: true,
  frequency: 'daily',
  time: '02:00',
  retentionDays: 30,
  nextRunAt: daysAhead(1),
};

export function getBackupSchedule(): BackupSchedule {
  return { ...SCHEDULE };
}

export function saveBackupSchedule(body: unknown): BackupSchedule {
  const req = body as Partial<BackupSchedule>;
  if (!['daily', 'weekly', 'monthly'].includes(req.frequency ?? '')) {
    throw new MockApiError(400, 'invalid-frequency');
  }
  Object.assign(SCHEDULE, {
    enabled: Boolean(req.enabled),
    frequency: req.frequency,
    time: req.time || SCHEDULE.time,
    retentionDays: Number(req.retentionDays) || SCHEDULE.retentionDays,
    nextRunAt: daysAhead(req.frequency === 'daily' ? 1 : req.frequency === 'weekly' ? 7 : 30),
  });
  return { ...SCHEDULE };
}

function stamp(date: Date): string {
  return date.toISOString().slice(0, 16).replace(/[T:]/g, '-');
}

export function runBackup(): BackupRecord {
  const record: BackupRecord = {
    id: `bk-${backupSerial++}`,
    fileName: `alhennawy-erp-${stamp(new Date())}.json`,
    createdAt: new Date().toISOString(),
    kind: 'manual',
    sizeMb: Math.round((47 + Math.random() * 3) * 10) / 10,
    status: 'completed',
    createdBy: 'admin',
  };
  MOCK_BACKUPS.unshift(record);
  return record;
}

export function importBackup(body: unknown): BackupRecord {
  const snapshot = body as { meta?: { app?: string }; fileName?: string };
  if (!snapshot || typeof snapshot !== 'object' || !snapshot.meta) {
    throw new MockApiError(400, 'invalid-backup-file');
  }
  const record: BackupRecord = {
    id: `bk-${backupSerial++}`,
    fileName: snapshot.fileName ?? `imported-${stamp(new Date())}.json`,
    createdAt: new Date().toISOString(),
    kind: 'imported',
    sizeMb: Math.round((JSON.stringify(body).length / 1048576) * 100) / 100,
    status: 'completed',
    createdBy: 'admin',
  };
  MOCK_BACKUPS.unshift(record);
  return record;
}

export function downloadBackup(id: string): BackupDownload {
  const record = MOCK_BACKUPS.find((row) => row.id === id);
  if (!record) throw new MockApiError(404, 'not-found');
  return {
    fileName: record.fileName,
    payload: {
      meta: { app: 'alhennawy-erp', backupId: record.id, createdAt: record.createdAt },
      customers: MOCK_CUSTOMERS,
      workOrders: MOCK_WORK_ORDERS,
      employees: MOCK_EMPLOYEES,
      lookups: MOCK_LOOKUP_VALUES,
    },
  };
}
