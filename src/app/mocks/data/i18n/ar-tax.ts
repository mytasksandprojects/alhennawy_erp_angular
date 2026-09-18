import { TranslationMap } from '../../../core/models/config.models';

/** MOCK LAYER — Arabic: Egypt ETA e-invoice API settings. */
export const AR_TAX: TranslationMap = {
  'taxApi.title': 'منظومة الفاتورة الإلكترونية (ETA)',
  'taxApi.subtitle': 'إعدادات الربط مع منظومة الفواتير الإلكترونية لمصلحة الضرائب المصرية',
  'taxApi.hint': 'أدخل بيانات الاعتماد الصادرة من بوابة مصلحة الضرائب المصرية. البيئة التجريبية (Preprod) للاختبار والإنتاجية للإرسال الفعلي.',
  'taxApi.fields.enabled': 'تفعيل الإرسال التلقائي',
  'taxApi.fields.environment': 'البيئة',
  'taxApi.env.preprod': 'تجريبية (Preprod)',
  'taxApi.env.production': 'إنتاجية (Production)',
  'taxApi.fields.apiUrl': 'رابط الـ API',
  'taxApi.fields.clientId': 'معرف العميل (Client ID)',
  'taxApi.fields.clientSecret': 'كلمة سر العميل (Client Secret)',
  'taxApi.fields.registrationNumber': 'الرقم الضريبي للشركة',
  'taxApi.fields.branchCode': 'كود الفرع',
  'taxApi.fields.activityCode': 'كود النشاط',
  'taxApi.fields.posSerial': 'الرقم التسلسلي لجهاز الإصدار (POS)',
  'taxApi.fields.issuerType': 'نوع المُصدِر',
  'taxApi.issuer.business': 'شركة (B)',
  'taxApi.issuer.person': 'شخص طبيعي (P)',
  'taxApi.fields.documentVersion': 'إصدار المستند',
  'taxApi.test': 'اختبار الاتصال',
  'taxApi.status.connected': 'متصل',
  'taxApi.status.notTested': 'فشل الاختبار',
  'taxApi.msg.saved': 'تم حفظ إعدادات الربط الضريبي',
  'taxApi.msg.testOk': 'تم الاتصال بالمنظومة بنجاح — {0}',
  'taxApi.msg.testFailed': 'فشل الاتصال — أكمل بيانات الاعتماد',
  'menu.taxApi': 'منظومة الفاتورة الإلكترونية',
};

