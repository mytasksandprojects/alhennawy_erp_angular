import { AttendanceLocation, AttendancePolicy } from '../../core/models/access.models';

/** MOCK LAYER — factory gates / Wi-Fi used by the check-in module. */
export const MOCK_LOCATIONS: AttendanceLocation[] = [
  {
    id: 'loc-1',
    name: 'المبنى الإداري',
    name_en: 'Admin Building',
    wifiSsid: 'AlHennawy-Office',
    latitude: 30.362,
    longitude: 30.508,
    radiusMeters: 150,
  },
  {
    id: 'loc-2',
    name: 'بوابة المصنع',
    name_en: 'Plant Gate',
    wifiSsid: 'AlHennawy-Plant',
    latitude: 30.364,
    longitude: 30.511,
    radiusMeters: 200,
  },
  {
    id: 'loc-3',
    name: 'بوابة المخزن',
    name_en: 'Warehouse Gate',
    wifiSsid: 'AlHennawy-Store',
    latitude: 30.361,
    longitude: 30.506,
    radiusMeters: 120,
  },
];

export const MOCK_ATTENDANCE_POLICY: AttendancePolicy = {
  wifiOnly: true,
  locationRequired: false,
  demoSsid: 'AlHennawy-Office',
  demoLatitude: 30.362,
  demoLongitude: 30.508,
};

export function getAttendancePolicy(): AttendancePolicy {
  return MOCK_ATTENDANCE_POLICY;
}

export function saveAttendancePolicy(body: unknown): AttendancePolicy {
  Object.assign(MOCK_ATTENDANCE_POLICY, body as AttendancePolicy);
  return MOCK_ATTENDANCE_POLICY;
}
