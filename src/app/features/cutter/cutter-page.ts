import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { CutterRoll } from '../../core/models/cutter.models';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { CrudPanel } from '../../shared/components/crud-panel';
import { UiEntityForm } from '../../shared/components/ui-entity-form';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiModal } from '../../shared/components/ui-modal';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { UiTable } from '../../shared/components/ui-table';
import { UiTabs, TabItem } from '../../shared/components/ui-tabs';
import { routedTab, tabNavigator } from '../../shared/tab-route';
import { Translated } from '../../shared/translated.base';
import { CutterApiService } from './cutter-api.service';
import { ROLL_COLUMNS, ROLL_FIELDS, SPEC_COLUMNS, SPEC_FIELDS } from './cutter.columns';
import { TechSheetPrint } from '../quality/tech-sheet-print';
import { RollLabel } from './roll-label';

type Draft = Record<string, string | number | boolean>;

/** المقص — rolls CRUD + printable labels, and customer-spec CRUD. */
@Component({
  selector: 'app-cutter-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    RouterLink,
    UiPageHeader,
    UiTable,
    UiIcon,
    UiModal,
    UiEntityForm,
    UiTabs,
    CrudPanel,
    RollLabel,
    TechSheetPrint,
  ],
  template: `
    <ui-page-header titleKey="cutter.title" subtitleKey="cutter.subtitle">
      <a class="ui-btn ui-btn--primary" routerLink="new">
        <ui-icon name="plus" [size]="16" />
        {{ t('cutter.newRoll') }}
      </a>
    </ui-page-header>

    <ui-tabs [tabs]="tabs" [active]="active()" (activeChange)="activate($event)" />

    @if (active() === 'specs') {
      <crud-panel
        [endpoint]="specsUrl"
        [columns]="specColumns"
        [fields]="specFields"
        idKey="specCode"
      />
    } @else {
      <section class="ui-card">
        <div class="row row--between" style="margin-bottom: var(--space-md)">
          <h2 class="ui-card__title" style="margin-bottom: 0">
            {{ t('cutter.rollsTitle') }}
          </h2>
          <select
            class="ui-control"
            style="max-width: 200px"
            [ngModel]="gradeFilter()"
            (ngModelChange)="setGradeFilter($event)"
          >
            <option value="">{{ t('common.all') }}</option>
            <option value="first">{{ t('cutter.grades.first') }}</option>
            <option value="second">{{ t('cutter.grades.second') }}</option>
          </select>
        </div>
        <ui-table
          [columns]="columns"
          [rows]="$any(rolls())"
          [clickable]="true"
          titleKey="cutter.tabs.rolls"
          (rowClick)="openRoll($any($event))"
        />
        <p class="ui-field__hint" style="margin-top: var(--space-sm)">
          {{ t('cutter.printRule') }}
        </p>
        <p class="ui-field__hint">{{ t('common.crudHint') }}</p>
      </section>
    }

    @if (selected(); as roll) {
      <ui-modal titleKey="cutter.printLabel" (closed)="selected.set(null)">
        <div class="stack" style="align-items: center">
          <div class="print-area">
            <app-roll-label [roll]="roll" />
            <app-tech-sheet-print [specCode]="roll.specCode" />
          </div>
          <ui-entity-form [fields]="rollFields" [(draft)]="draft" />
          <div class="row">
            <button type="button" class="ui-btn ui-btn--primary" (click)="print(roll)">
              <ui-icon name="print" [size]="16" />
              {{ t('common.print') }}
            </button>
            <button type="button" class="ui-btn ui-btn--primary" [disabled]="busy()" (click)="saveRoll()">
              {{ t('common.save') }}
            </button>
            <button type="button" class="ui-btn ui-btn--danger" [disabled]="busy()" (click)="removeRoll()">
              {{ t('common.delete') }}
            </button>
            <button type="button" class="ui-btn ui-btn--ghost" (click)="selected.set(null)">
              {{ t('common.close') }}
            </button>
          </div>
        </div>
      </ui-modal>
    }
  `,
})
export class CutterPage extends Translated implements OnInit {
  private readonly cutterApi = inject(CutterApiService);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);
  private readonly document = inject(DOCUMENT);

  protected readonly columns = ROLL_COLUMNS;
  protected readonly rollFields = ROLL_FIELDS;
  protected readonly specColumns = SPEC_COLUMNS;
  protected readonly specFields = SPEC_FIELDS;
  protected readonly specsUrl = API_ENDPOINTS.cutter.specs;
  protected readonly tabs: TabItem[] = [
    { id: 'rolls', labelKey: 'cutter.tabs.rolls' },
    { id: 'specs', labelKey: 'cutter.tabs.specs' },
  ];

  protected readonly active = routedTab('rolls');
  private readonly navigateToTab = tabNavigator();

  protected activate(tabId: string): void {
    this.active.set(tabId);
    this.navigateToTab(tabId);
  }
  protected readonly rolls = signal<CutterRoll[]>([]);
  protected readonly gradeFilter = signal('');
  protected readonly selected = signal<CutterRoll | null>(null);
  protected readonly draft = signal<Draft>({});
  protected readonly busy = signal(false);

  ngOnInit(): void {
    this.reload();
  }

  protected setGradeFilter(value: string): void {
    this.gradeFilter.set(value);
    this.reload();
  }

  protected openRoll(roll: CutterRoll): void {
    const next: Draft = {};
    for (const field of ROLL_FIELDS) {
      next[field.key] = (roll as unknown as Draft)[field.key] ?? '';
    }
    this.draft.set(next);
    this.selected.set(roll);
  }

  protected print(roll: CutterRoll): void {
    this.cutterApi.registerPrint(roll.id).subscribe(() => {
      this.document.defaultView?.print();
      this.reload();
    });
  }

  protected async saveRoll(): Promise<void> {
    const roll = this.selected();
    if (!roll || !(await this.confirm.askSave())) return;
    this.busy.set(true);
    this.cutterApi.updateRoll(roll.id, this.draft()).subscribe({
      next: () => {
        this.notifications.success('common.updated');
        this.busy.set(false);
        this.selected.set(null);
        this.reload();
      },
      error: () => this.busy.set(false),
    });
  }

  protected async removeRoll(): Promise<void> {
    const roll = this.selected();
    if (!roll || !(await this.confirm.askDelete())) return;
    this.busy.set(true);
    this.cutterApi.removeRoll(roll.id).subscribe({
      next: () => {
        this.notifications.success('common.deleted');
        this.busy.set(false);
        this.selected.set(null);
        this.reload();
      },
      error: () => this.busy.set(false),
    });
  }

  private reload(): void {
    this.cutterApi
      .listRolls(this.gradeFilter() || undefined)
      .subscribe((rolls) => this.rolls.set(rolls));
  }
}
