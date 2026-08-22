import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { CustomerSpec } from '../../core/models/cutter.models';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { Translated } from '../../shared/translated.base';
import { CutterApiService } from './cutter-api.service';

/**
 * Registering a produced roll: spec (customer code linked), weighing
 * result, GSM, width, diameter and grade (first/second — second grade
 * rolls are routed to the second-grade warehouse by the backend).
 */
@Component({
  selector: 'app-roll-create-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiPageHeader],
  template: `
    <ui-page-header titleKey="cutter.newRoll" subtitleKey="cutter.newRollSubtitle" />

    <form class="ui-card stack" (ngSubmit)="submit()">
      <div class="ui-form-grid">
        <label class="ui-field">
          <span class="ui-field__label">{{ t('cutter.fields.spec') }}</span>
          <select class="ui-control" name="spec" required [(ngModel)]="specCode">
            @for (spec of specs(); track spec.specCode) {
              <option [value]="spec.specCode">
                {{ spec.specCode }} — {{ spec.specName }}
              </option>
            }
          </select>
          <span class="ui-field__hint">{{ t('cutter.fields.specHint') }}</span>
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('cutter.fields.weight') }}</span>
          <input class="ui-control" type="number" min="1" name="weight" required [(ngModel)]="weightKg" />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('cutter.fields.gsm') }}</span>
          <input class="ui-control" type="number" min="1" name="gsm" required [(ngModel)]="gsm" />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('cutter.fields.width') }}</span>
          <input class="ui-control" type="number" min="1" name="width" required [(ngModel)]="rollWidthMm" />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('cutter.fields.diameter') }}</span>
          <input class="ui-control" type="number" min="1" name="diameter" required [(ngModel)]="diameterMm" />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('cutter.fields.grade') }}</span>
          <select class="ui-control" name="grade" [(ngModel)]="grade">
            <option value="first">{{ t('cutter.grades.first') }}</option>
            <option value="second">{{ t('cutter.grades.second') }}</option>
          </select>
        </label>
      </div>

      <label class="ui-field">
        <span class="ui-field__label">{{ t('common.notes') }}</span>
        <input class="ui-control" name="notes" [(ngModel)]="notes" />
      </label>

      <div class="row">
        <button class="ui-btn ui-btn--primary" type="submit" [disabled]="busy() || !isValid()">
          {{ t('common.save') }}
        </button>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="back()">
          {{ t('common.back') }}
        </button>
      </div>
    </form>
  `,
})
export class RollCreatePage extends Translated implements OnInit {
  private readonly cutterApi = inject(CutterApiService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);

  protected readonly specs = signal<CustomerSpec[]>([]);
  protected specCode = '';
  protected weightKg: number | null = null;
  protected gsm: number | null = null;
  protected rollWidthMm: number | null = null;
  protected diameterMm: number | null = null;
  protected grade: 'first' | 'second' = 'first';
  protected notes = '';
  protected readonly busy = signal(false);

  ngOnInit(): void {
    this.cutterApi.listSpecs().subscribe((specs) => {
      this.specs.set(specs);
      const first = specs[0];
      if (first && !this.specCode) {
        this.specCode = first.specCode;
        this.gsm = first.gsm;
        this.rollWidthMm = first.rollWidthMm;
      }
    });
  }

  protected isValid(): boolean {
    return (
      this.specCode.length > 0 &&
      (this.weightKg ?? 0) > 0 &&
      (this.gsm ?? 0) > 0 &&
      (this.rollWidthMm ?? 0) > 0 &&
      (this.diameterMm ?? 0) > 0
    );
  }

  protected async submit(): Promise<void> {
    if (!this.isValid() || this.busy() || !(await this.confirm.askSave())) return;
    this.busy.set(true);
    this.cutterApi
      .createRoll({
        specCode: this.specCode,
        weightKg: this.weightKg ?? 0,
        gsm: this.gsm ?? 0,
        rollWidthMm: this.rollWidthMm ?? 0,
        diameterMm: this.diameterMm ?? 0,
        grade: this.grade,
        notes: this.notes.trim() || undefined,
      })
      .subscribe({
        next: (roll) => {
          this.notifications.success('cutter.messages.rollCreated', [roll.barcode]);
          void this.router.navigate(['/cutter']);
        },
        error: () => this.busy.set(false),
      });
  }

  protected back(): void {
    void this.router.navigate(['/cutter']);
  }
}
