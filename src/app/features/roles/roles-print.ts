import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TableColumn } from '../../core/models/common.models';
import { Translated } from '../../shared/translated.base';
import { ROLE_MATRIX_COLUMNS } from './roles-matrix';

/** Print / PDF sheet — every grant as a table, not the live accordion. */
@Component({
  selector: 'app-role-print',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <table class="ui-table">
      <thead>
        <tr>
          @for (col of columns; track col.key) {
            <th>{{ t(col.labelKey) }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track $index) {
          <tr>
            @for (col of columns; track col.key) {
              <td>{{ cell(row, col) }}</td>
            }
          </tr>
        }
      </tbody>
    </table>
  `,
})
export class RolePrint extends Translated {
  readonly rows = input.required<Record<string, unknown>[]>();
  protected readonly columns = ROLE_MATRIX_COLUMNS;

  protected cell(row: Record<string, unknown>, col: TableColumn): string {
    const raw = row[col.key];
    if (raw === undefined || raw === null || raw === '') return '';
    const text = col.type === 'key' ? this.t(String(raw)) : String(raw);
    const lang = col.key === 'item' ? String(row['langKey'] ?? '') : '';
    return lang ? `${text} — ${this.t(lang)}` : text;
  }
}
