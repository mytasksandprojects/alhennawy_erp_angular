import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiClientService } from '../../core/api/api-client.service';
import { FormField, TableColumn } from '../../core/models/common.models';
import { NotificationService } from '../../core/services/notification.service';
import { AccessService } from '../../core/security/access.service';
import { exportRowsToCsv } from '../crud/export-csv';
import { deleteRow, persistRow } from '../crud/crud-write';
import { emptyDraft, shownColumns, shownFields } from '../crud/form-draft';
import { withGenerated } from '../crud/serial';
import { ConfirmService } from '../../core/services/confirm.service';
import { printWide } from '../crud/print-page';
import { filterCrudRows } from '../crud/stock-filter';
import { Translated } from '../translated.base';
import { UiEntityForm } from './ui-entity-form';
import { UiIcon } from './ui-icon';
import { UiModal } from './ui-modal';
import { UiTable } from './ui-table';

type Row = Record<string, unknown>;
type Draft = Record<string, string | number | boolean>;

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
      @if (hasStockFilter()) {
        <select class="ui-control" [value]="stock()" (change)="setParam('stock', $any($event.target).value)">
          <option value="">{{ t('common.all') }}</option>
          <option value="below">{{ t('warehouse.stats.belowMinimum') }}</option>
          <option value="out">{{ t('warehouse.stats.outOfStock') }}</option>
        </select>
      }
      @if (statusCol(); as col) {
        <select class="ui-control" [value]="status()" (change)="setParam('status', $any($event.target).value)">
          <option value="">{{ t('common.all') }}</option>
          @for (key of statusKeys(col); track key) {
            <option [value]="key">{{ t((col.keyPrefix ?? '') + key) }}</option>
          }
        </select>
      }
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
        @if (allow('print')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="print()">
            <ui-icon name="print" [size]="16" [brand]="true" />
            {{ t('common.print') }}
          </button>
        }
        @if (allow('pdf')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="exportPdf()">
            <ui-icon name="pdf" [size]="16" />
            {{ t('common.exportPdf') }}
          </button>
        }
        @if (allow('excel')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="exportExcel()">
            <ui-icon name="xls" [size]="16" />
            {{ t('common.exportExcel') }}
          </button>
        }
        @if (!readOnly() && allow('create')) {
          <button type="button" class="ui-btn ui-btn--primary" (click)="openCreate()">
            <ui-icon name="plus" [size]="16" />
            {{ t('common.create') }}
          </button>
        }
      </div>
    </div>
    <div class="print-area">
      <ui-table
        [columns]="shownColumns()"
        [rows]="filtered()"
        [clickable]="!readOnly() && allow('edit')"
        [rowExport]="allow('print') || allow('pdf') || allow('excel')"
        [allowPrint]="allow('print')"
        [allowPdf]="allow('pdf')"
        [allowExcel]="allow('excel')"
        [titleKey]="titleKey()"
        [printKind]="printKind()"
        [printAsReport]="moduleId() === 'reports'"
        (rowClick)="openEdit($event)"
      />
    </div>

    @if (open()) {
      <ui-modal [titleKey]="editingId() ? 'common.edit' : 'common.create'" (closed)="close()">
        <div class="stack">
          <ui-entity-form [fields]="shownFields()" [moduleId]="moduleId()" [tabId]="tabId()" [(draft)]="draft" />
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="busy()" (click)="save()">
              {{ t('common.save') }}
            </button>
            @if (editingId() && allow('delete')) {
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
  readonly moduleId = input('');
  readonly tabId = input('');
  readonly readOnly = input(false);
  readonly titleKey = input('');
  readonly printKind = input<'record' | 'invoice' | 'sheet'>('record');

  private readonly api = inject(ApiClientService);
  private readonly access = inject(AccessService);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly rows = signal<Row[]>([]);
  protected readonly open = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly draft = signal<Draft>({});
  protected readonly busy = signal(false);
  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');
  protected readonly search = signal('');
  protected readonly stock = signal('');
  protected readonly status = signal('');
  protected readonly hasStockFilter = computed(() =>
    this.columns().some((col) => col.key === 'stockStatus'),
  );
  protected readonly statusCol = computed(() =>
    this.columns().find((col) => col.type === 'badge' && (col.key === 'status' || col.key === 'stage')),
  );
  protected readonly dateKey = computed(
    () => this.columns().find((col) => col.type === 'date' || col.type === 'datetime')?.key ?? '',
  );
  protected readonly filtered = computed(() =>
    filterCrudRows(
      this.rows(), this.dateKey(), this.fromDate(), this.toDate(),
      this.stock(), this.status(), this.search(), this.columns(), this.t, this.hasStockFilter(),
    ),
  );

  constructor() {
    super();
    this.route.queryParamMap.subscribe((params) => {
      this.stock.set(params.get('stock') ?? '');
      this.status.set(params.get('status') ?? '');
      this.search.set(params.get('q') ?? '');
    });
    queueMicrotask(() => this.reload());
  }

  protected statusKeys(col: TableColumn): string[] {
    return Object.keys(col.badgeToneMap ?? {});
  }

  protected setParam(key: string, value: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [key]: value || null },
      queryParamsHandling: 'merge',
    });
  }

  protected print(): void {
    printWide();
  }

  protected allow(action: string): boolean {
    return this.access.canAction(this.moduleId(), this.tabId(), action);
  }

  protected shownColumns(): TableColumn[] {
    return shownColumns(this.columns(), this.moduleId(), this.tabId(), this.access);
  }

  protected shownFields(): FormField[] {
    const fields = shownFields(this.fields(), this.columns(), this.shownColumns(), this.moduleId(), this.tabId(), this.access);
    return this.editingId() ? fields : fields.filter((field) => !field.generated);
  }

  protected exportPdf(): void {
    this.notifications.info('common.pdfHint');
    printWide();
  }

  protected exportExcel(): void {
    exportRowsToCsv(
      this.shownColumns(),
      this.filtered(),
      this.endpoint(),
      this.t,
      this.i18n.formatNumber,
    );
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.draft.set(emptyDraft(this.shownFields()));
    this.open.set(true);
  }

  protected openEdit(row: Row): void {
    if (this.readOnly()) return;
    this.editingId.set(String(row[this.idKey()] ?? ''));
    const next: Draft = {};
    for (const field of this.shownFields()) {
      next[field.key] = (row[field.key] as string | number | boolean) ?? '';
      if (!field.multilang) continue;
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

  protected async save(): Promise<void> {
    if (!(await this.confirm.askSave())) return;
    this.busy.set(true);
    persistRow(this.api, this.notifications, this.endpoint(), this.editingId(), withGenerated(this.fields(), this.draft(), this.rows()), () => {
      this.busy.set(false);
      this.close();
      this.reload();
    }, () => this.busy.set(false));
  }

  protected async remove(): Promise<void> {
    const id = this.editingId();
    if (!id || !(await this.confirm.askDelete())) return;
    this.busy.set(true);
    deleteRow(this.api, this.notifications, this.endpoint(), id, () => {
      this.busy.set(false);
      this.close();
      this.reload();
    }, () => this.busy.set(false));
  }

  private reload(): void {
    this.api.get<Row[]>(this.endpoint()).subscribe((data) => this.rows.set(data));
  }

}
