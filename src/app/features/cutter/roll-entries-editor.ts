import { ChangeDetectionStrategy, Component, input, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerSpec } from '../../core/models/cutter.models';
import { Translated } from '../../shared/translated.base';
import { UiIcon } from '../../shared/components/ui-icon';

export interface RollEntryForm {
  weightKg: number | null;
  gsm: number | null;
  rollWidthMm: number | null;
  diameterMm: number | null;
  grade: 'first' | 'second';
}

export function blankRollEntry(defaults: Partial<RollEntryForm> | null): RollEntryForm {
  return {
    weightKg: null,
    gsm: defaults?.gsm ?? null,
    rollWidthMm: defaults?.rollWidthMm ?? null,
    diameterMm: defaults?.diameterMm ?? null,
    grade: defaults?.grade ?? 'first',
  };
}

/** Repeatable sub-roll input groups — «إضافة بكرة أخرى» appends another fieldset. */
@Component({
  selector: 'app-roll-entries-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiIcon],
  template: `
    @for (entry of entries()(); track $index; let i = $index) {
      <fieldset class="ui-card stack">
        <div class="row row--between">
          <strong>
            {{ t('cutter.subRoll') }} #{{ i + 1 }}
            <span class="mono">— {{ t('cutter.fields.serial') }}: {{ subSerial(i) }}</span>
          </strong>
          @if (entries()().length > 1) {
            <button
              type="button"
              class="ui-btn ui-btn--ghost"
              (click)="removeEntry(i)"
            >
              <ui-icon name="close" [size]="14" />
              {{ t('common.delete') }}
            </button>
          }
        </div>
        <div class="ui-form-grid">
          <label class="ui-field">
            <span class="ui-field__label">{{ t('cutter.fields.weight') }}</span>
            <input
              class="ui-control"
              type="number"
              min="1"
              [name]="'weight' + i"
              required
              [(ngModel)]="entry.weightKg"
            />
          </label>
          <label class="ui-field">
            <span class="ui-field__label">{{ t('cutter.fields.gsm') }}</span>
            <input
              class="ui-control"
              type="number"
              min="1"
              [name]="'gsm' + i"
              required
              [(ngModel)]="entry.gsm"
            />
          </label>
          <label class="ui-field">
            <span class="ui-field__label">{{ t('cutter.fields.width') }}</span>
            <input
              class="ui-control"
              type="number"
              min="1"
              [name]="'width' + i"
              required
              [(ngModel)]="entry.rollWidthMm"
            />
          </label>
          <label class="ui-field">
            <span class="ui-field__label">{{ t('cutter.fields.diameter') }}</span>
            <input
              class="ui-control"
              type="number"
              min="1"
              [name]="'diameter' + i"
              required
              [(ngModel)]="entry.diameterMm"
            />
          </label>
          <label class="ui-field">
            <span class="ui-field__label">{{ t('cutter.fields.grade') }}</span>
            <select class="ui-control" [name]="'grade' + i" [(ngModel)]="entry.grade">
              <option value="first">{{ t('cutter.grades.first') }}</option>
              <option value="second">{{ t('cutter.grades.second') }}</option>
            </select>
          </label>
        </div>
      </fieldset>
    }

    <div>
      <button type="button" class="ui-btn ui-btn--ghost" (click)="addEntry()">
        <ui-icon name="plus" [size]="16" />
        {{ t('cutter.addRoll') }}
      </button>
    </div>
  `,
})
export class RollEntriesEditor extends Translated {
  /** Parent's entries signal — rows are added/removed/edited inline. */
  readonly entries = input.required<WritableSignal<RollEntryForm[]>>();
  /** Next main serial — previews each sub-roll's serial. */
  readonly nextSerial = input(0);
  /** Current spec — seeds GSM/width defaults on new entries. */
  readonly spec = input<CustomerSpec | null>(null);

  /** Serial preview for entry i: main serial first, then one per sub-roll. */
  protected subSerial(index: number): number {
    return this.nextSerial() + 1 + index;
  }

  protected addEntry(): void {
    const spec = this.spec();
    this.entries().update((list) => [
      ...list,
      blankRollEntry({ gsm: spec?.gsm ?? null, rollWidthMm: spec?.rollWidthMm ?? null }),
    ]);
  }

  protected removeEntry(index: number): void {
    this.entries().update((list) => list.filter((_, i) => i !== index));
  }
}
