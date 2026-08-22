import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Translated } from '../../shared/translated.base';
import { RoleMatrixRow, RoleMatrixScreen } from './roles-matrix';

@Component({
  selector: 'app-role-perms',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (screen().buttons.length) {
      <p class="ui-field__label">{{ t('roles.kind.button') }}</p>
      <div class="role-grid">
        @for (row of screen().buttons; track row.id) {
          <label class="row">
            <input
              type="checkbox"
              [checked]="allowed(row.perm)"
              (change)="flipped.emit({ row, on: $any($event.target).checked })"
            />
            {{ t(row.item) }}
          </label>
        }
      </div>
    }
    @if (screen().columns.length) {
      <p class="ui-field__label">{{ t('roles.kind.column') }}</p>
      <div class="role-grid">
        @for (row of screen().columns; track row.id) {
          <label class="row">
            <input
              type="checkbox"
              [checked]="allowed(row.perm)"
              (change)="flipped.emit({ row, on: $any($event.target).checked })"
            />
            {{ t(row.item) }}@if (row.langKey) { — {{ t(row.langKey) }} }
          </label>
        }
      </div>
    }
  `,
})
export class RolePerms extends Translated {
  readonly screen = input.required<RoleMatrixScreen>();
  readonly granted = input.required<string[]>();
  readonly starred = input(false);
  readonly flipped = output<{ row: RoleMatrixRow; on: boolean }>();

  protected allowed(perm: string): boolean {
    return this.starred() || this.granted().includes(perm);
  }
}
