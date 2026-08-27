import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import {
  FormField,
  multilangKey,
  SelectOption,
} from '../../core/models/common.models';
import { LanguageOption } from '../../core/models/config.models';
import { AccessService } from '../../core/security/access.service';
import { LookupService } from '../../core/services/lookup.service';
import { Translated } from '../translated.base';
import { UiImageInput } from './ui-image-input';
import { UiRequestLines } from './ui-request-lines';

type Draft = Record<string, string | number | boolean>;

/** Config-driven create/edit form. Every label comes from the API map. */
@Component({
  selector: 'ui-entity-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiImageInput, UiRequestLines],
  template: `
    <div class="ui-form-grid">
      @for (field of fields(); track field.key) {
        @if (field.type === 'lines') {
          <div class="ui-field ui-field--wide">
            <span class="ui-field__label">{{ t(field.labelKey) }}</span>
            <ui-request-lines
              [value]="asText(field.key)"
              (valueChange)="set(field.key, $event)"
            />
          </div>
        } @else if (field.multilang) {
          <!-- One input per configured language; new languages auto-appear -->
          @for (lang of langsFor(field); track lang.code) {
            <label class="ui-field">
              <span class="ui-field__label">
                {{ t(field.labelKey) }} — {{ t(lang.labelKey) }}
              </span>
              @if (field.type === 'textarea') {
                <textarea
                  class="ui-control"
                  [ngModel]="asText(langKey(field, lang.code))"
                  (ngModelChange)="set(langKey(field, lang.code), $event)"
                ></textarea>
              } @else {
                <input
                  class="ui-control"
                  type="text"
                  [ngModel]="asText(langKey(field, lang.code))"
                  (ngModelChange)="set(langKey(field, lang.code), $event)"
                />
              }
            </label>
          }
        } @else {
        <label class="ui-field">
          <span class="ui-field__label">{{ t(field.labelKey) }}</span>
          @switch (field.type) {
            @case ('select') {
              <select
                class="ui-control"
                [ngModel]="asText(field.key)"
                (ngModelChange)="setSelect(field, $event)"
              >
                @for (option of optionsFor(field); track option.value) {
                  <option [value]="option.value">
                    {{ option.label ?? t(option.labelKey ?? '') }}
                  </option>
                }
              </select>
            }
            @case ('textarea') {
              <textarea
                class="ui-control"
                [ngModel]="asText(field.key)"
                (ngModelChange)="set(field.key, $event)"
              ></textarea>
            }
            @case ('number') {
              <input
                class="ui-control"
                type="number"
                [disabled]="!!field.generated"
                [ngModel]="draft()[field.key]"
                (ngModelChange)="set(field.key, toNumber($event))"
              />
            }
            @case ('images') {
              <ui-image-input
                [value]="asText(field.key)"
                (valueChange)="set(field.key, $event)"
              />
            }
            @case ('files') {
              <ui-image-input
                [value]="asText(field.key)"
                kind="files"
                (valueChange)="set(field.key, $event)"
              />
            }
            @case ('date') {
              <input
                class="ui-control"
                type="date"
                [ngModel]="asText(field.key).slice(0, 10)"
                (ngModelChange)="set(field.key, $event)"
              />
            }
            @case ('time') {
              <input
                class="ui-control"
                type="time"
                [ngModel]="asText(field.key)"
                (ngModelChange)="set(field.key, $event)"
              />
            }
            @default {
              <input
                class="ui-control"
                [type]="field.type === 'password' ? 'password' : field.type === 'email' ? 'email' : 'text'"
                [attr.autocomplete]="field.type === 'password' ? 'new-password' : null"
                [disabled]="!!field.generated"
                [ngModel]="asText(field.key)"
                (ngModelChange)="set(field.key, $event)"
              />
            }
          }
        </label>
        }
      }
    </div>
  `,
})
export class UiEntityForm extends Translated {
  readonly fields = input.required<FormField[]>();
  readonly draft = model.required<Draft>();
  readonly moduleId = input('');
  readonly tabId = input('');

  private readonly lookups = inject(LookupService);
  private readonly access = inject(AccessService);
  private readonly store = inject(RuntimeConfigStore);

  protected readonly languages = computed(
    () => this.store.settings()?.languages ?? [],
  );

  constructor() {
    super();
    // Forms open rarely; always re-fetch so admin lookup edits apply.
    this.lookups.refresh();
  }

  protected langsFor(field: FormField): LanguageOption[] {
    const moduleId = this.moduleId();
    const tabId = this.tabId();
    return this.languages().filter(
      (lang) => !moduleId || !tabId || this.access.canColumn(moduleId, tabId, this.langKey(field, lang.code)),
    );
  }

  /** Draft key holding a multilang field's value for one language. */
  protected langKey(field: FormField, code: string): string {
    return multilangKey(
      field.key,
      code,
      this.store.settings()?.defaultLanguage ?? 'ar',
    );
  }

  /** Static options from config, or the admin-managed lookup group. */
  protected optionsFor(field: FormField): SelectOption[] {
    if (field.lookup) return this.lookups.options(field.lookup);
    return field.options ?? [];
  }

  protected asText(key: string): string {
    const value = this.draft()[key];
    return value === undefined || value === null ? '' : String(value);
  }

  protected set(key: string, value: string | number): void {
    this.draft.update((current) => ({ ...current, [key]: value }));
  }

  /** Select change; also applies the option's default rate (overridable). */
  protected setSelect(field: FormField, value: string): void {
    this.set(field.key, value);
    if (field.copyKey) {
      const option = this.optionsFor(field).find((row) => row.value === value);
      if (option?.label) this.set(field.copyKey, option.label);
    }
    if (!field.rateKey || !field.lookup) return;
    const rate = this.lookups.rateOf(field.lookup, value);
    if (rate !== null) this.set(field.rateKey, rate);
  }

  protected toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
}
