import { ChangeDetectionStrategy, Component, inject, output, signal } from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { AppRole } from '../../core/models/access.models';
import { FormField } from '../../core/models/common.models';
import { NotificationService } from '../../core/services/notification.service';
import { emptyDraft } from '../../shared/crud/form-draft';
import { UiEntityForm } from '../../shared/components/ui-entity-form';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiModal } from '../../shared/components/ui-modal';
import { Translated } from '../../shared/translated.base';

const FIELDS: FormField[] = [
  { key: 'name', labelKey: 'common.name', required: true, multilang: true },
];

@Component({
  selector: 'app-role-create',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiIcon, UiModal, UiEntityForm],
  template: `
    <button type="button" class="ui-btn ui-btn--primary" (click)="open.set(true)">
      <ui-icon name="plus" [size]="16" />
      {{ t('common.create') }}
    </button>
    @if (open()) {
      <ui-modal titleKey="common.create" (closed)="open.set(false)">
        <div class="stack">
          <ui-entity-form [fields]="fields" [(draft)]="draft" />
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="busy()" (click)="save()">
              {{ t('common.save') }}
            </button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="open.set(false)">
              {{ t('common.cancel') }}
            </button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class RoleCreate extends Translated {
  readonly created = output<AppRole>();
  private readonly api = inject(ApiClientService);
  private readonly notifications = inject(NotificationService);
  protected readonly fields = FIELDS;
  protected readonly open = signal(false);
  protected readonly busy = signal(false);
  protected readonly draft = signal(emptyDraft(FIELDS));

  protected save(): void {
    const name = String(this.draft()['name'] ?? '').trim();
    if (!name) return;
    this.busy.set(true);
    this.api.post<AppRole>(API_ENDPOINTS.roles, { ...this.draft(), permissions: [] }).subscribe({
      next: (role) => {
        this.notifications.success('common.created');
        this.busy.set(false);
        this.open.set(false);
        this.draft.set(emptyDraft(FIELDS));
        this.created.emit(role);
      },
      error: () => this.busy.set(false),
    });
  }
}
