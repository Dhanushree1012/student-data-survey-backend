ALTER TABLE public.profiles
  ALTER COLUMN id DROP DEFAULT,
  ADD COLUMN full_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_id_auth_users_fkey
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.districts
  ALTER COLUMN status SET DEFAULT 'active',
  ADD CONSTRAINT districts_status_check CHECK (status IN ('active', 'inactive')),
  ADD CONSTRAINT districts_organization_code_key UNIQUE (organization_id, code),
  ADD CONSTRAINT districts_organization_id_id_key UNIQUE (organization_id, id);

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_organization_id_id_key UNIQUE (organization_id, id);
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_organization_district_fkey
  FOREIGN KEY (organization_id, district_id)
  REFERENCES public.districts(organization_id, id);

CREATE TABLE public.taluks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (district_id, name),
  UNIQUE (organization_id, id, district_id)
);
ALTER TABLE public.taluks
  ADD CONSTRAINT taluks_organization_district_fkey
  FOREIGN KEY (organization_id, district_id)
  REFERENCES public.districts(organization_id, id);

CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  taluk_id UUID NOT NULL REFERENCES public.taluks(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code),
  UNIQUE (organization_id, id, district_id, taluk_id)
);
ALTER TABLE public.schools
  ADD CONSTRAINT schools_organization_district_fkey
  FOREIGN KEY (organization_id, district_id)
  REFERENCES public.districts(organization_id, id),
  ADD CONSTRAINT schools_organization_taluk_district_fkey
  FOREIGN KEY (organization_id, taluk_id, district_id)
  REFERENCES public.taluks(organization_id, id, district_id);

CREATE TABLE public.screening_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE RESTRICT,
  taluk_id UUID NOT NULL REFERENCES public.taluks(id) ON DELETE RESTRICT,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  beo_name TEXT NOT NULL,
  head_master_name TEXT NOT NULL,
  screening_faculty_name TEXT NOT NULL,
  screening_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, id),
  UNIQUE (organization_id, id, district_id, taluk_id, school_id),
  FOREIGN KEY (organization_id, school_id, district_id, taluk_id)
    REFERENCES public.schools(organization_id, id, district_id, taluk_id),
  FOREIGN KEY (organization_id, created_by)
    REFERENCES public.profiles(organization_id, id)
);

CREATE TABLE public.session_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.screening_sessions(id) ON DELETE CASCADE,
  enumerator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (session_id, enumerator_id),
  FOREIGN KEY (organization_id, session_id)
    REFERENCES public.screening_sessions(organization_id, id),
  FOREIGN KEY (organization_id, enumerator_id)
    REFERENCES public.profiles(organization_id, id)
);

ALTER TABLE public.student_screenings
  ADD COLUMN session_id UUID REFERENCES public.screening_sessions(id) ON DELETE RESTRICT,
  ADD COLUMN taluk_id UUID REFERENCES public.taluks(id) ON DELETE RESTRICT,
  ADD COLUMN school_id UUID REFERENCES public.schools(id) ON DELETE RESTRICT,
  ADD COLUMN age INTEGER,
  ADD COLUMN skeletal_deformity TEXT CHECK (skeletal_deformity IN ('No', 'Yes', 'Suspected', 'Not assessed')),
  ADD COLUMN skeletal_observation TEXT,
  ADD COLUMN skin_thickness_mm NUMERIC,
  ADD COLUMN mid_arm_circumference_cm NUMERIC,
  ADD COLUMN additional_remarks TEXT,
  ADD COLUMN screening_date DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Reviewed', 'Synced')),
  ADD COLUMN created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

ALTER TABLE public.student_screenings
  ALTER COLUMN class_name SET NOT NULL,
  ALTER COLUMN section SET NOT NULL,
  ALTER COLUMN sex SET NOT NULL,
  ALTER COLUMN date_of_birth SET NOT NULL,
  ALTER COLUMN age SET NOT NULL,
  ALTER COLUMN height_cm SET NOT NULL,
  ALTER COLUMN weight_kg SET NOT NULL,
  ALTER COLUMN bmi SET NOT NULL,
  ALTER COLUMN session_id SET NOT NULL,
  ALTER COLUMN district_id SET NOT NULL,
  ALTER COLUMN taluk_id SET NOT NULL,
  ALTER COLUMN school_id SET NOT NULL,
  ALTER COLUMN created_by SET NOT NULL,
  ADD CONSTRAINT student_screenings_sex_check CHECK (sex IS NULL OR sex IN ('Male', 'Female', 'Other', 'Prefer not to specify')),
  ADD CONSTRAINT student_screenings_age_check CHECK (age IS NULL OR age BETWEEN 0 AND 120),
  ADD CONSTRAINT student_screenings_height_check CHECK (height_cm IS NULL OR height_cm > 0),
  ADD CONSTRAINT student_screenings_weight_check CHECK (weight_kg IS NULL OR weight_kg > 0),
  ADD CONSTRAINT student_screenings_bmi_check CHECK (bmi IS NULL OR bmi > 0),
  ADD CONSTRAINT student_screenings_skin_thickness_check CHECK (skin_thickness_mm IS NULL OR skin_thickness_mm >= 0),
  ADD CONSTRAINT student_screenings_mid_arm_check CHECK (mid_arm_circumference_cm IS NULL OR mid_arm_circumference_cm >= 0),
  ADD CONSTRAINT student_screenings_org_session_fkey
    FOREIGN KEY (organization_id, session_id, district_id, taluk_id, school_id)
    REFERENCES public.screening_sessions(organization_id, id, district_id, taluk_id, school_id),
  ADD CONSTRAINT student_screenings_org_creator_fkey
    FOREIGN KEY (organization_id, created_by)
    REFERENCES public.profiles(organization_id, id);

CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  record_type TEXT NOT NULL,
  record_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX student_screenings_org_school_date_idx
  ON public.student_screenings (organization_id, school_id, screening_date DESC);
CREATE INDEX student_screenings_session_idx ON public.student_screenings (session_id);
CREATE INDEX screening_sessions_org_date_idx
  ON public.screening_sessions (organization_id, screening_date DESC);
CREATE INDEX session_assignments_enumerator_idx
  ON public.session_assignments (enumerator_id, session_id);
CREATE INDEX audit_logs_org_created_idx
  ON public.audit_logs (organization_id, created_at DESC);

CREATE OR REPLACE FUNCTION public.current_profile_organization_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.current_profile_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.current_profile_district_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT district_id FROM public.profiles WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_assigned_to_session(target_session_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.session_assignments
    WHERE session_id = target_session_id
      AND enumerator_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.write_audit_log()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  row_id UUID;
  row_organization_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    row_id := OLD.id;
    row_organization_id := OLD.organization_id;
  ELSE
    row_id := NEW.id;
    row_organization_id := NEW.organization_id;
  END IF;

  INSERT INTO public.audit_logs (organization_id, actor_id, action, record_type, record_id, metadata)
  VALUES (
    row_organization_id,
    auth.uid(),
    lower(TG_OP),
    TG_TABLE_NAME,
    row_id,
    jsonb_build_object('source', 'database_trigger')
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END
$$;

CREATE TRIGGER profiles_set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER districts_set_updated_at BEFORE UPDATE ON public.districts
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER taluks_set_updated_at BEFORE UPDATE ON public.taluks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER schools_set_updated_at BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER screening_sessions_set_updated_at BEFORE UPDATE ON public.screening_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER student_screenings_set_updated_at BEFORE UPDATE ON public.student_screenings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER districts_write_audit AFTER INSERT OR UPDATE OR DELETE ON public.districts
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
CREATE TRIGGER taluks_write_audit AFTER INSERT OR UPDATE OR DELETE ON public.taluks
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
CREATE TRIGGER schools_write_audit AFTER INSERT OR UPDATE OR DELETE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
CREATE TRIGGER screening_sessions_write_audit AFTER INSERT OR UPDATE OR DELETE ON public.screening_sessions
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
CREATE TRIGGER student_screenings_write_audit AFTER INSERT OR UPDATE OR DELETE ON public.student_screenings
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();
CREATE TRIGGER session_assignments_write_audit AFTER INSERT OR UPDATE OR DELETE ON public.session_assignments
  FOR EACH ROW EXECUTE FUNCTION public.write_audit_log();

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.taluks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.screening_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_screenings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY organizations_read_own ON public.organizations
  FOR SELECT TO authenticated
  USING (id = public.current_profile_organization_id());

CREATE POLICY profiles_read_organization ON public.profiles
  FOR SELECT TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() IN ('organization_admin', 'district_manager')
      OR id = auth.uid()
    )
  );
CREATE POLICY profiles_admin_update ON public.profiles
  FOR UPDATE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  )
  WITH CHECK (organization_id = public.current_profile_organization_id());

CREATE POLICY districts_read_organization ON public.districts
  FOR SELECT TO authenticated
  USING (organization_id = public.current_profile_organization_id());
CREATE POLICY districts_admin_insert ON public.districts
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  );
CREATE POLICY districts_admin_update ON public.districts
  FOR UPDATE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  )
  WITH CHECK (organization_id = public.current_profile_organization_id());
CREATE POLICY districts_admin_delete ON public.districts
  FOR DELETE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  );

CREATE POLICY taluks_read_organization ON public.taluks
  FOR SELECT TO authenticated
  USING (organization_id = public.current_profile_organization_id());
CREATE POLICY taluks_admin_write ON public.taluks
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  );
CREATE POLICY taluks_admin_update ON public.taluks
  FOR UPDATE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  )
  WITH CHECK (organization_id = public.current_profile_organization_id());
CREATE POLICY taluks_admin_delete ON public.taluks
  FOR DELETE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  );

CREATE POLICY schools_read_organization ON public.schools
  FOR SELECT TO authenticated
  USING (organization_id = public.current_profile_organization_id());
CREATE POLICY schools_admin_write ON public.schools
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  );
CREATE POLICY schools_admin_update ON public.schools
  FOR UPDATE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  )
  WITH CHECK (organization_id = public.current_profile_organization_id());
CREATE POLICY schools_admin_delete ON public.schools
  FOR DELETE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() = 'organization_admin'
  );

CREATE POLICY sessions_read_assigned_scope ON public.screening_sessions
  FOR SELECT TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
      OR (
        public.current_profile_role() = 'enumerator'
        AND public.is_assigned_to_session(id)
      )
    )
  );
CREATE POLICY sessions_admin_manager_insert ON public.screening_sessions
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
    )
    AND created_by = auth.uid()
  );
CREATE POLICY sessions_admin_manager_update ON public.screening_sessions
  FOR UPDATE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
    )
  )
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
    )
  );

CREATE POLICY assignments_read_assigned_scope ON public.session_assignments
  FOR SELECT TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND EXISTS (
          SELECT 1 FROM public.screening_sessions s
          WHERE s.id = session_id
            AND s.district_id = public.current_profile_district_id()
        )
      )
      OR enumerator_id = auth.uid()
    )
  );
CREATE POLICY assignments_admin_manager_insert ON public.session_assignments
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() IN ('organization_admin', 'district_manager')
    AND EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = enumerator_id
        AND p.organization_id = public.current_profile_organization_id()
        AND p.role = 'enumerator'
    )
    AND EXISTS (
      SELECT 1 FROM public.screening_sessions s
      WHERE s.id = session_id
        AND s.organization_id = public.current_profile_organization_id()
    )
  );
CREATE POLICY assignments_admin_manager_delete ON public.session_assignments
  FOR DELETE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() IN ('organization_admin', 'district_manager')
    AND EXISTS (
      SELECT 1 FROM public.screening_sessions s
      WHERE s.id = session_id
        AND s.organization_id = public.current_profile_organization_id()
    )
  );

CREATE POLICY screenings_read_assigned_scope ON public.student_screenings
  FOR SELECT TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
      OR (
        public.current_profile_role() = 'enumerator'
        AND session_id IS NOT NULL
        AND public.is_assigned_to_session(session_id)
      )
    )
  );
CREATE POLICY screenings_insert_assigned_scope ON public.student_screenings
  FOR INSERT TO authenticated
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND created_by = auth.uid()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
      OR (
        public.current_profile_role() = 'enumerator'
        AND session_id IS NOT NULL
        AND public.is_assigned_to_session(session_id)
      )
    )
  );
CREATE POLICY screenings_admin_manager_update ON public.student_screenings
  FOR UPDATE TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
    )
  )
  WITH CHECK (
    organization_id = public.current_profile_organization_id()
    AND (
      public.current_profile_role() = 'organization_admin'
      OR (
        public.current_profile_role() = 'district_manager'
        AND district_id = public.current_profile_district_id()
      )
    )
  );

CREATE POLICY audit_logs_admin_manager_read ON public.audit_logs
  FOR SELECT TO authenticated
  USING (
    organization_id = public.current_profile_organization_id()
    AND public.current_profile_role() IN ('organization_admin', 'district_manager')
  );

GRANT SELECT ON public.organizations TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.districts, public.taluks, public.schools TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.screening_sessions, public.student_screenings TO authenticated;
GRANT SELECT, INSERT, DELETE ON public.session_assignments TO authenticated;
GRANT SELECT ON public.audit_logs TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_profile_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_profile_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_profile_district_id() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_assigned_to_session(UUID) TO authenticated;
