import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../core/services/notification.service';
import {
  WeighingDirection,
  WeighingType,
} from '../../core/models/weighbridge.models';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { Translated } from '../../shared/translated.base';
import { WeighbridgeApiService } from './weighbridge-api.service';

/**
 * الوزنة الأولى — creating a ticket.
 * Direction is derived from the type: incoming goods (purchase,
 * sales-return) weigh the LOADED truck first; outgoing goods (sales,
 * purchase-return, internal-transfer) weigh the EMPTY truck first.
 */
const DIRECTION_BY_TYPE: Record<WeighingType, WeighingDirection> = {
  'purchase': 'inbound',
  'sales-return': 'inbound',
  'sales': 'outbound',
  'purchase-return': 'outbound',
  'internal-transfer': 'outbound',
};

@Component({
  selector: 'app-weighing-create-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, UiPageHeader],
  template: `
    <ui-page-header
      titleKey="weighbridge.newWeighing"
      subtitleKey="weighbridge.firstWeighingSubtitle"
    />

    <form class="ui-card stack" (ngSubmit)="submit()">
      <div class="ui-form-grid">
        <label class="ui-field">
          <span class="ui-field__label">{{ t('common.type') }}</span>
          <select class="ui-control" name="type" [(ngModel)]="type">
            @for (option of typeOptions; track option) {
              <option [value]="option">{{ t('weighbridge.types.' + option) }}</option>
            }
          </select>
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('weighbridge.fields.vehiclePlate') }}</span>
          <input class="ui-control" name="plate" required [(ngModel)]="vehiclePlate" />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('weighbridge.fields.driverName') }}</span>
          <input class="ui-control" name="driver" required [(ngModel)]="driverName" />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('weighbridge.fields.party') }}</span>
          <input class="ui-control" name="party" required [(ngModel)]="partyCode" />
        </label>

        <label class="ui-field">
          <span class="ui-field__label">{{ t('weighbridge.fields.item') }}</span>
          <input class="ui-control" name="item" [(ngModel)]="itemCode" />
        </label>

        @if (type() === 'purchase') {
          <label class="ui-field">
            <span class="ui-field__label">{{ t('weighbridge.fields.uncodedItem') }}</span>
            <input class="ui-control" name="uncoded" [(ngModel)]="uncodedItemDescription" />
            <span class="ui-field__hint">{{ t('weighbridge.fields.uncodedHint') }}</span>
          </label>
        }

        @if (type() === 'internal-transfer') {
          <label class="ui-field">
            <span class="ui-field__label">{{ t('weighbridge.fields.subCode') }}</span>
            <input class="ui-control" name="subCode" [(ngModel)]="subCode" />
            <span class="ui-field__hint">{{ t('weighbridge.fields.subCodeHint') }}</span>
          </label>
          <label class="ui-field">
            <span class="ui-field__label">{{ t('weighbridge.fields.sourceWarehouse') }}</span>
            <input class="ui-control" name="source" [(ngModel)]="sourceWarehouseId" />
          </label>
          <label class="ui-field">
            <span class="ui-field__label">{{ t('weighbridge.fields.targetWarehouse') }}</span>
            <input class="ui-control" name="target" [(ngModel)]="targetWarehouseId" />
          </label>
        }

        <label class="ui-field">
          <span class="ui-field__label">
            {{
              direction() === 'inbound'
                ? t('weighbridge.fields.firstWeightLoaded')
                : t('weighbridge.fields.firstWeightEmpty')
            }}
          </span>
          <input
            class="ui-control"
            type="number"
            min="1"
            name="firstWeight"
            required
            [(ngModel)]="firstWeightKg"
          />
        </label>
      </div>

      <label class="ui-field">
        <span class="ui-field__label">{{ t('common.notes') }}</span>
        <textarea class="ui-control" name="notes" [(ngModel)]="notes"></textarea>
      </label>

      <p class="ui-field__hint">
        {{
          direction() === 'inbound'
            ? t('weighbridge.flow.inboundHint')
            : t('weighbridge.flow.outboundHint')
        }}
      </p>

      <div class="row">
        <button
          class="ui-btn ui-btn--primary"
          type="submit"
          [disabled]="busy() || !isValid()"
        >
          {{ t('weighbridge.actions.recordFirst') }}
        </button>
        <button type="button" class="ui-btn ui-btn--ghost" (click)="back()">
          {{ t('common.back') }}
        </button>
      </div>
    </form>
  `,
})
export class WeighingCreatePage extends Translated {
  private readonly weighbridgeApi = inject(WeighbridgeApiService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  protected readonly typeOptions: WeighingType[] = [
    'purchase',
    'sales',
    'purchase-return',
    'sales-return',
    'internal-transfer',
  ];

  protected readonly type = signal<WeighingType>('purchase');
  protected vehiclePlate = '';
  protected driverName = '';
  protected partyCode = '';
  protected itemCode = '';
  protected uncodedItemDescription = '';
  protected subCode = '';
  protected sourceWarehouseId = '';
  protected targetWarehouseId = '';
  protected firstWeightKg: number | null = null;
  protected notes = '';
  protected readonly busy = signal(false);

  protected readonly direction = computed<WeighingDirection>(
    () => DIRECTION_BY_TYPE[this.type()],
  );

  protected isValid(): boolean {
    return (
      this.vehiclePlate.trim().length > 0 &&
      this.driverName.trim().length > 0 &&
      this.partyCode.trim().length > 0 &&
      (this.firstWeightKg ?? 0) > 0
    );
  }

  protected submit(): void {
    if (!this.isValid() || this.busy()) return;
    this.busy.set(true);
    this.weighbridgeApi
      .create({
        type: this.type(),
        direction: this.direction(),
        vehiclePlate: this.vehiclePlate.trim(),
        driverName: this.driverName.trim(),
        partyCode: this.partyCode.trim(),
        itemCode: this.itemCode.trim(),
        uncodedItemDescription: this.uncodedItemDescription.trim() || undefined,
        subCode: this.subCode.trim() || undefined,
        sourceWarehouseId: this.sourceWarehouseId.trim() || undefined,
        targetWarehouseId: this.targetWarehouseId.trim() || undefined,
        firstWeightKg: this.firstWeightKg ?? 0,
        notes: this.notes.trim() || undefined,
      })
      .subscribe({
        next: (ticket) => {
          this.notifications.success('weighbridge.messages.firstRecorded', [
            ticket.serial,
          ]);
          void this.router.navigate(['/weighbridge']);
        },
        error: () => this.busy.set(false),
      });
  }

  protected back(): void {
    void this.router.navigate(['/weighbridge']);
  }
}
