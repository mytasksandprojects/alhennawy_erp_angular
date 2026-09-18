import { TranslationMap } from '../../../core/models/config.models';
import { AR_BACKUP } from './ar-backup';
import { AR_BUSINESS } from './ar-business';
import { AR_CORE } from './ar-core';
import { AR_CUTTER } from './ar-cutter';
import { AR_FACTORY } from './ar-factory';
import { AR_MASTER } from './ar-master';
import { AR_OPERATIONS } from './ar-operations';
import { AR_PEOPLE } from './ar-people';
import { AR_SALES } from './ar-sales';
import { AR_TAX } from './ar-tax';
import { EN_BACKUP } from './en-backup';
import { EN_BUSINESS } from './en-business';
import { EN_CORE } from './en-core';
import { EN_CUTTER } from './en-cutter';
import { EN_FACTORY } from './en-factory';
import { EN_MASTER } from './en-master';
import { EN_OPERATIONS } from './en-operations';
import { EN_PEOPLE } from './en-people';
import { EN_SALES } from './en-sales';
import { EN_TAX } from './en-tax';

/**
 * MOCK LAYER — the translations "API". The real backend will serve the
 * same flat key/value shape from `/config/translations/{lang}`.
 */
export const TRANSLATIONS: Record<string, TranslationMap> = {
  ar: { ...AR_CORE, ...AR_OPERATIONS, ...AR_BUSINESS, ...AR_PEOPLE, ...AR_FACTORY, ...AR_MASTER, ...AR_SALES, ...AR_CUTTER, ...AR_TAX, ...AR_BACKUP },
  en: { ...EN_CORE, ...EN_OPERATIONS, ...EN_BUSINESS, ...EN_PEOPLE, ...EN_FACTORY, ...EN_MASTER, ...EN_SALES, ...EN_CUTTER, ...EN_TAX, ...EN_BACKUP },
};
