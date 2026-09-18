import { TableColumn } from '../models/common.models';
import { CatalogTab } from '../models/access.models';
import { REPORT_CATEGORIES } from '../../features/reports/report-defs';

export function catalogTab(id: string, labelKey: string, columns: TableColumn[]): CatalogTab {
  return {
    id,
    labelKey,
    columns: columns.map((col) => ({
      key: col.key,
      labelKey: col.labelKey,
      multilang: col.multilang,
    })),
  };
}

export function dashboardTab(): CatalogTab {
  return catalogTab('dashboard', 'common.dashboardTab', []);
}

export function reportTabs(): CatalogTab[] {
  return REPORT_CATEGORIES.flatMap((category) =>
    category.reports.map((report) => catalogTab(report.id, report.labelKey, report.columns)),
  );
}
