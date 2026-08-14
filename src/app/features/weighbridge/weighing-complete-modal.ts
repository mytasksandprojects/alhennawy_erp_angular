import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { WeighingTicket } from '../../core/models/weighbridge.models';
import { UiModal } from '../../shared/components/ui-modal';
import { Translated } from '../../shared/translated.base';
import { WeighbridgeApiService } from './weighbridge-api.service';

/**
 * Second weighing (الوزنة الثانية).
 * Inbound (بضاعة واردة): first = loaded, second = empty → net = 1st − 2nd.
 * Outbound (بضاعة صادرة): first = empty, second = loaded → net = 2nd − 1st.
 */
@Component({
  selector: 'app-weighing-complete-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiModal],
  template: `
    <ui-modal titleKey="weighbridge.actions.recordSecond" (closed)="closed.emit()">
      @let tk = ticket();
      <div class="stack">
        <div class="row row--between">
          <span class="text-soft">{{ t('common.serial') }}</span>
          <strong class="mono">{{ tk.serial }}</strong>
        </div>
        <div class="row row--between">
          <span class="text-soft">{{ t('weighbridge.fields.vehiclePlate') }}</span>
          <strong>{{ tk.vehiclePlate }}</strong>
        </div>
        <div class="row row--between">
          <span class="text-soft">{{ t('weighbridge.fields.firstWeight') }}</span>
          <strong class="mono">{{ fmtNum(tk.firstWeightKg) }} {{ t('units.kg') }}</strong>
        </div>

        <p class="ui-field__hint">
          {{
            tk.direction === 'inbound'
              ? t('weighbridge.flow.inboundHint')
              : t('weighbridge.flow.outboundHint')
          }}
        </p>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('weighbridge.fields.secondWeight') }}</span>
          <input
            class="ui-control"
            type="number"
            min="1"
            [ngModel]="secondWeight()"
            (ngModelChange)="secondWeight.set($event)"
          />
        </label>

        @if (netPreview() !== null) {
          <div class="row row--between">
            <span class="text-soft">{{ t('weighbridge.fields.netWeight') }}</span>
            <strong
              class="mono"
              [class.text-faint]="false"
              [style.color]="netPreview()! <= 0 ? 'var(--color-danger)' : 'var(--color-success)'"
            >
              {{ fmtNum(netPreview()) }} {{ t('units.kg') }}
            </strong>
          </div>
        }

        <div class="row">
          <button
            type="button"
            class="ui-btn ui-btn--primary"
            [disabled]="busy() || !isValid()"
            (click)="submit()"
          >
            {{ t('weighbridge.actions.complete') }}
          </button>
          <button
            type="button"
            class="ui-btn ui-btn--danger"
            [disabled]="busy()"
            (click)="remove()"
          >
            {{ t('common.delete') }}
          </button>
          <button type="button" class="ui-btn ui-btn--ghost" (click)="closed.emit()">
            {{ t('common.cancel') }}
          </button>
        </div>
      </div>
    </ui-modal>
  `,
})
export class WeighingCompleteModal extends Translated {
  readonly ticket = input.required<WeighingTicket>();
  readonly closed = output<void>();
  readonly completed = output<void>();

  private readonly weighbridgeApi = inject(WeighbridgeApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly secondWeight = signal<number | null>(null);
  protected readonly busy = signal(false);

  protected readonly netPreview = computed<number | null>(() => {
    const second = this.secondWeight();
    if (second === null || second <= 0) return null;
    const tk = this.ticket();
    return tk.direction === 'inbound'
      ? tk.firstWeightKg - second
      : second - tk.firstWeightKg;
  });

  protected isValid(): boolean {
    const net = this.netPreview();
    return net !== null && net > 0;
  }

  protected submit(): void {
    const second = this.secondWeight();
    if (!this.isValid() || second === null) return;
    this.busy.set(true);
    this.weighbridgeApi
      .complete({ ticketId: this.ticket().id, secondWeightKg: second })
      .subscribe({
        next: () => {
          this.notifications.success('weighbridge.messages.completed');
          this.completed.emit();
        },
        error: () => this.busy.set(false),
      });
  }

  protected remove(): void {
    this.busy.set(true);
    this.weighbridgeApi.remove(this.ticket().id).subscribe({
      next: () => {
        this.notifications.success('common.deleted');
        this.completed.emit();
      },
      error: () => this.busy.set(false),
    });
  }
}
