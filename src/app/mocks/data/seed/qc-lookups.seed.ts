import { LookupValue } from '../../../core/models/system.models';

const lk = (
  id: string,
  group: string,
  value: string,
  labelAr: string,
  labelEn: string,
  parentValue?: string,
): LookupValue => ({ id, group, value, labelAr, labelEn, parentValue });

const PARENTS: [string, string, string][] = [
  ['facial', 'مناديل وجه', 'Facial'],
  ['toilet', 'تواليت', 'Toilet'],
  ['maxiRoll', 'ماكسي رول', 'Maxi Roll'],
  ['kitchenTowel', 'مناديل مطبخ', 'Kitchen Towel'],
  ['towel', 'توال', 'Towel'],
  ['napkin', 'نابكن', 'Napkin'],
  ['coloredNapkin', 'نابكن ملون', 'Colored Napkin'],
  ['mg', 'إم جي', 'MG'],
  ['coloredMg', 'إم جي ملون', 'Colored MG'],
];

const PLIES = ['1', '2', '3', '4'];

const COLORS: [string, string, string][] = [
  ['white', 'أبيض', 'White'],
  ['yellow', 'أصفر', 'Yellow'],
  ['pink', 'وردي', 'Pink'],
  ['blue', 'أزرق', 'Blue'],
  ['green', 'أخضر', 'Green'],
  ['orange', 'برتقالي', 'Orange'],
  ['red', 'أحمر', 'Red'],
  ['cream', 'كريمي', 'Cream'],
  ['natural', 'طبيعي', 'Natural'],
  ['brown', 'بني', 'Brown'],
  ['purple', 'بنفسجي', 'Purple'],
  ['black', 'أسود', 'Black'],
];

export const QC_LOOKUPS: LookupValue[] = [
  lk('lv-mix-1', 'qcMix', 'qc.mix.mixed', 'سوبر مكس', 'Super Mix'),
  lk('lv-mix-2', 'qcMix', 'qc.mix.pure', 'بيور', 'Pure'),
  ...PARENTS.map(([id, ar, en]) => lk(`lv-par-${id}`, 'qcParents', `qc.parents.${id}`, ar, en)),
  ...PLIES.map((ply) => lk(`lv-ply-${ply}`, 'qcPly', ply, ply, ply)),
  ...COLORS.map(([id, ar, en]) => lk(`lv-col-${id}`, 'qcColors', `qc.colors.${id}`, ar, en)),
];
