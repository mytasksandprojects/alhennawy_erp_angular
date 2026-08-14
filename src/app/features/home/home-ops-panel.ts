import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { ApiClientService } from '../../core/api/api-client.service';
import { AuditLogEntry, SystemToggle } from '../../core/models/system.models';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/security/auth.service';
import { Translated } from '../../shared/translated.base';
import { UiBadge } from '../../shared/components/ui-badge';
import { UiSwitch } from '../../shared/components/ui-switch';

/**
 * Home cards: latest audit events + live integration switches.
 * Projected into the dashboard's masonry grid, so the host box must not
 * exist (display: contents) for the cards to pack between the charts.
 */
@Component({
  selector: 'app-home-ops-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, UiBadge, UiSwitch],
  host: { style: 'display: contents' },
  template: `
    @if (canView()) {
      <section class="ui-card ui-card--list">
          <div class="row row--between ui-card__head">
            <h2 class="ui-card__title" style="margin-bottom: 0">
              {{ t('home.recentAudit') }}
            </h2>
            <a class="ui-btn ui-btn--ghost" routerLink="/system">
              {{ t('common.viewAll') }}
            </a>
          </div>
          <div class="feed-list">
            @for (log of logs(); track log.id) {
              <div class="feed-row">
                <div class="feed-row__text">
                  <span>{{ t(log.actionKey) }}</span>
                  <span class="text-faint">
                    {{ log.username }} · {{ t(log.moduleKey) }} · {{ log.reference }}
                  </span>
                </div>
                <ui-badge
                  [labelKey]="'system.results.' + log.result"
                  [tone]="log.result === 'success' ? 'success' : log.result === 'denied' ? 'warning' : 'danger'"
                />
              </div>
            }
          </div>
        </section>

        <section class="ui-card ui-card--list">
          <div class="row row--between ui-card__head">
            <h2 class="ui-card__title" style="margin-bottom: 0">
              {{ t('home.switchStatus') }}
            </h2>
            <a class="ui-btn ui-btn--ghost" routerLink="/system">
              {{ t('common.viewAll') }}
            </a>
          </div>
          <div class="toggle-list">
            @for (toggle of toggles(); track toggle.id) {
              <div class="toggle-item">
                <div class="toggle-item__text">
                  <span class="toggle-item__label">{{ t(toggle.labelKey) }}</span>
                  <span class="toggle-item__desc">{{ t(toggle.descriptionKey) }}</span>
                </div>
                <ui-switch
                  [checked]="toggle.enabled"
                  [disabled]="saving()"
                  (toggled)="setToggle(toggle, $event)"
                />
              </div>
            }
          </div>
        </section>
    }
  `,
})
export class HomeOpsPanel extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);

  protected readonly logs = signal<AuditLogEntry[]>([]);
  protected readonly toggles = signal<SystemToggle[]>([]);
  protected readonly saving = signal(false);

  protected canView(): boolean {
    return this.auth.hasPermission('system.view');
  }

  constructor() {
    super();
    if (!this.canView()) return;
    this.api
      .get<AuditLogEntry[]>(API_ENDPOINTS.system.auditLogs)
      // Home shows only the latest few — "View all" opens the full log.
      .subscribe((rows) => this.logs.set(rows.slice(0, 6)));
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
