import { Account, AccountNature } from '../../../core/models/finance.models';

export function acc(
  code: string,
  name: string,
  nameEn: string,
  parentCode: string | undefined,
  level: number,
  nature: AccountNature,
  currency: string,
  isPostable: boolean,
): Account {
  return {
    code,
    name,
    name_en: nameEn,
    parentCode,
    level,
    nature,
    currency,
    isPostable,
    costCenterRequired: false,
  };
}
