export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

type ProfileRow = {
  id: string;
  organization_id: string;
  email: string;
  full_name: string;
  role: 'organization_admin' | 'district_manager' | 'enumerator';
  district_id: string | null;
  created_at: string;
  updated_at: string;
};

type DistrictRow = {
  id: string;
  organization_id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

type TalukRow = {
  id: string;
  organization_id: string;
  district_id: string;
  name: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

type SchoolRow = {
  id: string;
  organization_id: string;
  district_id: string;
  taluk_id: string;
  name: string;
  code: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

type ScreeningSessionRow = {
  id: string;
  organization_id: string;
  district_id: string;
  taluk_id: string;
  school_id: string;
  name: string;
  beo_name: string;
  head_master_name: string;
  screening_faculty_name: string;
  screening_date: string;
  status: 'active' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
  updated_at: string;
};

type StudentScreeningRow = {
  id: string;
  organization_id: string;
  session_id: string | null;
  district_id: string | null;
  taluk_id: string | null;
  school_id: string | null;
  si_number: string;
  student_name: string;
  class_name: string;
  section: string;
  sex: 'Male' | 'Female' | 'Other' | 'Prefer not to specify';
  date_of_birth: string;
  age: number;
  height_cm: number;
  weight_kg: number;
  bmi: number;
  skeletal_deformity: 'No' | 'Yes' | 'Suspected' | 'Not assessed' | null;
  skeletal_observation: string | null;
  skin_thickness_mm: number | null;
  mid_arm_circumference_cm: number | null;
  additional_remarks: string | null;
  screening_date: string;
  status: 'Pending' | 'Reviewed' | 'Synced';
  created_by: string;
  created_at: string;
  updated_at: string;
};

type AuditLogRow = {
  id: string;
  organization_id: string;
  actor_id: string | null;
  action: string;
  record_type: string;
  record_id: string | null;
  metadata: Json;
  created_at: string;
};

type OrganizationRow = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

type AssignmentRow = {
  id: string;
  organization_id: string;
  session_id: string;
  enumerator_id: string;
  created_at: string;
};

type OrganizationInsert = { id?: string; name: string; created_at?: string; updated_at?: string };
type ProfileInsert = Omit<ProfileRow, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string };
type DistrictInsert = Omit<DistrictRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
type TalukInsert = Omit<TalukRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
type SchoolInsert = Omit<SchoolRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
type SessionInsert = Omit<ScreeningSessionRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
type StudentInsert = Omit<StudentScreeningRow, 'id' | 'created_at' | 'updated_at'> & { id?: string; created_at?: string; updated_at?: string };
type AuditInsert = Omit<AuditLogRow, 'id' | 'created_at'> & { id?: string; created_at?: string };
type AssignmentInsert = Omit<AssignmentRow, 'id' | 'created_at'> & { id?: string; created_at?: string };

export type Database = {
  public: {
    Tables: {
      organizations: Table<OrganizationRow, OrganizationInsert>;
      profiles: Table<ProfileRow, ProfileInsert>;
      districts: Table<DistrictRow, DistrictInsert>;
      taluks: Table<TalukRow, TalukInsert>;
      schools: Table<SchoolRow, SchoolInsert>;
      screening_sessions: Table<ScreeningSessionRow, SessionInsert>;
      session_assignments: Table<AssignmentRow, AssignmentInsert>;
      student_screenings: Table<StudentScreeningRow, StudentInsert>;
      audit_logs: Table<AuditLogRow, AuditInsert>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
