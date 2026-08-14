/** النسخ الاحتياطي — scheduled and on-demand database backups. */

export interface BackupRecord {
  id: string;
  fileName: string;
  createdAt: string;
  kind: 'scheduled' | 'manual' | 'imported';
  sizeMb: number;
  status: 'completed' | 'failed';
  createdBy: string;
}

export interface BackupSchedule {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  /** HH:mm — local factory time. */
  time: string;
  retentionDays: number;
  nextRunAt: string;
}

/** Download response: the file name plus the JSON snapshot to save. */
export interface BackupDownload {
  fileName: string;
  payload: Record<string, unknown>;
}
