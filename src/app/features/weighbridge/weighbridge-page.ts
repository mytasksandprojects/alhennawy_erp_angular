import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WeighingTicket } from '../../core/models/weighbridge.models';
import { NotificationService } from '../../core/services/notification.service';
import { ModuleDashboard } from '../../shared/components/module-dashboard';
import { UiEntityForm } from '../../shared/components/ui-entity-form';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiModal } from '../../shared/components/ui-modal';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiTable } from '../../shared/components/ui-table';
import { Translated } from '../../shared/translated.base';
import { WeighbridgeApiService } from './weighbridge-api.service';
import { WEIGHING_COLUMNS, WEIGHING_FIELDS } from './weighbridge.columns';
import { WeighingCompleteModal } from './weighing-complete-modal';

type Draft = Record<string, string | number | boolean>;

const TYPE_FILTERS = ['purchase', 'sales', 'purchase-return', 'sales-return', 'internal-transfer'];

/** الميزان — dashboard + serial-numbered tickets with two-weighing flow. */
@Component({
  selector: 'app-weighbridge-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    ModuleDashboard,
    UiPageHeader,
    UiTable,
    UiIcon,
    UiModal,
    UiEntityForm,
    WeighingCompleteModal,
  ],
  template: `
    <ui-page-header
      titleKey="weighbridge.title"
      subtitleKey="weighbridge.subtitle"
    >
      <a class="ui-btn ui-btn--primary" routerLink="new">
        <ui-icon name="plus" [size]="16" />
        {{ t('weighbridge.newWeighing') }}
      </a>
    </ui-page-header>

    <module-dashboard moduleId="weighbridge" />

    <section class="ui-card" style="margin-top: var(--space-lg)">
      <div class="row row--between" style="margin-bottom: var(--space-md)">
        <h2 class="ui-card__title" style="margin-bottom: 0">
          {{ t('weighbridge.ticketsTitle') }}
        </h2>
        <div class="row">
          <select
            class="ui-control"
            [ngModel]="typeFilter()"
            (ngModelChange)="setTypeFilter($event)"
          >
            <option value="">{{ t('common.all') }}</option>
            @for (type of typeOptions; track type) {
              <option [value]="type">{{ t('weighbridge.types.' + type) }}</option>
            }
          </select>
          <select
            class="ui-control"
            [ngModel]="statusFilter()"
            (ngModelChange)="setStatusFilter($event)"
          >
            <option value="">{{ t('common.all') }}</option>
            <option value="first-done">{{ t('weighbridge.status.first-done') }}</option>
            <option value="completed">{{ t('weighbridge.status.completed') }}</option>
          </select>
        </div>
      </div>
      <ui-table
        [columns]="columns"
        [rows]="$any(tickets())"
        [clickable]="true"
        (rowClick)="openTicket($any($event))"
      />
      <p class="ui-field__hint" style="margin-top: var(--space-sm)">
        {{ t('weighbridge.serialRule') }}
      </p>
      <p class="ui-field__hint">{{ t('common.crudHint') }}</p>
    </section>

    @if (selected(); as ticket) {
      <app-weighing-complete-modal
        [ticket]="ticket"
        (closed)="selected.set(null)"
        (completed)="onCompleted()"
      />
    }

    @if (editing(); as ticket) {
      <ui-modal titleKey="common.edit" (closed)="editing.set(null)">
        <div class="stack">
          <ui-entity-form [fields]="ticketFields" [(draft)]="draft" />

          <p class="ui-field__hint">
            {{
              ticket.direction === 'inbound'
                ? t('weighbridge.flow.inboundHint')
                : t('weighbridge.flow.outboundHint')
            }}
          </p>
          @if (editNet() !== null) {
            <div class="row row--between">
              <span class="text-soft">{{ t('weighbridge.fields.netWeight') }}</span>
              <strong
                class="mono"
                [style.color]="
                  editNet()! <= 0 ? 'var(--color-danger)' : 'var(--color-success)'
                "
              >
                {{ fmtNum(editNet()) }} {{ t('units.kg') }}
              </strong>
            </div>
          }

          <div class="row">
            <button
              type="button"
              class="ui-btn ui-btn--primary"
              [disabled]="busy() || (editNet() !== null && editNet()! <= 0)"
              (click)="saveEdit()"
            >
              {{ t('common.save') }}
            </button>
            <button type="button" class="ui-btn ui-btn--danger" [disabled]="busy()" (click)="removeEdit()">
              {{ t('common.delete') }}
            </button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="editing.set(null)">
              {{ t('common.cancel') }}
            </button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class WeighbridgePage extends Translated implements OnInit {
  private readonly weighbridgeApi = inject(WeighbridgeApiService);
  private readonly notifications = inject(NotificationService);

  protected readonly columns = WEIGHING_COLUMNS;
  protected readonly ticketFields = WEIGHING_FIELDS;
  protected readonly typeOptions = TYPE_FILTERS;
  protected readonly tickets = signal<WeighingTicket[]>([]);
  protected readonly typeFilter = signal('');
  protected readonly statusFilter = signal('');
  protected readonly selected = signal<WeighingTicket | null>(null);
  protected readonly editing = signal<WeighingTicket | null>(null);
  protected readonly draft = signal<Draft>({});
  protected readonly busy = signal(false);

  /**
   * Live net weight while editing, honoring the goods direction:
   * inbound arrives loaded (net = 1st − 2nd), outbound leaves loaded
   * (net = 2nd − 1st).
   */
  protected readonly editNet = computed<number | null>(() => {
    const ticket = this.editing();
    if (!ticket) return null;
    const first = Number(this.draft()['firstWeightKg']);
    const second = Number(this.draft()['secondWeightKg']);
    if (!first || !second) return null;
    return ticket.direction === 'inbound' ? first - second : second - first;
  });

  ngOnInit(): void {
    this.reload();
  }

  protected setTypeFilter(value: string): void {
    this.typeFilter.set(value);
    this.reload();
  }

  protected setStatusFilter(value: string): void {
    this.statusFilter.set(value);
    this.reload();
  }

  protected openTicket(ticket: WeighingTicket): void {
    if (ticket.status === 'first-done') {
      this.selected.set(ticket);
      return;
    }
    const next: Draft = {};
    for (const field of WEIGHING_FIELDS) {
      next[field.key] = (ticket as unknown as Draft)[field.key] ?? '';
    }
    this.draft.set(next);
    this.editing.set(ticket);
  }

  protected onCompleted(): void {
    this.selected.set(null);
    this.reload();
  }

  protected saveEdit(): void {
    const ticket = this.editing();
    if (!ticket) return;
    this.busy.set(true);
    // Edited weights change the net — recompute it before saving.
    const payload: Draft = { ...this.draft() };
    const net = this.editNet();
    if (net !== null) payload['netWeightKg'] = net;
    this.weighbridgeApi.update(ticket.id, payload).subscribe({
      next: () => {
        this.notifications.success('common.updated');
        this.busy.set(false);
        this.editing.set(null);
        this.reload();
      },
      error: () => this.busy.set(false),
    });
  }

  protected removeEdit(): void {
    const ticket = this.editing();
    if (!ticket) return;
    this.busy.set(true);
    this.weighbridgeApi.remove(ticket.id).subscribe({
      next: () => {
        this.notifications.success('common.deleted');
        this.busy.set(false);
        this.editing.set(null);
        this.reload();
      },
      error: () => this.busy.set(false),
    });
  }

  private reload(): void {
    this.weighbridgeApi
      .list({
        type: this.typeFilter() || undefined,
        status: this.statusFilter() || undefined,
      })
      .subscribe((tickets) => this.tickets.set(tickets));
  }
}
