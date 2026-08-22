import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { ApiClientService } from '../../core/api/api-client.service';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import { SystemToggle } from '../../core/models/system.models';
import { NotificationService } from '../../core/services/notification.service';
import { routedTab, tabNavigator } from '../../shared/tab-route';
import { Translated } from '../../shared/translated.base';
import { CrudPanel } from '../../shared/components/crud-panel';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiSwitch } from '../../shared/components/ui-switch';
import { UiTabs, TabItem } from '../../shared/components/ui-tabs';
import {
  AUDIT_COLUMNS,
  AUDIT_FIELDS,
  LOOKUP_COLUMNS,
  lookupFields,
} from './system.columns';

/** System control center — audit CRUD + live integration switches. */
@Component({
  selector: 'app-system-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiSwitch, UiTabs, CrudPanel],
  template: `
    <ui-page-header titleKey="system.title" subtitleKey="system.subtitle" />

    <ui-tabs [tabs]="tabs" [active]="active()" (activeChange)="activate($event)" />

    @switch (active()) {
      @case ('switches') {
        <div class="toggle-list">
          @for (toggle of toggles(); track toggle.id) {
            <div class="ui-card toggle-item">
              <div class="toggle-item__text">
                <span class="toggle-item__label">{{ t(toggle.labelKey) }}</span>
                <span class="toggle-item__desc">{{ t(toggle.descriptionKey) }}</span>
                <span class="text-faint">
                  {{ t('system.fields.updatedAt') }}:
                  {{ fmtTime(toggle.updatedAt) }} — {{ toggle.updatedBy }}
                </span>
              </div>
              <span
                class="ui-badge"
                [class.ui-badge--success]="toggle.enabled"
                [class.ui-badge--neutral]="!toggle.enabled"
              >
                {{ t(toggle.enabled ? 'system.on' : 'system.off') }}
              </span>
              <ui-switch
                [checked]="toggle.enabled"
                [disabled]="saving()"
                (toggled)="setToggle(toggle, $event)"
              />
            </div>
          }
        </div>
      }
      @case ('lookups') {
        <p class="ui-field__hint" style="margin-bottom: var(--space-sm)">
          {{ t('system.lookupsHint') }}
        </p>
        <crud-panel
          moduleId="system"
          tabId="lookups"
          [endpoint]="lookupsUrl"
          [columns]="lookupColumns"
          [fields]="lookupFields()"
        />
      }
      @default {
        <crud-panel
          moduleId="system"
          tabId="audit"
          [endpoint]="auditUrl"
          [columns]="auditColumns"
          [fields]="auditFields"
        />
      }
    }
  `,
})
export class SystemPage extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly notifications = inject(NotificationService);
  private readonly store = inject(RuntimeConfigStore);

  protected readonly auditUrl = API_ENDPOINTS.system.auditLogs;
  protected readonly auditColumns = AUDIT_COLUMNS;
  protected readonly auditFields = AUDIT_FIELDS;
  protected readonly lookupsUrl = API_ENDPOINTS.system.lookups;
  protected readonly lookupColumns = LOOKUP_COLUMNS;
  /** Rebuilt whenever an admin registers a new language. */
  protected readonly lookupFields = computed(() =>
    lookupFields(this.store.settings()?.languages ?? []),
  );
  protected readonly tabs: TabItem[] = [
    { id: 'audit', labelKey: 'system.tabs.audit' },
    { id: 'lookups', labelKey: 'system.tabs.lookups' },
    { id: 'switches', labelKey: 'system.tabs.switches' },
  ];

  protected readonly active = routedTab('audit');
  private readonly navigateToTab = tabNavigator();
  protected readonly toggles = signal<SystemToggle[]>([]);
  protected readonly saving = signal(false);

  protected activate(tabId: string): void {
    this.active.set(tabId);
    this.navigateToTab(tabId);
  }

  constructor() {
    super();
    this.api
      .get<SystemToggle[]>(API_ENDPOINTS.system.toggles)
      .subscribe((rows) => this.toggles.set(rows));
  }

  protected setToggle(toggle: SystemToggle, enabled: boolean): void {
    this.saving.set(true);
    this.api
      .post<SystemToggle>(API_ENDPOINTS.system.toggle(toggle.id), { enabled })
      .subscribe({
        next: (updated) => {
          this.toggles.update((list) =>
            list.map((item) => (item.id === updated.id ? updated : item)),
          );
          this.notifications.success('system.messages.toggleSaved');
          this.saving.set(false);
        },
        error: () => this.saving.set(false),
      });
  }
}
