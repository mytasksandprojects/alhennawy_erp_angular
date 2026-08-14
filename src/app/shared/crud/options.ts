import { SelectOption } from '../../core/models/common.models';

export const boolOptions: SelectOption[] = [
  { value: 'true', labelKey: 'common.bool.true' },
  { value: 'false', labelKey: 'common.bool.false' },
];

export function keysToOptions(prefix: string, values: string[]): SelectOption[] {
  return values.map((value) => ({ value, labelKey: prefix + value }));
}
