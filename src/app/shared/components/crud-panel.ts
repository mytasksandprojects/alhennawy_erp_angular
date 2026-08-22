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
import { emptyDraft, rowMatches, shownColumns, shownFields } from '../crud/form-draft';
import { printWide } from '../crud/print-page';
import { matchesStock, stockStatusOf } from '../crud/stock-filter';
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
        <select
          class="ui-control"
          [value]="stock()"
          (change)="setStock($any($event.target).value)"
        >
          <option value="">{{ t('common.all') }}</option>
          <option value="below">{{ t('warehouse.stats.belowMinimum') }}</option>
          <option value="out">{{ t('warehouse.stats.outOfStock') }}</option>
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

  private readonly api = inject(ApiClientService);
  private readonly access = inject(AccessService);
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
  protected readonly hasStockFilter = computed(() =>
    this.columns().some((col) => col.key === 'stockStatus'),
  );

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
    const stock = this.stock();
    return this.rows()
      .filter((row) => {
        if (key && (from || to)) {
          const value = String(row[key] ?? '').slice(0, 10);
          if (!value) return false;
          if ((from && value < from) || (to && value > to)) return false;
        }
        if (!matchesStock(row, stock)) return false;
        return !term || rowMatches(row, this.columns(), term, this.t);
      })
      .map((row) =>
        this.hasStockFilter() ? { ...row, stockStatus: stockStatusOf(row) } : row,
      );
  });

  constructor() {
    super();
    this.route.queryParamMap.subscribe((params) => {
      this.stock.set(params.get('stock') ?? '');
      this.search.set(params.get('q') ?? '');
    });
    queueMicrotask(() => this.reload());
  }

  protected setStock(value: string): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { stock: value || null },
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
    return shownFields(this.fields(), this.columns(), this.shownColumns(), this.moduleId(), this.tabId(), this.access);
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

}
