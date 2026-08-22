import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { AttendancePolicy } from '../../core/models/access.models';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { CrudPanel } from '../../shared/components/crud-panel';
import { UiSwitch } from '../../shared/components/ui-switch';
import { Translated } from '../../shared/translated.base';
import { LOCATION_COLUMNS, LOCATION_FIELDS } from './attendance-config.columns';

@Component({
  selector: 'app-attendance-config',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CrudPanel, UiSwitch],
  template: `
    <section class="ui-card backup-card">
      <h2 class="ui-card__title">{{ t('hr.tabs.attendanceConfig') }}</h2>
      <p class="ui-field__hint token-toolbar__hint">{{ t('hr.attendanceConfig.hint') }}</p>
      <div class="row backup-form">
        <label class="row backup-card__switch">
          <ui-switch [checked]="policy().wifiOnly" (toggled)="patch('wifiOnly', $event)" />
          <span>{{ t('hr.fields.wifiOnly') }}</span>
        </label>
        <label class="row backup-card__switch">
          <ui-switch
            [checked]="policy().locationRequired"
            (toggled)="patch('locationRequired', $event)"
          />
          <span>{{ t('hr.fields.locationRequired') }}</span>
        </label>
        <button type="button" class="ui-btn ui-btn--primary backup-form__save" (click)="save()">
          {{ t('common.save') }}
        </button>
      </div>
    </section>
    <crud-panel
      moduleId="hr"
      tabId="attendanceConfig"
      [endpoint]="locations"
      [columns]="columns"
      [fields]="fields"
    />
  `,
})
export class AttendanceConfig extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);
  protected readonly locations = API_ENDPOINTS.hr.attendanceLocations;
  protected readonly columns = LOCATION_COLUMNS;
  protected readonly fields = LOCATION_FIELDS;
  protected readonly policy = signal<AttendancePolicy>({
    wifiOnly: false,
    locationRequired: false,
    demoSsid: '',
    demoLatitude: 0,
    demoLongitude: 0,
  });

  constructor() {
    super();
    this.api
      .get<AttendancePolicy>(API_ENDPOINTS.hr.attendancePolicy)
      .subscribe((row) => this.policy.set(row));
  }

  protected patch(key: keyof AttendancePolicy, value: boolean): void {
    this.policy.update((current) => ({ ...current, [key]: value }));
  }

  protected async save(): Promise<void> {
    if (!(await this.confirm.askSave())) return;
    this.api
      .put<AttendancePolicy>(API_ENDPOINTS.hr.attendancePolicy, this.policy())
      .subscribe(() => this.notifications.success('hr.attendanceConfig.saved'));
  }
}
