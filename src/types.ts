export type Role = 'organization_admin' | 'district_manager' | 'enumerator';

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  districtId?: string;
  schoolIds?: string[];
};

export type District = {
  id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
};

export type Taluk = {
  id: string;
  name: string;
  districtId: string;
  status: 'active' | 'inactive';
};

export type School = {
  id: string;
  name: string;
  code: string;
  districtId: string;
  talukId: string;
  beoId: string;
  status: 'active' | 'inactive';
};

export type ScreeningSession = {
  id: string;
  name: string;
  districtId: string;
  talukId: string;
  schoolId: string;
  date: string;
  status: 'active' | 'completed';
  enumerators: string[];
};

export type StudentRecord = {
  id: string;
  siNumber: string;
  studentName: string;
  className: string;
  section: string;
  sex: 'Male' | 'Female';
  dateOfBirth: string;
  age: number;
  heightCm: number;
  weightKg: number;
  bmi: number;
  skinThicknessMm: number;
  midArmCircumferenceCm: number;
  districtId: string;
  talukId: string;
  schoolId: string;
  screeningDate: string;
  status: 'Pending' | 'Reviewed' | 'Synced';
};

export type AuditLog = {
  id: string;
  actor: string;
  action: string;
  recordType: string;
  timestamp: string;
  metadata: string;
};

export type RouteKey =
  | 'dashboard'
  | 'screening-sessions'
  | 'student-registration'
  | 'students'
  | 'schools'
  | 'districts'
  | 'enumerators'
  | 'assignments'
  | 'reports'
  | 'audit-logs'
  | 'settings'
  | 'profile';
