import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import {
  CHEMICAL_CONSUMPTION_COLUMNS,
  CHEMICAL_CONSUMPTION_FIELDS,
  DASHT_INSPECTION_COLUMNS,
  DASHT_INSPECTION_FIELDS,
  MAINTENANCE_COLUMNS,
  MAINTENANCE_REQUEST_FIELDS,
  MATERIAL_INSPECTION_COLUMNS,
  MATERIAL_INSPECTION_FIELDS,
  TECH_SHEET_COLUMNS,
  TECH_SHEET_FIELDS,
} from './quality.columns';

/**
 * الجودة — dasht classification with discount %, material inspections,
 * daily chemical tank consumption (lab virtual store) and the machine
 * maintenance tab required by the BRD.
 */
@Component({
  selector: 'app-quality-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="quality"
      titleKey="quality.title"
      subtitleKey="quality.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class QualityPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'dasht',
      labelKey: 'quality.tabs.dasht',
      endpoint: API_ENDPOINTS.quality.dashtInspections,
      columns: DASHT_INSPECTION_COLUMNS,
      fields: DASHT_INSPECTION_FIELDS,
    },
    {
      id: 'materials',
      labelKey: 'quality.tabs.materials',
      endpoint: API_ENDPOINTS.quality.materialInspections,
      columns: MATERIAL_INSPECTION_COLUMNS,
      fields: MATERIAL_INSPECTION_FIELDS,
    },
    {
      id: 'chemicals',
      labelKey: 'quality.tabs.consumptions',
      endpoint: API_ENDPOINTS.quality.chemicalConsumption,
      columns: CHEMICAL_CONSUMPTION_COLUMNS,
      fields: CHEMICAL_CONSUMPTION_FIELDS,
    },
    {
      id: 'techSheets',
      labelKey: 'quality.tabs.techSheets',
      endpoint: API_ENDPOINTS.quality.techSheets,
      columns: TECH_SHEET_COLUMNS,
      fields: TECH_SHEET_FIELDS,
    },
    {
      id: 'maintenance',
      labelKey: 'quality.tabs.maintenance',
      endpoint: API_ENDPOINTS.quality.maintenance,
      columns: MAINTENANCE_COLUMNS,
      fields: MAINTENANCE_REQUEST_FIELDS,
    },
  ];
}
