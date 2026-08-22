import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { PurchaseRequestLine } from '../../core/models/purchasing.models';
import { LookupService } from '../../core/services/lookup.service';
import { Translated } from '../translated.base';
import { UiIcon } from './ui-icon';

/** Cart of catalog items and/or new items (optional notes). */
@Component({
  selector: 'ui-request-lines',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon],
  template: `
    <div class="stack ui-request-lines">
      <div class="ui-request-lines__add">
        <label class="ui-field">
          <span class="ui-field__label">{{ t('warehouse.tabs.items') }}</span>
          <input
            class="ui-control"
            [attr.list]="listId"
            [value]="name()"
            (input)="name.set($any($event.target).value)"
          />
          <datalist [id]="listId">
            @for (option of items(); track option.value) {
              <option [value]="option.label ?? option.value"></option>
            }
          </datalist>
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
          <span class="ui-field__label">{{ t('common.notes') }}</span>
          <input
            class="ui-control"
            [value]="note()"
            (input)="note.set($any($event.target).value)"
          />
        </label>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="add()">
          <ui-icon name="plus" [size]="16" />
          {{ t('common.create') }}
        </button>
      </div>
      @if (!lines().length) {
        <p class="ui-field__hint">{{ t('common.empty') }}</p>
      } @else {
        <ul class="ui-request-lines__cart">
          @for (line of lines(); track $index) {
            <li class="ui-request-lines__row">
              <span class="ui-request-lines__name">
                {{ labelOf(line) }}
                @if (line.specification) {
                  <span class="ui-field__hint">{{ line.specification }}</span>
                }
              </span>
              <input
                class="ui-control ui-request-lines__qty"
                type="number"
                [value]="line.quantity"
                (input)="setQty($index, $event)"
              />
              <button type="button" class="ui-btn ui-btn--ghost ui-btn--icon" (click)="remove($index)">
                <ui-icon name="close" [size]="16" />
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class UiRequestLines extends Translated {
  readonly value = input('');
  readonly valueChange = output<string>();

  private readonly lookups = inject(LookupService);
  protected readonly listId = `pr-stock-${Math.random().toString(36).slice(2, 8)}`;
  protected readonly name = signal('');
  protected readonly note = signal('');
  protected readonly qty = signal(1);
  protected readonly items = computed(() => this.lookups.options('stockItems'));
  protected readonly lines = computed(() => parseLines(this.value()));

  constructor() {
    super();
    this.lookups.refresh();
  }

  protected labelOf(line: PurchaseRequestLine): string {
    const match = this.items().find(
      (option) => option.value === line.itemCode || option.label === line.itemName,
    );
    return match?.label ?? line.itemName;
  }

  protected add(): void {
    const name = this.name().trim();
    const quantity = this.qty();
    if (!name || quantity <= 0) return;
    const match = this.items().find(
      (option) => option.value === name || (option.label ?? '') === name,
    );
    const next: PurchaseRequestLine = {
      itemCode: match?.value ?? '',
      itemName: match?.label ?? name,
      quantity,
      unitKey: 'units.piece',
      specification: this.note().trim() || undefined,
    };
    const lines = [...this.lines()];
    const index = lines.findIndex((line) => sameLine(line, next));
    if (index >= 0) {
      lines[index] = {
        ...lines[index],
        quantity: Number(lines[index].quantity) + quantity,
        specification: next.specification || lines[index].specification,
      };
    } else {
      lines.push(next);
    }
    this.emit(lines);
    this.name.set('');
    this.note.set('');
    this.qty.set(1);
  }

  protected setQty(index: number, event: Event): void {
    const quantity = this.toNumber(event);
    const lines = this.lines().map((line, i) => (i === index ? { ...line, quantity } : line));
    this.emit(lines.filter((line) => line.quantity > 0));
  }

  protected remove(index: number): void {
    this.emit(this.lines().filter((_, i) => i !== index));
  }

  protected toNumber(event: Event): number {
    const parsed = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private emit(lines: PurchaseRequestLine[]): void {
    this.valueChange.emit(JSON.stringify(lines));
  }
}

function sameLine(left: PurchaseRequestLine, right: PurchaseRequestLine): boolean {
  if (left.itemCode || right.itemCode) return left.itemCode === right.itemCode;
  return left.itemName === right.itemName && (left.specification ?? '') === (right.specification ?? '');
}

function parseLines(raw: string): PurchaseRequestLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as PurchaseRequestLine[]) : [];
  } catch {
    return [];
  }
}
