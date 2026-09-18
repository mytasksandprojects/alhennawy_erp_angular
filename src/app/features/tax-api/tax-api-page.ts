import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { FormField } from '../../core/models/common.models';
import { TaxApiSettings } from '../../core/models/tax-api.models';
import { AccessService } from '../../core/security/access.service';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { UiBadge } from '../../shared/components/ui-badge';
import { UiEntityForm } from '../../shared/components/ui-entity-form';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { keysToOptions } from '../../shared/crud/options';
import { Translated } from '../../shared/translated.base';

type Draft = Record<string, string | number | boolean>;

const FIELDS: FormField[] = [
  { key: 'enabled', labelKey: 'taxApi.fields.enabled', type: 'checkbox' },
  { key: 'environment', labelKey: 'taxApi.fields.environment', type: 'select', required: true, options: keysToOptions('taxApi.env.', ['preprod', 'production']) },
  { key: 'apiUrl', labelKey: 'taxApi.fields.apiUrl', required: true },
  { key: 'clientId', labelKey: 'taxApi.fields.clientId', required: true },
  { key: 'clientSecret', labelKey: 'taxApi.fields.clientSecret', required: true },
  { key: 'registrationNumber', labelKey: 'taxApi.fields.registrationNumber', required: true },
  { key: 'branchCode', labelKey: 'taxApi.fields.branchCode' },
  { key: 'activityCode', labelKey: 'taxApi.fields.activityCode' },
  { key: 'posSerial', labelKey: 'taxApi.fields.posSerial' },
  { key: 'issuerType', labelKey: 'taxApi.fields.issuerType', type: 'select', options: keysToOptions('taxApi.issuer.', ['business', 'person']) },
  { key: 'documentVersion', labelKey: 'taxApi.fields.documentVersion' },
];

/**
 * منظومة الفاتورة الإلكترونية — ETA API connection settings: environment,
 * OAuth credentials, company registration data and issuer details, plus
 * a simulated connection test until the real API lands.
 */
@Component({
  selector: 'app-tax-api-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiEntityForm, UiIcon, UiBadge],
  template: `
    <ui-page-header titleKey="taxApi.title" subtitleKey="taxApi.subtitle" />
    <section class="ui-card">
      <p class="ui-field__hint" style="margin-bottom: var(--space-md)">
        {{ t('taxApi.hint') }}
      </p>
      <div class="stack">
        <ui-entity-form [fields]="fields" moduleId="taxApi" tabId="settings" [(draft)]="draft" />
        <div class="row">
          @if (allow('update')) {
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="busy()" (click)="save()">
              {{ t('common.save') }}
            </button>
          }
          <button type="button" class="ui-btn ui-btn--ghost" [disabled]="testing()" (click)="test()">
            <ui-icon name="check" [size]="16" />
            {{ t('taxApi.test') }}
          </button>
          @if (settings()?.lastTestAt) {
            <ui-badge
              [labelKey]="settings()!.lastTestOk ? 'taxApi.status.connected' : 'taxApi.status.notTested'"
              [tone]="settings()!.lastTestOk ? 'success' : 'danger'"
            />
            <span class="ui-field__hint">{{ fmtDate(settings()!.lastTestAt!) }} {{ fmtTime(settings()!.lastTestAt!) }}</span>
          }
        </div>
      </div>
    </section>
  `,
})
export class TaxApiPage extends Translated implements OnInit {
  private readonly api = inject(ApiClientService);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);
  private readonly access = inject(AccessService);

  protected readonly fields = FIELDS;
  protected readonly draft = signal<Draft>({});
  protected readonly settings = signal<TaxApiSettings | null>(null);
  protected readonly busy = signal(false);
  protected readonly testing = signal(false);

  ngOnInit(): void {
    this.api.get<TaxApiSettings>(API_ENDPOINTS.taxApi.settings).subscribe((row) => {
      this.settings.set(row);
      const next: Draft = {};
      for (const field of FIELDS) {
        next[field.key] = (row as unknown as Draft)[field.key] ?? '';
      }
      this.draft.set(next);
    });
  }

  protected allow(action: string): boolean {
    return this.access.canAction('taxApi', 'settings', action);
  }

  protected async save(): Promise<void> {
    if (!(await this.confirm.askSave())) return;
    this.busy.set(true);
    this.api.put<TaxApiSettings>(API_ENDPOINTS.taxApi.settings, this.draft()).subscribe({
      next: (saved) => {
        this.settings.set(saved);
        this.notifications.success('taxApi.msg.saved');
        this.busy.set(false);
      },
      error: () => this.busy.set(false),
    });
  }

  protected test(): void {
    this.testing.set(true);
    this.api
      .post<{ ok: boolean; checkedAt: string; message: string }>(API_ENDPOINTS.taxApi.test, {})
      .subscribe({
        next: (res) => {
          this.settings.update((s) =>
            s ? { ...s, lastTestOk: res.ok, lastTestAt: res.checkedAt } : s,
          );
          if (res.ok) this.notifications.success('taxApi.msg.testOk', [this.envLabel()]);
          else this.notifications.error('taxApi.msg.testFailed');
          this.testing.set(false);
        },
        error: () => this.testing.set(false),
      });
  }

  private envLabel(): string {
    return this.t(`taxApi.env.${this.settings()?.environment ?? 'preprod'}`);
  }
}
