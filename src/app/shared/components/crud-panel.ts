import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { FormField, TableColumn } from '../../core/models/common.models';
import { NotificationService } from '../../core/services/notification.service';
import { exportRowsToCsv } from '../crud/export-csv';
import { Translated } from '../translated.base';
import { UiEntityForm } from './ui-entity-form';
import { UiIcon } from './ui-icon';
import { UiModal } from './ui-modal';
import { UiTable } from './ui-table';

type Row = Record<string, unknown>;
type Draft = Record<string, string | number | boolean>;

/**
 * List + create/edit/delete modal for one API collection, with a shared
 * toolbar every module inherits: from/to date filter, print (browser
 * print dialog also produces PDF) and Excel export.
 */
@Component({
  selector: 'crud-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiTable, UiEntityForm, UiModal, UiIcon],
  template: `
    <div class="row token-toolbar">
      <input
        class="ui-control crud-search"
        type="search"
        [placeholder]="t('common.search')"
        [value]="search()"
        (input)="search.set($any($event.target).value)"
      />
      @if (dateKey()) {
        <label class="row crud-filter">
          <span class="ui-field__label">{{ t('common.from') }}</span>
          <input
            class="ui-control"
            type="date"
            [value]="fromDate()"
            (change)="fromDate.set($any($event.target).value)"
          />
        </label>
        <label class="row crud-filter">
          <span class="ui-field__label">{{ t('common.to') }}</span>
          <input
            class="ui-control"
            type="date"
            [value]="toDate()"
            (change)="toDate.set($any($event.target).value)"
          />
        </label>
      }
      <div class="row token-toolbar__actions">
        <button type="button" class="ui-btn ui-btn--ghost" (click)="print()">
          <ui-icon name="print" [size]="16" />
          {{ t('common.print') }}
        </button>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="exportPdf()">
          <ui-icon name="document" [size]="16" />
          {{ t('common.exportPdf') }}
        </button>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="exportExcel()">
          <ui-icon name="download" [size]="16" />
          {{ t('common.exportExcel') }}
        </button>
        @if (!readOnly()) {
          <button type="button" class="ui-btn ui-btn--primary" (click)="openCreate()">
            <ui-icon name="plus" [size]="16" />
            {{ t('common.create') }}
          </button>
        }
      </div>
    </div>
    <div class="print-area">
      <ui-table
        [columns]="columns()"
        [rows]="filtered()"
        [clickable]="!readOnly()"
        (rowClick)="openEdit($event)"
      />
    </div>

    @if (open()) {
      <ui-modal [titleKey]="editingId() ? 'common.edit' : 'common.create'" (closed)="close()">
        <div class="stack">
          <ui-entity-form [fields]="fields()" [(draft)]="draft" />
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="busy()" (click)="save()">
              {{ t('common.save') }}
            </button>
            @if (editingId()) {
              <button type="button" class="ui-btn ui-btn--danger" [disabled]="busy()" (click)="remove()">
                {{ t('common.delete') }}
              </button>
            }
            <button type="button" class="ui-btn ui-btn--ghost" (click)="close()">
              {{ t('common.cancel') }}
            </button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class CrudPanel extends Translated {
  readonly endpoint = input.required<string>();
  readonly columns = input.required<TableColumn[]>();
  readonly fields = input<FormField[]>([]);
  readonly idKey = input('id');
  /** Report mode: toolbar filters + exports only, no create/edit. */
  readonly readOnly = input(false);

  private readonly api = inject(ApiClientService);
  private readonly notifications = inject(NotificationService);

  protected readonly rows = signal<Row[]>([]);
  protected readonly open = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly draft = signal<Draft>({});
  protected readonly busy = signal(false);
  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');
  protected readonly search = signal('');

  /** First date-typed column drives the from/to filter (if any). */
  protected readonly dateKey = computed(
    () =>
      this.columns().find((col) => col.type === 'date' || col.type === 'datetime')
        ?.key ?? '',
  );

  protected readonly filtered = computed(() => {
    const key = this.dateKey();
    const from = this.fromDate();
    const to = this.toDate();
    const term = this.search().trim().toLowerCase();
    return this.rows().filter((row) => {
      if (key && (from || to)) {
        const value = String(row[key] ?? '').slice(0, 10);
        if (!value) return false;
        if ((from && value < from) || (to && value > to)) return false;
      }
      return !term || this.matches(row, term);
    });
  });

  /** Search across every column, including translated labels. */
  private matches(row: Row, term: string): boolean {
    return this.columns().some((col) => {
      const raw = String(row[col.key] ?? '').toLowerCase();
      if (raw.includes(term)) return true;
      const translated =
        col.type === 'key' || col.type === 'badge'
          ? this.t((col.keyPrefix ?? '') + String(row[col.key] ?? '')).toLowerCase()
          : '';
      return translated.includes(term);
    });
  }

  constructor() {
    super();
    queueMicrotask(() => this.reload());
  }

  protected print(): void {
    window.print();
  }

  /** Browsers ship a "Save as PDF" printer — same dialog, PDF output. */
  protected exportPdf(): void {
    this.notifications.info('common.pdfHint');
    window.print();
  }

  protected exportExcel(): void {
    exportRowsToCsv(
      this.columns(),
      this.filtered(),
      this.endpoint(),
      this.t,
      this.i18n.formatNumber,
    );
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.draft.set(this.emptyDraft());
    this.open.set(true);
  }

  protected openEdit(row: Row): void {
    if (this.readOnly()) return;
    this.editingId.set(String(row[this.idKey()] ?? ''));
    const next: Draft = {};
    for (const field of this.fields()) {
      next[field.key] = (row[field.key] as string | number | boolean) ?? '';
      if (!field.multilang) continue;
      // Also prefill the per-language variants (key_<code>).
      for (const [key, value] of Object.entries(row)) {
        if (key.startsWith(`${field.key}_`)) {
          next[key] = (value as string | number | boolean) ?? '';
        }
      }
    }
    this.draft.set(next);
    this.open.set(true);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected save(): void {
    this.busy.set(true);
    const id = this.editingId();
    const request = id
      ? this.api.put<Row>(`${this.endpoint()}/${id}`, this.draft())
      : this.api.post<Row>(this.endpoint(), this.draft());
    request.subscribe({
      next: () => {
        this.notifications.success(id ? 'common.updated' : 'common.created');
        this.busy.set(false);
        this.close();
        this.reload();
      },
      error: () => this.busy.set(false),
    });
  }

  protected remove(): void {
    const id = this.editingId();
    if (!id) return;
    this.busy.set(true);
    this.api.delete<Row>(`${this.endpoint()}/${id}`).subscribe({
      next: () => {
        this.notifications.success('common.deleted');
        this.busy.set(false);
        this.close();
        this.reload();
      },
      error: () => this.busy.set(false),
    });
  }

  private reload(): void {
    this.api.get<Row[]>(this.endpoint()).subscribe((data) => this.rows.set(data));
  }

  private emptyDraft(): Draft {
    const next: Draft = {};
    for (const field of this.fields()) {
      next[field.key] = field.type === 'number' ? 0 : field.options?.[0]?.value ?? '';
    }
    return next;
  }
}
