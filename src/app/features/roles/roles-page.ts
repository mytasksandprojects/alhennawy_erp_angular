import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ApiClientService } from '../../core/api/api-client.service';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import { RuntimeConfigStore } from '../../core/config/runtime-config.store';
import {
  ACCESS_ACTIONS,
  AppRole,
  actPerm,
  colPerm,
  tabPerm,
  viewPerm,
} from '../../core/models/access.models';
import { AuthService } from '../../core/security/auth.service';
import { AccessService } from '../../core/security/access.service';
import { expandCatalogLanguages } from '../../core/security/lang-columns';
import { PERMISSION_CATALOG } from '../../core/security/permission-catalog';
import { ConfirmService } from '../../core/services/confirm.service';
import { NotificationService } from '../../core/services/notification.service';
import { exportRowsToCsv } from '../../shared/crud/export-csv';
import { printWide } from '../../shared/crud/print-page';
import { UiIcon } from '../../shared/components/ui-icon';
import { UiPageHeader } from '../../shared/components/ui-page-header';
import { Translated } from '../../shared/translated.base';
import { RoleCreate } from './roles-create';
import { RolePerms } from './roles-perms';
import { RolePrint } from './roles-print';
import {
  ROLE_MATRIX_COLUMNS,
  RoleMatrixRow,
  buildRoleMatrix,
  groupRoleMatrix,
  nextDraft,
  withGrantFlag,
} from './roles-matrix';

@Component({
  selector: 'app-roles-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [UiPageHeader, UiIcon, RoleCreate, RolePerms, RolePrint],
  template: `
    <ui-page-header titleKey="roles.title" subtitleKey="roles.subtitle" />
    <div class="row token-toolbar">
      <select class="ui-control" [value]="roleId()" (change)="select($any($event.target).value)">
        @for (role of roles(); track role.id) {
          <option [value]="role.id">{{ roleLabel(role) }}</option>
        }
      </select>
      <select class="ui-control" [value]="moduleId()" (change)="moduleId.set($any($event.target).value)">
        <option value="">{{ t('common.all') }}</option>
        @for (module of catalog(); track module.id) {
          <option [value]="module.id">{{ t(module.labelKey) }}</option>
        }
      </select>
      <input
        class="ui-control crud-search"
        type="search"
        [placeholder]="t('common.search')"
        [value]="search()"
        (input)="search.set($any($event.target).value)"
      />
      <label class="row crud-filter">
        <input type="checkbox" [checked]="star()" (change)="toggleStar($any($event.target).checked)" />
        <span>{{ t('roles.fullAccess') }}</span>
      </label>
      <div class="row token-toolbar__actions">
        @if (allow('print')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="print()">
            <ui-icon name="print" [size]="16" [brand]="true" />
            {{ t('common.print') }}
          </button>
        }
        @if (allow('pdf')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="exportPdf()">
            <ui-icon name="pdf" [size]="16" />
            {{ t('common.exportPdf') }}
          </button>
        }
        @if (allow('excel')) {
          <button type="button" class="ui-btn ui-btn--ghost" (click)="exportExcel()">
            <ui-icon name="xls" [size]="16" />
            {{ t('common.exportExcel') }}
          </button>
        }
        @if (allow('create')) {
          <app-role-create (created)="added($event)" />
        }
        <button type="button" class="ui-btn ui-btn--primary" (click)="save()">{{ t('common.save') }}</button>
      </div>
    </div>
    <div class="print-area print-sheet">
      <header class="print-sheet__head print-only">
        <img class="print-sheet__logo" [src]="logoUrl()" [alt]="t(nameKey())" />
        <h1 class="print-sheet__title">{{ t(nameKey()) }}</h1>
        <p class="print-sheet__doc">{{ t('roles.title') }} · {{ currentLabel() }}</p>
      </header>
      <div class="role-editor">
      @for (group of grouped(); track group.moduleId) {
        <details class="role-mod">
          <summary class="role-mod__head">
            <input
              type="checkbox"
              [checked]="isOn(group.modulePerm.perm)"
              (click)="$event.stopPropagation()"
              (change)="flip(group.modulePerm, $any($event.target).checked)"
            />
            <strong>{{ t(group.moduleKey) }}</strong>
            <span class="text-faint">{{ t('roles.kind.module') }}</span>
          </summary>
          @for (screen of group.screens; track screen.tabId) {
            @if (group.flat) {
              <app-role-perms
                [screen]="screen"
                [granted]="draft()"
                [starred]="star()"
                (flipped)="flip($event.row, $event.on)"
              />
            } @else {
              <details class="role-screen">
                <summary class="role-screen__head">
                  @if (screen.screenPerm; as openScreen) {
                    <input
                      type="checkbox"
                      [checked]="isOn(openScreen.perm)"
                      (click)="$event.stopPropagation()"
                      (change)="flip(openScreen, $any($event.target).checked)"
                    />
                  }
                  <strong>{{ t(screen.screenKey) }}</strong>
                  <span class="text-faint">{{ t('roles.kind.screen') }}</span>
                </summary>
                <app-role-perms
                  [screen]="screen"
                  [granted]="draft()"
                  [starred]="star()"
                  (flipped)="flip($event.row, $event.on)"
                />
              </details>
            }
          }
        </details>
      }
      </div>
      <div class="print-only">
        <app-role-print [rows]="printRows()" />
      </div>
    </div>
  `,
})
export class RolesPage extends Translated {
  private readonly api = inject(ApiClientService);
  private readonly auth = inject(AuthService);
  private readonly access = inject(AccessService);
  private readonly store = inject(RuntimeConfigStore);
  private readonly confirm = inject(ConfirmService);
  private readonly notifications = inject(NotificationService);
  protected readonly catalog = computed(() =>
    expandCatalogLanguages(
      PERMISSION_CATALOG,
      this.store.settings()?.languages ?? [],
      this.store.settings()?.defaultLanguage ?? 'ar',
    ),
  );
  protected readonly columns = ROLE_MATRIX_COLUMNS;
  protected readonly matrix = computed(() => buildRoleMatrix(this.catalog()));
  protected readonly roles = signal<AppRole[]>([]);
  protected readonly roleId = signal('admin');
  protected readonly draft = signal<string[]>([]);
  protected readonly search = signal('');
  protected readonly moduleId = signal('');
  protected readonly star = computed(() => this.draft().includes('*'));
  protected readonly currentLabel = computed(() => {
    const role = this.roles().find((item) => item.id === this.roleId());
    return role ? this.roleLabel(role) : '';
  });
  protected readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const moduleId = this.moduleId();
    return this.matrix().filter((row) => {
      if (moduleId && row.moduleId !== moduleId) return false;
      if (!term) return true;
      const hay = [this.t(row.module), this.t(row.screen), this.t(row.kind), this.t(row.item), this.t(row.langKey ?? '')]
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  });
  protected readonly grouped = computed(() => groupRoleMatrix(this.filtered()));
  protected readonly printRows = computed(() => withGrantFlag(this.filtered(), this.isOn));
  protected readonly logoUrl = () => this.store.settings()?.company.logoUrl ?? '';
  protected readonly nameKey = () => this.store.settings()?.company.nameKey ?? 'company.name';

  constructor() {
    super();
    this.api.get<AppRole[]>(API_ENDPOINTS.roles).subscribe((rows) => {
      this.roles.set(rows);
      this.select(this.roleId());
    });
  }

  protected roleLabel(role: AppRole): string {
    return role.nameKey ? this.t(role.nameKey) : role.name || role.id;
  }

  protected readonly isOn = (perm: string): boolean => this.star() || this.draft().includes(perm);

  protected allow(action: string): boolean {
    return this.access.canAction('roles', 'matrix', action);
  }

  protected select(id: string): void {
    this.roleId.set(id);
    const role = this.roles().find((item) => item.id === id);
    this.draft.set([...(role?.permissions ?? [])]);
  }

  protected toggleStar(on: boolean): void {
    this.draft.set(on ? ['*'] : []);
  }

  protected flip(row: RoleMatrixRow, on: boolean): void {
    if (row.kind === 'roles.kind.module') {
      this.toggleModule(row.moduleId, on);
      return;
    }
    if (row.kind === 'roles.kind.screen') {
      this.toggleScreen(row.moduleId, row.tabId, on);
      return;
    }
    const keys = on ? [viewPerm(row.moduleId), tabPerm(row.moduleId, row.tabId), row.perm] : [row.perm];
    this.applyKeys(keys, on);
  }

  protected print(): void {
    printWide();
  }

  protected exportPdf(): void {
    this.notifications.info('common.pdfHint');
    printWide();
  }

  protected exportExcel(): void {
    exportRowsToCsv(this.columns, this.printRows(), API_ENDPOINTS.roles, this.t, this.fmtNum);
  }

  protected added(role: AppRole): void {
    this.roles.update((list) => [...list, role]);
    this.select(role.id);
  }

  protected async save(): Promise<void> {
    const current = this.roles().find((item) => item.id === this.roleId());
    if (!current || !(await this.confirm.askSave())) return;
    const next = { ...current, permissions: this.draft() };
    this.api.put<AppRole>(`${API_ENDPOINTS.roles}/${current.id}`, next).subscribe((saved) => {
      this.roles.update((list) => list.map((item) => (item.id === saved.id ? saved : item)));
      if (this.auth.user()?.roleId === saved.id) this.auth.applyPermissions(saved.permissions);
      this.notifications.success('roles.saved');
    });
  }

  private toggleModule(moduleId: string, on: boolean): void {
    const module = this.catalog().find((item) => item.id === moduleId);
    if (!module) return;
    const keys = [viewPerm(moduleId)];
    for (const tab of module.tabs) keys.push(...this.tabKeys(moduleId, tab.id, tab.columns.map((col) => col.key)));
    this.applyKeys(keys, on);
  }

  private toggleScreen(moduleId: string, tabId: string, on: boolean): void {
    const module = this.catalog().find((item) => item.id === moduleId);
    const tab = module?.tabs.find((item) => item.id === tabId);
    if (!tab) return;
    const keys = this.tabKeys(moduleId, tabId, tab.columns.map((col) => col.key));
    if (on) keys.unshift(viewPerm(moduleId));
    this.applyKeys(keys, on);
  }

  private tabKeys(moduleId: string, tabId: string, columns: string[]): string[] {
    const keys = [tabPerm(moduleId, tabId)];
    for (const action of ACCESS_ACTIONS) keys.push(actPerm(moduleId, tabId, action));
    for (const key of columns) keys.push(colPerm(moduleId, tabId, key));
    return keys;
  }

  private applyKeys(keys: string[], on: boolean): void {
    this.draft.set(nextDraft(this.draft(), keys, on, this.matrix().map((row) => row.perm)));
  }
}
