import { ChangeDetectionStrategy, Component, inject, input, output, WritableSignal } from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { Customer, ExportOrder } from '../../core/models/sales.models';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { Translated } from '../../shared/translated.base';
import { UiModal } from '../../shared/components/ui-modal';
import { UiSalesLines } from '../../shared/components/ui-sales-lines';

/** Create/edit export-order modal — customer + sales lines, saves via the API. */
@Component({
  selector: 'app-export-order-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiModal, UiSalesLines],
  template: `
    @if (open()()) {
      <ui-modal [titleKey]="editingId()() ? 'common.edit' : 'common.create'" (closed)="closeForm()">
        <div class="stack">
          <label class="ui-field">
            <span class="ui-field__label">{{ t('sales.fields.customer') }}</span>
            <select class="ui-control" [value]="newCustomer()()" (change)="newCustomer().set($any($event.target).value)">
              <option value="">{{ t('common.search') }}</option>
              @for (customer of customers(); track customer.code) {
                <option [value]="customer.code">{{ customer.code }} · {{ customer.name }}</option>
              }
            </select>
          </label>
          <ui-sales-lines [value]="newLines()()" unitKey="units.kg" (valueChange)="newLines().set($event)" />
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" (click)="saveOrder()">{{ t('common.save') }}</button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="closeForm()">{{ t('common.cancel') }}</button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class ExportOrderForm extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly confirm = inject(ConfirmService);
  private readonly notify = inject(NotificationService);

  readonly open = input.required<WritableSignal<boolean>>();
  readonly editingId = input.required<WritableSignal<string>>();
  readonly newCustomer = input.required<WritableSignal<string>>();
  readonly newLines = input.required<WritableSignal<string>>();
  readonly customers = input<Customer[]>([]);
  readonly saved = output<ExportOrder>();

  protected closeForm(): void {
    this.open().set(false);
    this.editingId().set('');
    this.newCustomer().set('');
    this.newLines().set('');
  }

  protected async saveOrder(): Promise<void> {
    if (!this.newCustomer()() || !this.newLines()() || this.newLines()() === '[]') return;
    if (!(await this.confirm.askSave())) return;
    const id = this.editingId()();
    const body = { customerCode: this.newCustomer()(), linesJson: this.newLines()() };
    const req = id
      ? this.api.put<ExportOrder>(`${API_ENDPOINTS.sales.exportOrders}/${id}`, body)
      : this.api.post<ExportOrder>(API_ENDPOINTS.sales.exportOrders, body);
    req.subscribe((row) => {
      this.notify.success(id ? 'common.updated' : 'common.created');
      this.closeForm();
      this.saved.emit(row);
    });
  }
}
