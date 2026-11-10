import type { AppUser, AuditLog, District, Role, ScreeningSession, StudentRecord, Taluk, School } from '../types';

export const districtData: District[] = [
  { id: 'dist-1', name: 'Bengaluru Urban', code: 'BU-01', status: 'active' },
  { id: 'dist-2', name: 'Mysuru', code: 'MY-02', status: 'active' },
  { id: 'dist-3', name: 'Shimoga', code: 'SH-03', status: 'inactive' },
];

export const talukData: Taluk[] = [
  { id: 'tal-1', name: 'Yelahanka', districtId: 'dist-1', status: 'active' },
  { id: 'tal-2', name: 'Mysuru North', districtId: 'dist-2', status: 'active' },
  { id: 'tal-3', name: 'Shimoga Town', districtId: 'dist-3', status: 'inactive' },
];

export const schoolData: School[] = [
  { id: 'sch-1', name: 'Government High School, Yelahanka', code: 'GHS-101', districtId: 'dist-1', talukId: 'tal-1', beoId: 'beo-1', status: 'active' },
  { id: 'sch-2', name: 'Rural Academy, Mysuru', code: 'RA-222', districtId: 'dist-2', talukId: 'tal-2', beoId: 'beo-2', status: 'active' },
];

export const users: AppUser[] = [
  { id: 'user-1', name: 'Nisha Rao', email: 'admin@studenthealthhub.in', role: 'organization_admin' },
  { id: 'user-2', name: 'Arun Kumar', email: 'district@studenthealthhub.in', role: 'district_manager', districtId: 'dist-1' },
  { id: 'user-3', name: 'Meera Das', email: 'enumerator@studenthealthhub.in', role: 'enumerator', districtId: 'dist-1', schoolIds: ['sch-1'] },
];

export const screeningSessions: ScreeningSession[] = [
  { id: 'sess-1', name: 'Annual Screening - Yelahanka', districtId: 'dist-1', talukId: 'tal-1', schoolId: 'sch-1', date: '2026-11-10', status: 'active', enumerators: ['user-3'] },
  { id: 'sess-2', name: 'Mysuru Growth Check', districtId: 'dist-2', talukId: 'tal-2', schoolId: 'sch-2', date: '2026-11-12', status: 'completed', enumerators: ['user-3'] },
];

export const studentRecords: StudentRecord[] = [
  {
    id: 'std-1',
    siNumber: 'SHH-1001',
    studentName: 'Aanya Nair',
    className: '8',
    section: 'A',
    sex: 'Female',
    dateOfBirth: '2013-04-15',
    age: 13,
    heightCm: 142,
    weightKg: 33,
    bmi: 16.3,
    skinThicknessMm: 12,
    midArmCircumferenceCm: 18,
    districtId: 'dist-1',
    talukId: 'tal-1',
    schoolId: 'sch-1',
    screeningDate: '2026-11-10',
    status: 'Synced',
  },
  {
    id: 'std-2',
    siNumber: 'SHH-1002',
    studentName: 'Karthik Rao',
    className: '7',
    section: 'B',
    sex: 'Male',
    dateOfBirth: '2014-02-21',
    age: 12,
    heightCm: 138,
    weightKg: 35,
    bmi: 18.4,
    skinThicknessMm: 10,
    midArmCircumferenceCm: 17,
    districtId: 'dist-1',
    talukId: 'tal-1',
    schoolId: 'sch-1',
    screeningDate: '2026-11-10',
    status: 'Pending',
  },
  {
    id: 'std-3',
    siNumber: 'SHH-2001',
    studentName: 'Ishita Shetty',
    className: '9',
    section: 'C',
    sex: 'Female',
    dateOfBirth: '2012-09-10',
    age: 14,
    heightCm: 149,
    weightKg: 42,
    bmi: 18.9,
    skinThicknessMm: 11,
    midArmCircumferenceCm: 19,
    districtId: 'dist-2',
    talukId: 'tal-2',
    schoolId: 'sch-2',
    screeningDate: '2026-11-12',
    status: 'Reviewed',
  },
];

export const auditLogs: AuditLog[] = [
  { id: 'audit-1', actor: 'Nisha Rao', action: 'User invited', recordType: 'profiles', timestamp: '2026-11-09T10:30:00Z', metadata: 'Enumerators and district managers invited to district 1' },
  { id: 'audit-2', actor: 'Meera Das', action: 'Student created', recordType: 'student_screenings', timestamp: '2026-11-10T12:00:00Z', metadata: 'Student SI: SHH-1002' },
  { id: 'audit-3', actor: 'Arun Kumar', action: 'Report exported', recordType: 'exports', timestamp: '2026-11-10T14:15:00Z', metadata: 'District-wise report generated for Bengaluru Urban' },
];

export const roleAccess: Record<Role, string[]> = {
  organization_admin: ['dashboard', 'screening-sessions', 'student-registration', 'students', 'schools', 'districts', 'enumerators', 'assignments', 'reports', 'audit-logs', 'settings', 'profile'],
  district_manager: ['dashboard', 'screening-sessions', 'students', 'schools', 'districts', 'enumerators', 'assignments', 'reports', 'audit-logs', 'profile'],
  enumerator: ['dashboard', 'screening-sessions', 'student-registration', 'students', 'reports', 'profile'],
};

export const appSummaryStats = {
  totalStudentsScreened: 6348,
  totalSessions: 98,
  totalSchools: 42,
  totalDistricts: 5,
  totalEnumerators: 116,
  activeEnumerators: 94,
  pendingSubmissions: 24,
  failedSyncRecords: 3,
};
