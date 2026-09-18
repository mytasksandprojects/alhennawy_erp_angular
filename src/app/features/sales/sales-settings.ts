import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { SalesSettings } from '../../core/models/sales.models';
import { AccessService } from '../../core/security/access.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { LookupService } from '../../core/services/lookup.service';
import { NotificationService } from '../../core/services/notification.service';
import { Translated } from '../../shared/translated.base';

/**
 * إعدادات المبيعات — pick the warehouses whose items appear in order
 * dropdowns, plus the proforma texts (terms, bank info, payment options)
 * and the proforma validity window.
 */
@Component({
  selector: 'app-sales-settings-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="ui-card stack">
      <h2 class="ui-card__title">{{ t('sales.tabs.settings') }}</h2>
      <p class="ui-field__hint">{{ t('sales.settings.hint') }}</p>

      <div class="ui-field ui-field--wide">
        <span class="ui-field__label">{{ t('sales.settings.warehouses') }}</span>
        <p class="ui-field__hint">{{ t('sales.settings.warehousesHint') }}</p>
        <div class="row">
          @for (option of warehouses(); track option.value) {
            <label class="row">
              <input
                type="checkbox"
                [checked]="warehouseSet().has(option.value)"
                (change)="toggleWarehouse(option.value)"
              />
              {{ option.label ?? option.value }}
            </label>
          }
        </div>
      </div>

      <label class="ui-field ui-field--wide">
        <span class="ui-field__label">{{ t('sales.settings.terms') }}</span>
        <textarea
          class="ui-control"
          rows="4"
          [value]="terms()"
          (input)="terms.set($any($event.target).value)"
        ></textarea>
      </label>

      <label class="ui-field ui-field--wide">
        <span class="ui-field__label">{{ t('sales.settings.bankInfo') }}</span>
        <textarea
          class="ui-control"
          rows="3"
          [value]="bankInfo()"
          (input)="bankInfo.set($any($event.target).value)"
        ></textarea>
      </label>

      <label class="ui-field ui-field--wide">
        <span class="ui-field__label">{{ t('sales.settings.paymentOptions') }}</span>
        <textarea
          class="ui-control"
          rows="3"
          [value]="paymentOptions()"
          (input)="paymentOptions.set($any($event.target).value)"
        ></textarea>
      </label>

      <label class="ui-field">
        <span class="ui-field__label">{{ t('sales.settings.proformaExpiry') }}</span>
        <input
          class="ui-control"
          type="number"
          [value]="expiry()"
          (input)="expiry.set(toNumber($event))"
        />
      </label>

      @if (access.canAction('sales', 'settings', 'update')) {
        <div class="row">
          <button type="button" class="ui-btn ui-btn--primary" (click)="save()">
            {{ t('common.save') }}
          </button>
        </div>
      }
    </section>
  `,
})
export class SalesSettingsPanel extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly lookups = inject(LookupService);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotificationService);
  protected readonly access = inject(AccessService);

  protected readonly warehouses = computed(() => this.lookups.options('warehouses'));
  protected readonly warehouseSet = signal<Set<string>>(new Set());
  protected readonly terms = signal('');
  protected readonly bankInfo = signal('');
  protected readonly paymentOptions = signal('');
  protected readonly expiry = signal(0);

  constructor() {
    super();
    this.lookups.refresh();
    this.api.get<SalesSettings>(API_ENDPOINTS.sales.settings).subscribe((row) => {
      this.warehouseSet.set(
        new Set((row.warehouseIds || '').split(',').map((id) => id.trim()).filter(Boolean)),
      );
      this.terms.set(row.termsConditions || '');
      this.bankInfo.set(row.bankInfo || '');
      this.paymentOptions.set(row.paymentOptions || '');
      this.expiry.set(Number(row.proformaExpiryDays) || 0);
    });
  }

  protected toggleWarehouse(id: string): void {
    this.warehouseSet.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected toNumber(event: Event): number {
    const parsed = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  protected async save(): Promise<void> {
    if (!(await this.confirm.askSave())) return;
    this.api
      .put<SalesSettings>(API_ENDPOINTS.sales.settings, {
        warehouseIds: [...this.warehouseSet()].join(','),
        termsConditions: this.terms(),
        bankInfo: this.bankInfo(),
        paymentOptions: this.paymentOptions(),
        proformaExpiryDays: this.expiry(),
      })
      .subscribe(() => {
        this.notify.success('common.updated');
        // Item dropdowns read the lookup store — refresh so the new
        // warehouse selection applies immediately.
        this.lookups.refresh();
      });
  }
}
