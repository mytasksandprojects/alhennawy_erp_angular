import { LookupValue } from '../../../core/models/system.models';

const lk = (
  id: string,
  group: string,
  value: string,
  labelAr: string,
  labelEn: string,
  parentValue?: string,
): LookupValue => ({ id, group, value, labelAr, labelEn, parentValue });

/** الإدارات from the attendance sheet, plus IT for the system admin. */
export const SEED_ADMINISTRATIONS: LookupValue[] = [
  lk('lv-adm-fleet', 'administrations', 'administrations.fleet', 'الحركة', 'Fleet'),
  lk('lv-adm-prod', 'administrations', 'administrations.production', 'الانتاج', 'Production'),
  lk('lv-adm-maint', 'administrations', 'administrations.maintenance', 'الصيانة', 'Maintenance'),
  lk('lv-adm-elec', 'administrations', 'administrations.electrical', 'الصيانة الكهربائية', 'Electrical Maintenance'),
  lk('lv-adm-fin', 'administrations', 'administrations.finance', 'الادارة المالية', 'Finance Administration'),
  lk('lv-adm-qc', 'administrations', 'administrations.quality', 'الجودة', 'Quality'),
  lk('lv-adm-hse', 'administrations', 'administrations.safety', 'السلامة والصحة المهنية', 'HSE'),
  lk('lv-adm-it', 'administrations', 'administrations.it', 'تكنولوجيا المعلومات', 'IT'),
];

/** الأقسام — each row is a child of one إدارة. */
export const SEED_SECTIONS: LookupValue[] = [
  lk('lv-sec-fleet', 'sections', 'sections.fleet', 'الحركة', 'Fleet', 'administrations.fleet'),
  lk('lv-sec-prep', 'sections', 'sections.prep', 'التحضيرات', 'Preparations', 'administrations.production'),
  lk('lv-sec-pq', 'sections', 'sections.prodQuality', 'الجودة', 'Quality', 'administrations.production'),
  lk('lv-sec-machine', 'sections', 'sections.machine', 'الماكينة', 'Machine', 'administrations.production'),
  lk('lv-sec-mech', 'sections', 'sections.mechanical', 'الصيانة الميكانيكية', 'Mechanical Maintenance', 'administrations.maintenance'),
  lk('lv-sec-elec', 'sections', 'sections.electrical', 'الكهرباء', 'Electrical', 'administrations.electrical'),
  lk('lv-sec-office', 'sections', 'sections.office', 'الادارة', 'Administration Office', 'administrations.finance'),
  lk('lv-sec-acc', 'sections', 'sections.accounts', 'الحسابات', 'Accounts', 'administrations.finance'),
  lk('lv-sec-sales', 'sections', 'sections.sales', 'المبيعات', 'Sales', 'administrations.finance'),
  lk('lv-sec-wh', 'sections', 'sections.warehouse', 'المخازن', 'Warehouses', 'administrations.finance'),
  lk('lv-sec-pur', 'sections', 'sections.purchasing', 'المشتريات', 'Purchasing', 'administrations.finance'),
  lk('lv-sec-hr', 'sections', 'sections.hr', 'الموارد البشرية', 'Human Resources', 'administrations.finance'),
  lk('lv-sec-qc', 'sections', 'sections.quality', 'الجودة', 'Quality', 'administrations.quality'),
  lk('lv-sec-hse', 'sections', 'sections.hse', 'السلامة والصحة المهنية', 'HSE', 'administrations.safety'),
];
