import {
  ACCESS_ACTIONS,
  CatalogModule,
  actPerm,
  colPerm,
  tabPerm,
  viewPerm,
} from '../../core/models/access.models';
import { TableColumn } from '../../core/models/common.models';

export interface RoleMatrixRow {
  id: string;
  perm: string;
  moduleId: string;
  tabId: string;
  module: string;
  screen: string;
  kind: string;
  item: string;
  langKey?: string;
}

export interface RoleMatrixScreen {
  tabId: string;
  screenKey: string;
  screenPerm?: RoleMatrixRow;
  buttons: RoleMatrixRow[];
  columns: RoleMatrixRow[];
}

export interface RoleMatrixGroup {
  moduleId: string;
  moduleKey: string;
  modulePerm: RoleMatrixRow;
  screens: RoleMatrixScreen[];
  /** One screen — do not nest a second header with the same name. */
  flat: boolean;
}

export const ROLE_MATRIX_COLUMNS: TableColumn[] = [
  { key: 'module', labelKey: 'roles.fields.module', type: 'key' },
  { key: 'screen', labelKey: 'roles.fields.screen', type: 'key' },
  { key: 'kind', labelKey: 'roles.fields.kind', type: 'key' },
  { key: 'item', labelKey: 'roles.fields.item', type: 'key' },
  { key: 'allowed', labelKey: 'common.status', type: 'key' },
];

function row(
  perm: string,
  moduleId: string,
  tabId: string,
  module: string,
  screen: string,
  kind: string,
  item: string,
  langKey?: string,
): RoleMatrixRow {
  return { id: perm, perm, moduleId, tabId, module, screen, kind, item, langKey };
}

/** One row per module / screen / button / column the matrix can grant. */
export function buildRoleMatrix(catalog: CatalogModule[]): RoleMatrixRow[] {
  const rows: RoleMatrixRow[] = [];
  for (const module of catalog) {
    rows.push(row(viewPerm(module.id), module.id, '', module.labelKey, '', 'roles.kind.module', module.labelKey));
    for (const tab of module.tabs) {
      rows.push(
        row(
          tabPerm(module.id, tab.id),
          module.id,
          tab.id,
          module.labelKey,
          tab.labelKey,
          'roles.kind.screen',
          tab.labelKey,
        ),
      );
      for (const action of ACCESS_ACTIONS) {
        rows.push(
          row(
            actPerm(module.id, tab.id, action),
            module.id,
            tab.id,
            module.labelKey,
            tab.labelKey,
            'roles.kind.button',
            'access.act.' + action,
          ),
        );
      }
      for (const col of tab.columns) {
        rows.push(
          row(
            colPerm(module.id, tab.id, col.key),
            module.id,
            tab.id,
            module.labelKey,
            tab.labelKey,
            'roles.kind.column',
            col.labelKey,
            col.langKey,
          ),
        );
      }
    }
  }
  return rows;
}

/** Module → screen → buttons / columns. Preserves catalog order. */
export function groupRoleMatrix(rows: RoleMatrixRow[]): RoleMatrixGroup[] {
  const groups: RoleMatrixGroup[] = [];
  const seen = new Map<string, RoleMatrixGroup>();
  for (const item of rows) {
    let group = seen.get(item.moduleId);
    if (!group) {
      group = {
        moduleId: item.moduleId,
        moduleKey: item.module,
        modulePerm: item,
        screens: [],
        flat: false,
      };
      seen.set(item.moduleId, group);
      groups.push(group);
    }
    if (item.kind === 'roles.kind.module') {
      group.modulePerm = item;
      continue;
    }
    let screen = group.screens.find((entry) => entry.tabId === item.tabId);
    if (!screen) {
      screen = { tabId: item.tabId, screenKey: item.screen, buttons: [], columns: [] };
      group.screens.push(screen);
    }
    if (item.kind === 'roles.kind.screen') screen.screenPerm = item;
    else if (item.kind === 'roles.kind.button') screen.buttons.push(item);
    else screen.columns.push(item);
  }
  for (const group of groups) {
    group.flat = group.screens.length === 1 && group.screens[0].screenKey === group.moduleKey;
  }
  return groups;
}

export function withGrantFlag(
  rows: RoleMatrixRow[],
  allowed: (perm: string) => boolean,
): Record<string, unknown>[] {
  return rows.map((item) => ({
    ...item,
    allowed: allowed(item.perm) ? 'roles.grant.yes' : 'roles.grant.no',
  }));
}

/** If the draft is `*`, expand to every catalog perm before a single change. */
export function nextDraft(current: string[], keys: string[], on: boolean, catalog: string[]): string[] {
  const base = (current.includes('*') ? catalog : current).filter((item) => item !== '*');
  return on
    ? Array.from(new Set([...base, ...keys]))
    : base.filter((item) => !keys.includes(item));
}
