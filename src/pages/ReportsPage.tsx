import { useMemo } from 'react';
import { useRemoteData } from '../hooks/useRemoteData';
import { getStudentRecords } from '../lib/dataService';
import { exportCsv } from '../lib/permissions';

export function ReportsPage() {
  const { data: students, isLoading, error, reload } = useRemoteData(getStudentRecords);
  const exportData = useMemo(() => (students ?? []).map((student) => ({
    siNumber: student.siNumber,
    studentName: student.studentName,
    className: student.className,
    section: student.section,
    sex: student.sex,
    dateOfBirth: student.dateOfBirth,
    age: student.age,
    heightCm: student.heightCm,
    weightKg: student.weightKg,
    bmi: student.bmi,
    skeletalDeformity: student.skeletalDeformity,
    skeletalObservation: student.skeletalObservation,
    skinThicknessMm: student.skinThicknessMm,
    midArmCircumferenceCm: student.midArmCircumferenceCm,
    additionalRemarks: student.additionalRemarks,
    districtId: student.districtId,
    talukId: student.talukId,
    schoolId: student.schoolId,
    screeningDate: student.screeningDate,
    status: student.status,
  })), [students]);

  const handleExport = () => {
    try {
      exportCsv('student-health-report.csv', exportData);
    } catch (exportError) {
      console.error('Unable to export the student health report.', exportError);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
          <p className="mt-1 text-sm text-slate-600">Student screenings available to your account.</p>
        </div>
        <button disabled={isLoading || Boolean(error) || exportData.length === 0} onClick={handleExport} className="rounded-xl bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50">Export CSV</button>
      </div>

      {error && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">Report data could not be loaded: {error} <button onClick={reload} className="ml-2 underline">Retry</button></div>}
      {isLoading && <p role="status" className="text-sm text-slate-500">Loading report data…</p>}
      {!isLoading && !error && exportData.length === 0 && <p className="text-sm text-slate-500">No student screenings are available for this report.</p>}

      {!error && exportData.length > 0 && (
        <div className="table-shell">
          <table>
            <thead><tr><th>SI Number</th><th>Name</th><th>Class</th><th>Age</th><th>BMI</th><th>Screening date</th><th>Status</th></tr></thead>
            <tbody>
              {(students ?? []).map((student) => (
                <tr key={student.id}>
                  <td>{student.siNumber}</td><td>{student.studentName}</td><td>{student.className}</td>
                  <td>{student.age}</td><td>{student.bmi}</td><td>{student.screeningDate}</td><td>{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
