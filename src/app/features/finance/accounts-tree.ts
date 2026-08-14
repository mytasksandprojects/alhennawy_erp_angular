import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
} from '@angular/core';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { multilangKey } from '../../core/models/common.models';
import { Account } from '../../core/models/finance.models';
import { Translated } from '../../shared/translated.base';
import { UiBadge } from '../../shared/components/ui-badge';
import { UiIcon } from '../../shared/components/ui-icon';

/**
 * شجرة الحسابات — recursive, expandable chart of accounts.
 * Account names come localized from the API (name / name_<lang>).
 */
@Component({
  selector: 'app-accounts-tree',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiBadge, UiIcon],
  template: `
    @for (account of accounts(); track account.code) {
      <div [style.margin-inline-start]="depth() === 0 ? '0' : 'var(--space-lg)'">
        <div
          class="row row--between"
          [style.padding]="'var(--space-sm)'"
          [style.border-bottom]="'var(--border-width) solid var(--color-border)'"
          [style.cursor]="account.children?.length ? 'pointer' : 'default'"
          (click)="toggle(account.code)"
        >
          <span class="row">
            @if (account.children?.length) {
              <ui-icon [name]="isOpen(account.code) ? 'minus' : 'plus'" [size]="14" />
            }
            <strong class="mono">{{ account.code }}</strong>
            <span>{{ displayName(account) }}</span>
          </span>
          <span class="row">
            <span class="text-faint">{{ account.currency }}</span>
            <ui-badge
              [labelKey]="'finance.nature.' + account.nature"
              [tone]="account.nature === 'debit' ? 'info' : 'warning'"
            />
            @if (account.costCenterRequired) {
              <ui-badge labelKey="finance.fields.costCenter" tone="neutral" />
            }
          </span>
        </div>
        @if (isOpen(account.code) && account.children?.length) {
          <app-accounts-tree [accounts]="account.children!" [depth]="depth() + 1" />
        }
      </div>
    }
  `,
})
export class AccountsTree extends Translated {
  readonly accounts = input.required<Account[]>();
  readonly depth = input(0);

  private readonly store = inject(RuntimeConfigStore);
  private readonly open = signal<Set<string>>(new Set());

  protected displayName(account: Account): string {
    const key = multilangKey(
      'name',
      this.store.language(),
      this.store.settings()?.defaultLanguage ?? 'ar',
    );
    const value = (account as unknown as Record<string, unknown>)[key];
    return typeof value === 'string' && value ? value : account.name;
  }

  protected isOpen(code: string): boolean {
    return this.open().has(code);
  }

  protected toggle(code: string): void {
    this.open.update((set) => {
      const next = new Set(set);
      if (next.has(code)) {
        next.delete(code);
      } else {
        next.add(code);
      }
      return next;
    });
  }
}
