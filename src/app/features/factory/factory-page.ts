import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { FactoryProfilePayload } from '../../core/models/config.models';
import { FormField, multilangKey } from '../../core/models/common.models';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { UiEntityForm } from '../../shared/components/ui-entity-form';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { Translated } from '../../shared/translated.base';

type Draft = Record<string, string | number | boolean>;

const FIELDS: FormField[] = [
  { key: 'name', labelKey: 'factory.fields.name', required: true, multilang: true },
  { key: 'address', labelKey: 'factory.fields.address', type: 'textarea', required: true, multilang: true },
  { key: 'phone', labelKey: 'factory.fields.phone', required: true },
  { key: 'fax', labelKey: 'factory.fields.fax' },
  { key: 'logoUrl', labelKey: 'factory.fields.logo', type: 'images' },
  { key: 'iso', labelKey: 'factory.fields.iso' },
];

/**
 * إعدادات المصنع — letterhead used on statements, labels and prints:
 * name, address, phones, logo and ISO numbers, per language.
 */
@Component({
  selector: 'app-factory-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiEntityForm],
  template: `
    <ui-page-header titleKey="factory.title" subtitleKey="factory.subtitle" />
    <section class="ui-card">
      <p class="ui-field__hint" style="margin-bottom: var(--space-md)">
        {{ t('factory.hint') }}
      </p>
      <div class="stack">
        <ui-entity-form [fields]="fields" moduleId="factory" tabId="profile" [(draft)]="draft" />
        <div class="row">
          <button
            type="button"
            class="ui-btn ui-btn--primary"
            [disabled]="busy()"
            (click)="save()"
          >
            {{ t('common.save') }}
          </button>
        </div>
      </div>
    </section>
  `,
})
export class FactoryPage extends Translated implements OnInit {
  private readonly api = inject(ApiClientService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);

  protected readonly fields = FIELDS;
  protected readonly draft = signal<Draft>({});
  protected readonly busy = signal(false);

  ngOnInit(): void {
    this.api
      .get<FactoryProfilePayload>(API_ENDPOINTS.factory.profile)
      .subscribe((profile) => this.draft.set(this.toDraft(profile)));
  }

  protected async save(): Promise<void> {
    if (!(await this.confirm.askSave())) return;
    this.busy.set(true);
    const payload = this.toPayload();
    this.api
      .put<FactoryProfilePayload>(API_ENDPOINTS.factory.profile, payload)
      .subscribe({
        next: (saved) => {
          this.apply(saved);
          this.notifications.success('factory.saved');
          this.busy.set(false);
        },
        error: () => this.busy.set(false),
      });
  }

  private apply(saved: FactoryProfilePayload): void {
    const settings = this.store.settings();
    if (settings) {
      this.store.setSettings({
        ...settings,
        company: {
          ...settings.company,
          phone: saved.phone,
          fax: saved.fax,
          logoUrl: saved.logoUrl,
          sidebarLogoUrl: saved.sidebarLogoUrl,
          isoCertifications: saved.isoCertifications,
        },
      });
    }
    const lang = this.store.language();
    this.store.patchTranslations({
      [settings?.company.nameKey ?? 'company.name']: saved.names[lang] ?? '',
      [settings?.company.addressKey ?? 'company.address']: saved.addresses[lang] ?? '',
    });
  }

  private toDraft(profile: FactoryProfilePayload): Draft {
    const defaultLang = this.store.settings()?.defaultLanguage ?? 'ar';
    const next: Draft = {
      phone: profile.phone,
      fax: profile.fax,
      logoUrl: profile.logoUrl,
      iso: profile.isoCertifications.join(', '),
    };
    for (const lang of this.store.settings()?.languages ?? []) {
      next[multilangKey('name', lang.code, defaultLang)] = profile.names[lang.code] ?? '';
      next[multilangKey('address', lang.code, defaultLang)] =
        profile.addresses[lang.code] ?? '';
    }
    return next;
  }

  private toPayload(): FactoryProfilePayload {
    const settings = this.store.settings();
    const defaultLang = settings?.defaultLanguage ?? 'ar';
    const names: Record<string, string> = {};
    const addresses: Record<string, string> = {};
    for (const lang of settings?.languages ?? []) {
      names[lang.code] = String(
        this.draft()[multilangKey('name', lang.code, defaultLang)] ?? '',
      );
      addresses[lang.code] = String(
        this.draft()[multilangKey('address', lang.code, defaultLang)] ?? '',
      );
    }
    const iso = String(this.draft()['iso'] ?? '')
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
    return {
      phone: String(this.draft()['phone'] ?? ''),
      fax: String(this.draft()['fax'] ?? ''),
      logoUrl: String(this.draft()['logoUrl'] ?? ''),
      sidebarLogoUrl: settings?.company.sidebarLogoUrl ?? '',
      isoCertifications: iso,
      names,
      addresses,
    };
  }
}
