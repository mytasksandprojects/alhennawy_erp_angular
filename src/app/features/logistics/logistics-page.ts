import { ChangeDetectionStrategy, Component } from '@angular/core';
import { API_ENDPOINTS } from '../../core/api/api-endpoints';
import {
  ListTabConfig,
  ModuleTabbedView,
} from '../../shared/components/module-tabbed-view';
import {
  EXPORT_SHIPMENT_COLUMNS,
  EXPORT_SHIPMENT_FIELDS,
  IMPORT_COLUMNS,
  IMPORT_FIELDS,
} from './logistics.columns';

/**
 * اللوجيستيك — import lifecycle (RFQ → Proforma → ACID → CargoX →
 * Form 4 → Customs → Warehouse → Costing) and export shipments.
 */
@Component({
  selector: 'app-logistics-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModuleTabbedView],
  template: `
    <module-tabbed-view
      moduleId="logistics"
      titleKey="logistics.title"
      subtitleKey="logistics.subtitle"
      [listTabs]="tabs"
    />
  `,
})
export class LogisticsPage {
  protected readonly tabs: ListTabConfig[] = [
    {
      id: 'imports',
      labelKey: 'logistics.tabs.imports',
      endpoint: API_ENDPOINTS.logistics.imports,
      columns: IMPORT_COLUMNS,
      fields: IMPORT_FIELDS,
    },
    {
      id: 'exports',
      labelKey: 'logistics.tabs.exports',
      endpoint: API_ENDPOINTS.logistics.exports,
      columns: EXPORT_SHIPMENT_COLUMNS,
      fields: EXPORT_SHIPMENT_FIELDS,
    },
  ];
}
