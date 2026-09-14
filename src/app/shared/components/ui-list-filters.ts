import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { SelectOption } from '../../core/models/common.models';
import { LookupService } from '../../core/services/lookup.service';
import { ListFilter } from '../crud/list-filter';
import { Translated } from '../translated.base';

/** Labeled search + dropdowns for a paged list toolbar. */
@Component({
  selector: 'ui-list-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="crud-filters">
      <label class="crud-filter crud-filter--search">
        <span class="ui-field__label">{{ t('common.search') }}</span>
        <input
          class="ui-control"
          type="search"
          [placeholder]="t('common.search')"
          [value]="search()"
          (input)="searchChange.emit($any($event.target).value)"
        />
      </label>
      @for (filter of filters(); track filter.key) {
        <label class="crud-filter">
          <span class="ui-field__label">{{ t(filter.labelKey) }}</span>
          <select
            class="ui-control"
            [value]="values()[filter.key] || ''"
            (change)="changed.emit({ key: filter.key, value: $any($event.target).value })"
          >
            <option value="">{{ t('common.all') }}</option>
            @for (option of optionsOf(filter); track option.value) {
              <option [value]="option.value">{{ option.label ?? t(option.labelKey ?? '') }}</option>
            }
          </select>
        </label>
      }
      @if (statusKeys().length) {
        <label class="crud-filter">
          <span class="ui-field__label">{{ t('common.status') }}</span>
          <select class="ui-control" [value]="status()" (change)="changed.emit({ key: 'status', value: $any($event.target).value })">
            <option value="">{{ t('common.all') }}</option>
            @for (key of statusKeys(); track key) {
              <option [value]="key">{{ t(statusPrefix() + key) }}</option>
            }
          </select>
        </label>
      }
      @if (showDates()) {
        <div class="crud-filter-range">
          <label class="crud-filter crud-filter--date">
            <span class="ui-field__label">{{ t('common.from') }}</span>
            <input class="ui-control" type="date" [value]="fromDate()" (change)="fromChange.emit($any($event.target).value)" />
          </label>
          <label class="crud-filter crud-filter--date">
            <span class="ui-field__label">{{ t('common.to') }}</span>
            <input class="ui-control" type="date" [value]="toDate()" (change)="toChange.emit($any($event.target).value)" />
          </label>
        </div>
      }
    </div>
  `,
})
export class UiListFilters extends Translated {
  readonly search = input('');
  readonly filters = input<ListFilter[]>([]);
  readonly values = input<Record<string, string>>({});
  readonly status = input('');
  readonly statusKeys = input<string[]>([]);
  readonly statusPrefix = input('');
  readonly showDates = input(false);
  readonly fromDate = input('');
  readonly toDate = input('');
  readonly searchChange = output<string>();
  readonly changed = output<{ key: string; value: string }>();
  readonly fromChange = output<string>();
  readonly toChange = output<string>();
  private readonly lookups = inject(LookupService);

  protected optionsOf(filter: ListFilter): SelectOption[] {
    const parent = filter.filterBy ? this.values()[filter.filterBy] ?? '' : '';
    const rows = filter.lookup ? this.lookups.options(filter.lookup) : filter.options ?? [];
    if (!filter.filterBy || !parent) return rows;
    return rows.filter((row) => row.parentValue === parent);
  }
}
