import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { TableColumn } from '../../core/models/common.models';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { printCell, printTitleName } from '../crud/print-cell';
import { Translated } from '../translated.base';

type Row = Record<string, unknown>;

/** Letterhead invoice: brand, bill-to, lines, amount due (Stripe / ETA paper). */
@Component({
  selector: 'ui-print-doc',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'ui-print-doc' },
  template: `
    <article class="print-invoice print-only">
      <header class="print-invoice__banner">
        <div class="print-invoice__brand">
          <img class="print-invoice__logo" [src]="logoUrl()" [alt]="t(nameKey())" />
          <div>
            <strong>{{ t(nameKey()) }}</strong>
            <span>{{ t(addressKey()) }}</span>
            @if (phone()) {
              <span>{{ t('factory.fields.phone') }} {{ phone() }}</span>
            }
          </div>
        </div>
        <div class="print-invoice__id">
          <p class="print-invoice__kind">{{ heading() }}</p>
          <p class="print-invoice__no"><bdi>{{ text('number') }}</bdi></p>
        </div>
      </header>
      <section class="print-invoice__parties">
        <div class="print-invoice__bill">
          <span class="print-invoice__label">{{ t('common.to') }}</span>
          <strong>{{ customer() }}</strong>
          @if (text('customerCode')) {
            <span>{{ t('common.code') }} {{ text('customerCode') }}</span>
          }
        </div>
        <dl class="print-invoice__facts">
          <div>
            <dt class="print-invoice__label">{{ t('common.date') }}</dt>
            <dd>{{ date() }}</dd>
          </div>
          <div>
            <dt class="print-invoice__label">{{ t('common.type') }}</dt>
            <dd>{{ heading() }}</dd>
          </div>
          <div>
            <dt class="print-invoice__label">{{ t('common.currency') }}</dt>
            <dd>{{ text('currency') }}</dd>
          </div>
          @if (text('eInvoiceUid')) {
            <div>
              <dt class="print-invoice__label">{{ t('sales.fields.eInvoice') }}</dt>
              <dd><bdi>{{ text('eInvoiceUid') }}</bdi></dd>
            </div>
          }
          @if (text('exchangeRate')) {
            <div>
              <dt class="print-invoice__label">{{ t('finance.fields.rate') }}</dt>
              <dd>{{ text('exchangeRate') }}</dd>
            </div>
          }
        </dl>
      </section>
      <table class="print-invoice__lines">
        <thead>
          <tr>
            <th>{{ t('finance.fields.description') }}</th>
            <th>{{ t('common.total') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ heading() }} — {{ customer() }}</td>
            <td>{{ amount('total') }}</td>
          </tr>
        </tbody>
      </table>
      <div class="print-invoice__math">
        <div class="print-invoice__math-row">
          <span>{{ t('common.total') }}</span>
          <span>{{ amount('total') }}</span>
        </div>
        <div class="print-invoice__math-row">
          <span>{{ t('sales.fields.collected') }}</span>
          <span>{{ amount('collected') }}</span>
        </div>
        <div class="print-invoice__math-row print-invoice__due">
          <span>{{ t('common.balance') }}</span>
          <span>{{ due() }}</span>
        </div>
      </div>
      <footer class="print-sheet__foot">
        <div>{{ t(addressKey()) }}</div>
        @if (phone()) {
          <div>{{ t('factory.fields.phone') }} {{ phone() }}</div>
        }
        @if (text('eInvoiceUid')) {
          <div>{{ t('sales.fields.eInvoice') }} <bdi>{{ text('eInvoiceUid') }}</bdi></div>
        }
      </footer>
    </article>
  `,
})
export class UiPrintDoc extends Translated {
  readonly row = input.required<Row>();
  readonly columns = input.required<TableColumn[]>();
  readonly titleKey = input('');
  readonly kind = input<'record' | 'invoice'>('invoice');

  private readonly store = inject(RuntimeConfigStore);
  protected readonly logoUrl = () => this.store.settings()?.company.logoUrl ?? '';
  protected readonly nameKey = () => this.store.settings()?.company.nameKey ?? 'company.name';
  protected readonly addressKey = () =>
    this.store.settings()?.company.addressKey ?? 'company.address';
  protected readonly phone = () => this.store.settings()?.company.phone ?? '';

  protected readonly customer = computed(() =>
    printTitleName(
      this.row(),
      this.store.language(),
      this.store.settings()?.defaultLanguage ?? 'ar',
    ),
  );
  protected readonly heading = computed(() => {
    const kind = String(this.row()['kind'] ?? '');
    if (kind) {
      const label = this.t('sales.kinds.' + kind);
      if (label && label !== 'sales.kinds.' + kind) return label;
    }
    return this.t(this.titleKey() || 'sales.docs.invoice');
  });

  protected date(): string {
    const col = this.columns().find((item) => item.key === 'date');
    return col
      ? printCell(
          this.row(),
          col,
          this.store.language(),
          this.store.settings()?.defaultLanguage ?? 'ar',
          this.t,
          this.fmtNum,
          this.fmtDate,
        )
      : this.text('date');
  }

  protected text(key: string): string {
    const value = this.row()[key];
    return value === undefined || value === null ? '' : String(value);
  }

  protected money(key: string): string {
    const value = Number(this.row()[key] ?? 0);
    return Number.isFinite(value) ? this.fmtNum(value) : '';
  }

  protected amount(key: string): string {
    const cur = this.text('currency');
    const value = this.money(key);
    return cur ? `${value} ${cur}` : value;
  }

  protected due(): string {
    const value = this.fmtNum(
      Number(this.row()['total'] ?? 0) - Number(this.row()['collected'] ?? 0),
    );
    const cur = this.text('currency');
    return cur ? `${value} ${cur}` : value;
  }
}
