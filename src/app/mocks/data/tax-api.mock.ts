import { TaxApiSettings } from '../../core/models/tax-api.models';

/**
 * MOCK LAYER — Egypt Tax Authority (ETA) e-invoice API settings,
 * edited from the tax-api module in the sidebar. `lastTest*` feeds the
 * connection badge shown on the settings page.
 */
export const MOCK_TAX_API_SETTINGS: TaxApiSettings = {
  id: 'tax-api-settings',
  enabled: false,
  environment: 'preprod',
  apiUrl: 'https://preprod.invoicing.eta.gov.eg',
  clientId: '',
  clientSecret: '',
  registrationNumber: '123456789',
  branchCode: '0',
  activityCode: '0111',
  posSerial: 'POS-01',
  issuerType: 'business',
  documentVersion: '1.0',
};

export function getTaxApiSettings(): TaxApiSettings {
  return MOCK_TAX_API_SETTINGS;
}

export function saveTaxApiSettings(body: unknown): TaxApiSettings {
  const draft = body as Partial<TaxApiSettings>;
  Object.assign(MOCK_TAX_API_SETTINGS, draft, { id: MOCK_TAX_API_SETTINGS.id });
  return MOCK_TAX_API_SETTINGS;
}

/** Simulated connection test — succeeds once the mandatory credentials are filled. */
export function testTaxApiConnection(): { ok: boolean; checkedAt: string; message: string } {
  const s = MOCK_TAX_API_SETTINGS;
  const ok = Boolean(s.clientId && s.clientSecret && s.registrationNumber);
  s.lastTestOk = ok;
  s.lastTestAt = new Date().toISOString();
  return { ok, checkedAt: s.lastTestAt, message: ok ? 'ok' : 'missing-credentials' };
}
