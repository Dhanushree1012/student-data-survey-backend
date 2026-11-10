import { useRef, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRemoteData } from '../hooks/useRemoteData';
import { createStudentScreening, getScreeningSessions } from '../lib/dataService';
import { getLocalDateString } from '../lib/date';
import { calculateAge, calculateBmi } from '../lib/permissions';
import { isLocalTestSessionActive } from '../lib/localTestMode';
import type { StudentRecord } from '../types';

const initialForm = {
  siNumber: '',
  studentName: '',
  className: '',
  section: '',
  sex: 'Male',
  dateOfBirth: '',
  heightCm: '',
  weightKg: '',
  skeletalDeformity: 'Not assessed',
  skeletalObservation: '',
  skinThicknessMm: '',
  midArmCircumferenceCm: '',
  additionalRemarks: '',
  sessionId: '',
};

export function StudentRegistrationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: sessions, isLoading, error: sessionsError } = useRemoteData(getScreeningSessions);
  const [form, setForm] = useState(() => ({ ...initialForm, sessionId: searchParams.get('sessionId') ?? '' }));
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const saveAnother = useRef(false);

  const today = getLocalDateString();
  const heightCm = Number(form.heightCm);
  const weightKg = Number(form.weightKg);
  const skinThicknessMm = form.skinThicknessMm === '' ? null : Number(form.skinThicknessMm);
  const midArmCircumferenceCm = form.midArmCircumferenceCm === '' ? null : Number(form.midArmCircumferenceCm);
  const selectedSession = sessions?.find((session) => session.id === form.sessionId && session.status === 'active');
  const screeningDate = selectedSession?.date ?? today;
  const age = form.dateOfBirth ? calculateAge(form.dateOfBirth, screeningDate) : '';
  const bmi = calculateBmi(weightKg, heightCm);

  const handleChange = (key: keyof typeof initialForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSubmitted(false);
    setError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(false);
    setError('');

    if (!user || !selectedSession) {
      setError('Select an active screening session available to your account.');
      return;
    }

    if (
      !Number.isFinite(heightCm) || heightCm <= 0 ||
      !Number.isFinite(weightKg) || weightKg <= 0 ||
      (skinThicknessMm !== null && (!Number.isFinite(skinThicknessMm) || skinThicknessMm < 0)) ||
      (midArmCircumferenceCm !== null && (!Number.isFinite(midArmCircumferenceCm) || midArmCircumferenceCm < 0)) ||
      typeof age !== 'number' || age < 0
    ) {
      setError('Enter valid birth date and positive height and weight measurements.');
      return;
    }

    const record: StudentRecord = {
      id: '',
      sessionId: selectedSession.id,
      siNumber: form.siNumber.trim(),
      studentName: form.studentName.trim(),
      className: form.className.trim(),
      section: form.section.trim(),
      sex: form.sex === 'Female' || form.sex === 'Other' || form.sex === 'Prefer not to specify' ? form.sex : 'Male',
      dateOfBirth: form.dateOfBirth,
      age,
      heightCm,
      weightKg,
      bmi,
      skeletalDeformity: form.skeletalDeformity as StudentRecord['skeletalDeformity'],
      skeletalObservation: form.skeletalObservation.trim(),
      skinThicknessMm,
      midArmCircumferenceCm,
      additionalRemarks: form.additionalRemarks.trim(),
      districtId: selectedSession.districtId,
      talukId: selectedSession.talukId,
      schoolId: selectedSession.schoolId,
      screeningDate,
      status: 'Pending',
    };

    setIsSaving(true);
    try {
      await createStudentScreening({
        organizationId: user.organizationId,
        userId: user.id,
        sessionId: selectedSession.id,
        student: record,
      });
      if (saveAnother.current) {
        setForm({ ...initialForm, sessionId: selectedSession.id });
        setSubmitted(true);
      } else {
        navigate(`/students?sessionId=${encodeURIComponent(selectedSession.id)}`);
      }
      saveAnother.current = false;
    } catch (saveError) {
      console.error('Unable to save the student screening.', saveError);
      setError(saveError instanceof Error ? saveError.message : 'The student screening could not be saved.');
    } finally {
      saveAnother.current = false;
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">Student Screening</h2>
        <button type="button" onClick={() => navigate('/screening-sessions')} className="rounded-xl border border-slate-300 px-4 py-2 font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
      </div>
      {sessionsError && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">Screening sessions could not be loaded: {sessionsError}</div>}
      {!isLoading && !sessionsError && !(sessions ?? []).some((session) => session.status === 'active') && <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">No active screening session is assigned or available to your account. Ask an administrator to create a session or assign you to one.</p>}

      <form onSubmit={(event) => void handleSubmit(event)} className="card space-y-5">
        <div className="rounded-xl bg-cyan-50 p-4 text-sm text-cyan-950">
          <div className="font-semibold">Active screening session</div>
          <label className="mt-2 block font-medium">Session
            <select required value={form.sessionId} onChange={(event) => handleChange('sessionId', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5">
              <option value="">Select a screening session to start</option>
              {(sessions ?? []).filter((session) => session.status === 'active').map((session) => <option key={session.id} value={session.id}>{session.name} · {session.date}</option>)}
            </select>
          </label>
          {selectedSession && <div className="mt-2 grid gap-1 text-slate-700 sm:grid-cols-2">
            <span>School: {selectedSession.schoolName}</span><span>District: {selectedSession.districtName}</span>
            <span>Taluk: {selectedSession.talukName}</span><span>BEO: {selectedSession.beoName}</span>
            <span>Head Master: {selectedSession.headMasterName}</span><span>Screening Faculty: {selectedSession.screeningFacultyName}</span>
          </div>}
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">Student information</h3>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">SI Number<input required value={form.siNumber} onChange={(event) => handleChange('siNumber', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Student Name<input required value={form.studentName} onChange={(event) => handleChange('studentName', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Class<select required value={form.className} onChange={(event) => handleChange('className', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"><option value="">Select class</option>{['1','2','3','4','5','6','7','8','9','10','Other'].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Section<select required value={form.section} onChange={(event) => handleChange('section', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"><option value="">Select section</option>{['A','B','C','D','Other'].map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="text-sm font-medium text-slate-700">Sex<select value={form.sex} onChange={(event) => handleChange('sex', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"><option>Male</option><option>Female</option><option>Other</option><option>Prefer not to specify</option></select></label>
          <label className="text-sm font-medium text-slate-700">Date of Birth<input required type="date" max={screeningDate} value={form.dateOfBirth} onChange={(event) => handleChange('dateOfBirth', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Height (cm)<input required type="number" min="1" step="0.1" value={form.heightCm} onChange={(event) => handleChange('heightCm', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Weight (kg)<input required type="number" min="0.1" step="0.1" value={form.weightKg} onChange={(event) => handleChange('weightKg', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Age at screening<input value={age} readOnly className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">BMI (auto)<input value={bmi || ''} readOnly className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5" /></label>
        </div>

        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">Screening observations</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">Skeletal Deformity
            <select value={form.skeletalDeformity} onChange={(event) => handleChange('skeletalDeformity', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"><option>No</option><option>Yes</option><option>Suspected</option><option>Not assessed</option></select>
          </label>
          {(form.skeletalDeformity === 'Yes' || form.skeletalDeformity === 'Suspected') && <label className="text-sm font-medium text-slate-700">Type / Observation
            <input required value={form.skeletalObservation} onChange={(event) => handleChange('skeletalObservation', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
          </label>}
          <label className="text-sm font-medium text-slate-700">Skin Thickness (mm)<input type="number" min="0" step="0.1" value={form.skinThicknessMm} onChange={(event) => handleChange('skinThicknessMm', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Mid-Arm Circumference (cm)<input type="number" min="0" step="0.1" value={form.midArmCircumferenceCm} onChange={(event) => handleChange('midArmCircumferenceCm', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
        </div>
        <label className="block text-sm font-medium text-slate-700">Additional Remarks
          <textarea rows={3} value={form.additionalRemarks} onChange={(event) => handleChange('additionalRemarks', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" />
        </label>
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            BMI is informational and not diagnostic. {isLocalTestSessionActive() ? 'Local test records stay in this browser and are not sent to Supabase.' : 'Screening data is saved to your organization database.'}
          </p>
          <div className="flex gap-2">
            <button type="submit" onClick={() => { saveAnother.current = false; }} disabled={isSaving || isLoading || Boolean(sessionsError) || !selectedSession} className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Save student</button>
            <button type="submit" onClick={() => { saveAnother.current = true; }} disabled={isSaving || isLoading || Boolean(sessionsError) || !selectedSession} className="rounded-xl bg-cyan-600 px-4 py-2.5 font-medium text-white hover:bg-cyan-500 disabled:opacity-50">{isSaving ? 'Saving…' : 'Save & Add Another'}</button>
          </div>
        </div>

        {submitted && <div role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Student screening saved.</div>}
        {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}
      </form>
    </div>
  );
}
