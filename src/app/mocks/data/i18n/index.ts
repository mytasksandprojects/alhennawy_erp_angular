import { TranslationMap } from '../../../core/models/config.models';
import { AR_BUSINESS } from './ar-business';
import { AR_CORE } from './ar-core';
import { AR_OPERATIONS } from './ar-operations';
import { AR_PEOPLE } from './ar-people';
import { EN_BUSINESS } from './en-business';
import { EN_CORE } from './en-core';
import { EN_OPERATIONS } from './en-operations';
import { EN_PEOPLE } from './en-people';

/**
 * MOCK LAYER — the translations "API". The real backend will serve the
 * same flat key/value shape from `/config/translations/{lang}`.
 */
export const TRANSLATIONS: Record<string, TranslationMap> = {
  ar: { ...AR_CORE, ...AR_OPERATIONS, ...AR_BUSINESS, ...AR_PEOPLE },
  en: { ...EN_CORE, ...EN_OPERATIONS, ...EN_BUSINESS, ...EN_PEOPLE },
};
