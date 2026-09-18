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
import { LookupService } from '../../core/services/lookup.service';
import { NotificationService } from '../../core/services/notification.service';
import { AccessService } from '../../core/security/access.service';
import { exportRowsToCsv } from '../crud/export-csv';
import { deleteRow, persistRow } from '../crud/crud-write';
import { draftFromRow, emptyDraft, shownColumns, shownFields } from '../crud/form-draft';
import { childFilterPatch, extrasFromParams, ListFilter, withStockFilter } from '../crud/list-filter';
import { crudListQuery, decorateRows, readListParams } from '../crud/paged-list';
import { coerceStatus, isActionStatusKey, isStatusKey, StatusPick } from '../crud/status-flow';
import { withGenerated } from '../crud/serial';
import { ConfirmService } from '../../core/services/confirm.service';
import { printWide } from '../crud/print-page';
import { Translated } from '../translated.base';
import { UiEntityForm } from './ui-entity-form';
import { UiIcon } from './ui-icon';
import { UiListFilters } from './ui-list-filters';
import { UiModal } from './ui-modal';
import { UiPager } from './ui-pager';
import { UiTable } from './ui-table';

type Row = Record<string, unknown>;
type Draft = Record<string, string | number | boolean>;

@Component({
  selector: 'crud-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiTable, UiEntityForm, UiModal, UiIcon, UiPager, UiListFilters],
  template: `
    <div class="row token-toolbar">
      <ui-list-filters
        [search]="search()"
        [filters]="activeFilters()"
        [values]="filterValues()"
        [status]="status()"
        [statusKeys]="statusKeys()"
        [statusPrefix]="statusCol()?.keyPrefix ?? ''"
        [showDates]="!!dateKey()"
        [fromDate]="fromDate()"
        [toDate]="toDate()"
        (searchChange)="onSearch($event)"
        (changed)="onFilter($event)"
        (fromChange)="fromDate.set($event); reloadFirst()"
        (toChange)="toDate.set($event); reloadFirst()"
      />
      <div class="row token-toolbar__actions">
        @if (allow('print')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="print()">
            <ui-icon name="print" [size]="16" [brand]="true" />
            {{ t('common.print') }}
          </button>
        }
        @if (allow('pdf')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="print(true)">
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
        [rows]="rows()"
        [clickable]="!readOnly() && allow('edit')"
        [rowExport]="allow('print') || allow('pdf') || allow('excel')"
        [allowPrint]="allow('print')"
        [allowPdf]="allow('pdf')"
        [allowExcel]="allow('excel')"
        [titleKey]="titleKey()"
        [printKind]="printKind()"
        [printAsReport]="moduleId() === 'reports'"
        [statusCols]="!readOnly() && allow('edit') ? statusCols() : []"
        (rowClick)="openEdit($event)"
        (statusChange)="applyStatus($event)"
      />
    </div>
    <ui-pager
      [page]="page()"
      [pageSize]="pageSize()"
      [total]="total()"
      (pageChange)="setParam('page', $event)"
      (pageSizeChange)="setParam('pageSize', $event)"
    />

    @if (open()) {
      <ui-modal [titleKey]="editingId() ? 'common.edit' : 'common.create'" (closed)="open.set(false)">
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
            <button type="button" class="ui-btn ui-btn--ghost" (click)="open.set(false)">
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
  readonly filters = input<ListFilter[]>([]);
  private readonly api = inject(ApiClientService);
  private readonly access = inject(AccessService);
  private readonly confirm = inject(ConfirmService);
  private readonly lookups = inject(LookupService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private searchTimer: ReturnType<typeof setTimeout> | undefined;
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
  protected readonly page = signal(1);
  protected readonly pageSize = signal(20);
  protected readonly total = signal(0);
  protected readonly filterValues = signal<Record<string, string>>({});
  protected readonly hasStockFilter = computed(() =>
    this.columns().some((col) => col.key === 'stockStatus'),
  );
  protected readonly activeFilters = computed(() => withStockFilter(this.filters(), this.hasStockFilter()));
  protected readonly statusCol = computed(() =>
    this.columns().find((col) => col.type === 'badge' && isStatusKey(col.key)),
  );
  /** Every badge column that renders row action buttons (status + approvals). */
  protected readonly statusCols = computed(() =>
    this.columns().filter((col) => col.type === 'badge' && isActionStatusKey(col.key)),
  );
  protected readonly statusKeys = computed(() => Object.keys(this.statusCol()?.badgeToneMap ?? {}));
  protected readonly dateKey = computed(
    () => this.columns().find((col) => col.type === 'date' || col.type === 'datetime')?.key ?? (this.moduleId() === 'reports' || this.tabId() === 'itemMovement' ? 'date' : ''),
  );

  constructor() {
    super();
    this.route.queryParamMap.subscribe((params) => {
      const next = readListParams(params);
      this.stock.set(next.stock);
      this.status.set(next.status);
      this.search.set(next.q);
      this.page.set(next.page);
      this.pageSize.set(next.pageSize);
      queueMicrotask(() => this.reload());
    });
  }

  protected setParam(key: string, value: string | number): void { this.patchParams({ [key]: value || null }); }

  protected onFilter(event: { key: string; value: string }): void {
    this.patchParams(childFilterPatch(this.activeFilters(), event.key, event.value));
  }

  private patchParams(patch: Record<string, string | number | null>): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, ...patch },
      queryParamsHandling: 'merge',
    });
  }

  protected onSearch(value: string): void {
    this.search.set(value);
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.setParam('q', value), 300);
  }

  protected reloadFirst(): void {
    this.page.set(1);
    this.reload();
  }

  protected print(asPdf = false): void {
    if (asPdf) this.notifications.info('common.pdfHint');
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
    return this.editingId() ? fields.filter((field) => !isStatusKey(field.key)) : fields;
  }

  protected applyStatus(event: StatusPick): void {
    persistRow(
      this.api, this.notifications, this.endpoint(), String(event.row[this.idKey()]),
      { ...event.row, ...event.extra, [event.key]: coerceStatus(event.status) } as Draft,
      () => this.reload(), () => {},
    );
  }

  protected exportExcel(): void {
    const query = crudListQuery(this.page(), this.pageSize(), this.search(), this.fromDate(), this.toDate(), this.status(), this.stock(), this.extras(), true);
    this.api.getWithMeta<Row[]>(this.endpoint(), query).subscribe((res) => {
      exportRowsToCsv(this.shownColumns(), decorateRows(res.data, this.hasStockFilter()), this.endpoint(), this.t, this.i18n.formatNumber);
    });
  }

  protected openCreate(): void {
    this.editingId.set(null);
    this.draft.set(withGenerated(this.fields(), emptyDraft(this.shownFields()), this.rows()));
    this.open.set(true);
  }

  protected openEdit(row: Row): void {
    if (this.readOnly()) return;
    this.editingId.set(String(row[this.idKey()] ?? ''));
    this.draft.set(draftFromRow(this.shownFields(), row));
    this.open.set(true);
  }

  protected async save(): Promise<void> {
    if (!(await this.confirm.askSave())) return;
    this.busy.set(true);
    persistRow(this.api, this.notifications, this.endpoint(), this.editingId(), withGenerated(this.fields(), this.draft(), this.rows()), () => {
      this.busy.set(false);
      this.open.set(false);
      this.reload();
    }, () => this.busy.set(false));
  }

  protected async remove(): Promise<void> {
    const id = this.editingId();
    if (!id || !(await this.confirm.askDelete())) return;
    this.busy.set(true);
    deleteRow(this.api, this.notifications, this.endpoint(), id, () => {
      this.busy.set(false);
      this.open.set(false);
      this.reload();
    }, () => this.busy.set(false));
  }

  private extras(): Record<string, string> {
    const extras = extrasFromParams(this.route.snapshot.queryParamMap, this.activeFilters());
    this.filterValues.set(extras);
    return extras;
  }

  private reload(): void {
    this.lookups.refresh();
    const query = crudListQuery(this.page(), this.pageSize(), this.search(), this.fromDate(), this.toDate(), this.status(), this.stock(), this.extras());
    this.api.getWithMeta<Row[]>(this.endpoint(), query).subscribe((res) => {
      this.rows.set(decorateRows(res.data, this.hasStockFilter()));
      this.total.set(res.meta?.total ?? res.data.length);
      if (res.meta?.page) this.page.set(res.meta.page);
    });
  }
}
