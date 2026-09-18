import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { SalesOrderLine } from '../../core/models/sales.models';
import { LookupService } from '../../core/services/lookup.service';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

/**
 * Rich sales order lines — item + ply + color + width + GSM + quantity +
 * price per KG, with the line and grand totals (quantity × price).
 * Items come from the `salesItems` lookup group, which Sales Settings
 * limits to the selected warehouses.
 */
@Component({
  selector: 'ui-sales-lines',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    <div class="stack ui-request-lines">
      <div class="ui-request-lines__add">
        <label class="ui-field">
          <span class="ui-field__label">{{ t('qc.fields.productName') }}</span>
          <select
            class="ui-control"
            [value]="item()"
            (change)="item.set($any($event.target).value)"
          >
            <option value="">{{ t('common.search') }}</option>
            @for (option of items(); track option.value) {
              <option [value]="option.value">{{ option.label ?? option.value }}</option>
            }
          </select>
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('qc.fields.ply') }}</span>
          <select
            class="ui-control"
            [value]="ply()"
            (change)="ply.set($any($event.target).value)"
          >
            @for (option of plies(); track option.value) {
              <option [value]="option.value">{{ option.label ?? option.value }}</option>
            }
          </select>
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('qc.fields.color') }}</span>
          <select
            class="ui-control"
            [value]="color()"
            (change)="color.set($any($event.target).value)"
          >
            @for (option of colors(); track option.value) {
              <option [value]="option.value">{{ labelOf(option) }}</option>
            }
          </select>
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('qc.fields.width') }}</span>
          <input
            class="ui-control"
            type="number"
            [value]="width()"
            (input)="width.set(toNumber($event))"
          />
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('cutter.label.gsm') }}</span>
          <input
            class="ui-control"
            type="number"
            [value]="gsm()"
            (input)="gsm.set(toNumber($event))"
          />
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('common.quantity') }}</span>
          <input
            class="ui-control"
            type="number"
            [value]="qty()"
            (input)="qty.set(toNumber($event))"
          />
        </label>
        <label class="ui-field">
          <span class="ui-field__label">{{ t('sales.fields.pricePerKg') }}</span>
          <input
            class="ui-control"
            type="number"
            [value]="price()"
            (input)="price.set(toNumber($event))"
          />
        </label>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="add()">
          <ui-icon name="plus" [size]="16" />
          {{ t('sales.lines.add') }}
        </button>
      </div>
      @if (!lines().length) {
        <p class="ui-field__hint">{{ t('sales.lines.empty') }}</p>
      } @else {
        <ul class="ui-request-lines__cart">
          @for (line of lines(); track $index) {
            <li class="ui-request-lines__row">
              <span class="ui-request-lines__name">
                {{ line.itemName }}
                <span class="ui-field__hint">
                  {{ t('qc.fields.ply') }} {{ line.ply }} · {{ colorOf(line) }} ·
                  {{ fmtNum(line.widthMm || 0) }} mm ·
                  {{ fmtNum(line.gsm || 0) }} {{ t('cutter.label.gsm') }}
                </span>
              </span>
              <input
                class="ui-control ui-request-lines__qty"
                type="number"
                [value]="line.quantity"
                (input)="setField($index, 'quantity', $event)"
              />
              <input
                class="ui-control ui-request-lines__qty"
                type="number"
                [value]="line.pricePerKg"
                (input)="setField($index, 'pricePerKg', $event)"
              />
              <span class="ui-request-lines__total">{{ fmtNum(lineTotal(line)) }}</span>
              <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" (click)="remove($index)">
                <ui-icon name="close" [size]="16" />
              </button>
            </li>
          }
        </ul>
        <p class="ui-request-lines__grand">
          {{ t('sales.fields.totalPrice') }}: <strong>{{ fmtNum(total()) }}</strong>
        </p>
      }
    </div>
  `,
})
export class UiSalesLines extends Translated {
  readonly value = input('');
  readonly unitKey = input('units.kg');
  readonly valueChange = output<string>();

  private readonly lookups = inject(LookupService);
  protected readonly item = signal('');
  protected readonly ply = signal('2');
  protected readonly color = signal('qc.colors.white');
  protected readonly width = signal(0);
  protected readonly gsm = signal(0);
  protected readonly qty = signal(0);
  protected readonly price = signal(0);
  protected readonly items = computed(() => this.lookups.options('salesItems'));
  protected readonly plies = computed(() => this.lookups.options('qcPly'));
  protected readonly colors = computed(() => this.lookups.options('qcColors'));
  protected readonly lines = computed(() => parseLines(this.value()));
  protected readonly total = computed(() =>
    this.lines().reduce((sum, line) => sum + this.lineTotal(line), 0),
  );

  constructor() {
    super();
    this.lookups.refresh();
  }

  protected lineTotal(line: SalesOrderLine): number {
    return Number(line.quantity || 0) * Number(line.pricePerKg || 0);
  }

  protected labelOf(option: { value: string; label?: string; labelKey?: string }): string {
    if (option.label && option.label !== option.value) return option.label;
    const translated = this.t(option.value);
    return translated || option.label || option.value;
  }

  protected colorOf(line: SalesOrderLine): string {
    const color = String(line.color || '');
    return this.t(color) || color;
  }

  protected add(): void {
    const code = this.item().trim();
    const quantity = this.qty();
    if (!code || quantity <= 0) return;
    const match = this.items().find((option) => option.value === code);
    const next: SalesOrderLine = {
      itemCode: match?.value ?? '',
      itemName: match?.label ?? code,
      ply: this.ply() || undefined,
      color: this.color() || undefined,
      widthMm: this.width() || undefined,
      gsm: this.gsm() || undefined,
      quantity,
      pricePerKg: this.price() || undefined,
      unitKey: this.unitKey(),
    };
    this.emit([...this.lines(), next]);
    this.item.set('');
    this.qty.set(0);
    this.price.set(0);
  }

  protected setField(index: number, key: 'quantity' | 'pricePerKg', event: Event): void {
    const value = this.toNumber(event);
    this.emit(
      this.lines().map((line, i) => (i === index ? { ...line, [key]: value } : line)),
    );
  }

  protected remove(index: number): void {
    this.emit(this.lines().filter((_, i) => i !== index));
  }

  protected toNumber(event: Event): number {
    const parsed = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private emit(lines: SalesOrderLine[]): void {
    this.valueChange.emit(JSON.stringify(lines));
  }
}

function parseLines(raw: string): SalesOrderLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as SalesOrderLine[]) : [];
  } catch {
    return [];
  }
}
