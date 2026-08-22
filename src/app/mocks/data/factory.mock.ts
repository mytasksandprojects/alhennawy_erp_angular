import { FactoryProfilePayload } from '../../core/models/config.models';
import { MockApiError } from '../mock-backend.interceptor';
import { TRANSLATIONS } from './i18n';
import { MOCK_SETTINGS } from './settings.mock';

/** MOCK LAYER — factory letterhead (name, address, phones, logo, ISO). */

export function getFactoryProfile(): FactoryProfilePayload {
  const company = MOCK_SETTINGS.company;
  const names: Record<string, string> = {};
  const addresses: Record<string, string> = {};
  for (const lang of MOCK_SETTINGS.languages) {
    names[lang.code] = TRANSLATIONS[lang.code]?.[company.nameKey] ?? '';
    addresses[lang.code] = TRANSLATIONS[lang.code]?.[company.addressKey] ?? '';
  }
  return {
    phone: company.phone,
    fax: company.fax,
    logoUrl: company.logoUrl,
    sidebarLogoUrl: company.sidebarLogoUrl,
    isoCertifications: [...company.isoCertifications],
    names,
    addresses,
  };
}

export function saveFactoryProfile(body: unknown): FactoryProfilePayload {
  const payload = body as Partial<FactoryProfilePayload>;
  if (!payload.phone || !payload.names || !payload.addresses) {
    throw new MockApiError(400, 'invalid-profile');
  }
  const company = MOCK_SETTINGS.company;
  company.phone = String(payload.phone);
  company.fax = String(payload.fax ?? '');
  company.logoUrl = String(payload.logoUrl ?? company.logoUrl);
  company.sidebarLogoUrl = String(payload.sidebarLogoUrl ?? company.sidebarLogoUrl);
  if (Array.isArray(payload.isoCertifications)) {
    company.isoCertifications = payload.isoCertifications.map(String);
  }
  for (const lang of MOCK_SETTINGS.languages) {
    const map = TRANSLATIONS[lang.code];
    if (!map) continue;
    if (payload.names[lang.code] !== undefined) {
      map[company.nameKey] = payload.names[lang.code];
    }
    if (payload.addresses[lang.code] !== undefined) {
      map[company.addressKey] = payload.addresses[lang.code];
    }
  }
  return getFactoryProfile();
}
