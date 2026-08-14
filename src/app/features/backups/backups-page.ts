import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  BackupDownload,
  BackupRecord,
  BackupSchedule,
} from '../../core/models/backup.models';
import { TableColumn } from '../../core/models/common.models';
import { NotificationService } from '../../core/services/notification.service';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiSwitch } from '../../shared/components/ui-switch';
import { UiTable } from '../../shared/components/ui-table';
import { Translated } from '../../shared/translated.base';

const BACKUP_COLUMNS: TableColumn[] = [
  { key: 'fileName', labelKey: 'backup.fields.file' },
  { key: 'createdAt', labelKey: 'common.date', type: 'datetime' },
  {
    key: 'kind',
    labelKey: 'common.type',
    type: 'badge',
    keyPrefix: 'backup.kinds.',
    badgeToneMap: { scheduled: 'info', manual: 'success', imported: 'neutral' },
  },
  { key: 'sizeMb', labelKey: 'backup.fields.size', type: 'number', align: 'center' },
  {
    key: 'status',
    labelKey: 'common.status',
    type: 'badge',
    keyPrefix: 'backup.status.',
    badgeToneMap: { completed: 'success', failed: 'danger' },
  },
  { key: 'createdBy', labelKey: 'system.fields.user' },
];

/**
 * النسخ الاحتياطي — schedule automatic backups, run one on demand,
 * import (restore) a backup file, and download any backup as JSON.
 */
@Component({
  selector: 'app-backups-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiIcon, UiPageHeader, UiSwitch, UiTable],
  template: `
    <ui-page-header titleKey="backup.title" subtitleKey="backup.subtitle" />

    @if (schedule(); as sched) {
      <section class="ui-card backup-card">
        <h2 class="ui-card__title">{{ t('backup.schedule.title') }}</h2>
        <div class="row backup-form">
          <label class="row backup-card__switch">
            <ui-switch
              [checked]="sched.enabled"
              (toggled)="edit('enabled', $event)"
            />
            <span>{{ t('backup.fields.enabled') }}</span>
          </label>
          <label class="ui-field backup-card__field">
            <span class="ui-field__label">{{ t('backup.fields.frequency') }}</span>
            <select
              class="ui-control"
              [ngModel]="sched.frequency"
              (ngModelChange)="edit('frequency', $event)"
            >
              @for (freq of frequencies; track freq) {
                <option [value]="freq">{{ t('backup.freq.' + freq) }}</option>
              }
            </select>
          </label>
          <label class="ui-field backup-card__field">
            <span class="ui-field__label">{{ t('backup.fields.time') }}</span>
            <input
              class="ui-control"
              type="time"
              [ngModel]="sched.time"
              (ngModelChange)="edit('time', $event)"
            />
          </label>
          <label class="ui-field backup-card__field">
            <span class="ui-field__label">{{ t('backup.fields.retention') }}</span>
            <input
              class="ui-control"
              type="number"
              [ngModel]="sched.retentionDays"
              (ngModelChange)="edit('retentionDays', $event)"
            />
          </label>
          <button
            type="button"
            class="ui-btn ui-btn--primary backup-form__save"
            (click)="saveSchedule()"
          >
            {{ t('common.save') }}
          </button>
        </div>
        <p class="ui-field__hint backup-card__next">
          {{ t('backup.schedule.nextRun') }}: {{ fmtDate(sched.nextRunAt) }}
        </p>
      </section>
    }

    <section class="ui-card">
      <div class="row backup-head">
        <div class="backup-head__text">
          <h2 class="ui-card__title">{{ t('backup.history.title') }}</h2>
          <p class="ui-field__hint">{{ t('backup.hint.download') }}</p>
        </div>
        <div class="row token-toolbar__actions">
          <input
            #importInput
            type="file"
            accept=".json,application/json"
            hidden
            (change)="importFile(importInput)"
          />
          <button type="button" class="ui-btn ui-btn--ghost" (click)="importInput.click()">
            <ui-icon name="upload" [size]="16" />
            {{ t('backup.actions.import') }}
          </button>
          <button type="button" class="ui-btn ui-btn--primary" [disabled]="busy()" (click)="runNow()">
            <ui-icon name="download" [size]="16" />
            {{ t('backup.actions.runNow') }}
          </button>
        </div>
      </div>
      <ui-table
        [columns]="columns"
        [rows]="$any(backups())"
        [clickable]="true"
        (rowClick)="download($any($event))"
      />
    </section>
  `,
})
export class BackupsPage extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly notify = inject(NotificationService);

  protected readonly columns = BACKUP_COLUMNS;
  protected readonly frequencies = ['daily', 'weekly', 'monthly'];
  protected readonly backups = signal<BackupRecord[]>([]);
  protected readonly schedule = signal<BackupSchedule | null>(null);
  protected readonly busy = signal(false);

  constructor() {
    super();
    this.refresh();
    this.api
      .get<BackupSchedule>(API_ENDPOINTS.backups.schedule)
      .subscribe((sched) => this.schedule.set(sched));
  }

  private refresh(): void {
    this.api
      .get<BackupRecord[]>(API_ENDPOINTS.backups.list)
      .subscribe((rows) => this.backups.set(rows));
  }

  protected edit(key: keyof BackupSchedule, value: unknown): void {
    const current = this.schedule();
    if (current) this.schedule.set({ ...current, [key]: value });
  }

  protected saveSchedule(): void {
    const sched = this.schedule();
    if (!sched) return;
    this.api
      .post<BackupSchedule>(API_ENDPOINTS.backups.schedule, sched)
      .subscribe((saved) => {
        this.schedule.set(saved);
        this.notify.success('backup.msg.scheduleSaved');
      });
  }

  protected runNow(): void {
    this.busy.set(true);
    this.api.post<BackupRecord>(API_ENDPOINTS.backups.run, {}).subscribe({
      next: (record) => {
        this.busy.set(false);
        this.notify.success('backup.msg.created', [record.fileName]);
        this.refresh();
      },
      error: () => this.busy.set(false),
    });
  }

  protected download(record: BackupRecord): void {
    this.api
      .get<BackupDownload>(API_ENDPOINTS.backups.download(record.id))
      .subscribe((file) => {
        const blob = new Blob([JSON.stringify(file.payload, null, 2)], {
          type: 'application/json',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = file.fileName;
        link.click();
        URL.revokeObjectURL(link.href);
        this.notify.success('backup.msg.downloaded', [file.fileName]);
      });
  }

  protected importFile(input: HTMLInputElement): void {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    file.text().then((text) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        this.notify.error('backup.msg.importInvalid');
        return;
      }
      const body = { ...(parsed as object), fileName: file.name };
      this.api.post<BackupRecord>(API_ENDPOINTS.backups.importFile, body).subscribe({
        next: () => {
          this.notify.success('backup.msg.imported', [file.name]);
          this.refresh();
        },
        error: () => this.notify.error('backup.msg.importInvalid'),
      });
    });
  }
}
