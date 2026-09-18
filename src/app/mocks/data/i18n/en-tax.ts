import { TranslationMap } from '../../../core/models/config.models';

/** MOCK LAYER — English: Egypt ETA e-invoice API settings. */
export const EN_TAX: TranslationMap = {
  'taxApi.title': 'Egyptian Tax E-Invoice (ETA)',
  'taxApi.subtitle': 'Connection settings for the Egyptian Tax Authority e-invoice system',
  'taxApi.hint': 'Enter the credentials issued by the Egyptian Tax Authority portal. Preprod for testing, production for live submission.',
  'taxApi.fields.enabled': 'Enable automatic submission',
  'taxApi.fields.environment': 'Environment',
  'taxApi.env.preprod': 'Preprod (Test)',
  'taxApi.env.production': 'Production (Live)',
  'taxApi.fields.apiUrl': 'API URL',
  'taxApi.fields.clientId': 'Client ID',
  'taxApi.fields.clientSecret': 'Client Secret',
  'taxApi.fields.registrationNumber': 'Tax Registration Number',
  'taxApi.fields.branchCode': 'Branch Code',
  'taxApi.fields.activityCode': 'Activity Code',
  'taxApi.fields.posSerial': 'Issuer POS Serial',
  'taxApi.fields.issuerType': 'Issuer Type',
  'taxApi.issuer.business': 'Business (B)',
  'taxApi.issuer.person': 'Natural Person (P)',
  'taxApi.fields.documentVersion': 'Document Version',
  'taxApi.test': 'Test Connection',
  'taxApi.status.connected': 'Connected',
  'taxApi.status.notTested': 'Test failed',
  'taxApi.msg.saved': 'Tax API settings saved',
  'taxApi.msg.testOk': 'Connected successfully — {0}',
  'taxApi.msg.testFailed': 'Connection failed — complete the credentials',
  'menu.taxApi': 'E-Invoice (ETA)',
};

