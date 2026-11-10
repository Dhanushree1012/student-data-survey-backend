import { useState } from 'react';
import { calculateAge, calculateBmi } from '../lib/permissions';

const initialForm = {
  siNumber: 'SHH-2005',
  studentName: 'Nikhil Gowda',
  className: '8',
  section: 'A',
  sex: 'Male',
  dateOfBirth: '2014-03-18',
  heightCm: '142',
  weightKg: '36',
  districtId: 'dist-1',
  talukId: 'tal-1',
  schoolId: 'sch-1',
};

export function StudentRegistrationPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const heightCm = Number(form.heightCm);
  const weightKg = Number(form.weightKg);
  const age = calculateAge(form.dateOfBirth, '2026-11-10');
  const bmi = calculateBmi(weightKg, heightCm);

  const handleChange = (key: string, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Student Registration</h2>

      <div className="card space-y-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="text-sm font-medium text-slate-700">SI Number<input value={form.siNumber} onChange={(event) => handleChange('siNumber', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Student Name<input value={form.studentName} onChange={(event) => handleChange('studentName', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Class<input value={form.className} onChange={(event) => handleChange('className', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Section<input value={form.section} onChange={(event) => handleChange('section', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Sex<select value={form.sex} onChange={(event) => handleChange('sex', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"><option>Male</option><option>Female</option></select></label>
          <label className="text-sm font-medium text-slate-700">Date of Birth<input type="date" value={form.dateOfBirth} onChange={(event) => handleChange('dateOfBirth', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Height (cm)<input type="number" value={form.heightCm} onChange={(event) => handleChange('heightCm', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Weight (kg)<input type="number" value={form.weightKg} onChange={(event) => handleChange('weightKg', event.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">BMI (auto) <input value={bmi} readOnly className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5" /></label>
          <label className="text-sm font-medium text-slate-700">Auto age <input value={age} readOnly className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5" /></label>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600">BMI values are informational and not diagnostic.</div>
          <button type="button" onClick={() => setSubmitted(true)} className="rounded-xl bg-cyan-600 px-4 py-2.5 font-medium text-white hover:bg-cyan-500">Save record</button>
        </div>

        {submitted && <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Student record saved successfully and queued for sync.</div>}
      </div>
    </div>
  );
}

