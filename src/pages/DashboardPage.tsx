import { AppWindow, Filter, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { appSummaryStats, districtData, screeningSessions, studentRecords } from '../data/mockData';
import { formatNumber } from '../lib/utils';

const summaryCards = [
  { label: 'Total screened', value: formatNumber(appSummaryStats.totalStudentsScreened), icon: Users },
  { label: 'Sessions', value: formatNumber(appSummaryStats.totalSessions), icon: AppWindow },
  { label: 'Active enumerators', value: formatNumber(appSummaryStats.activeEnumerators), icon: ShieldCheck },
  { label: 'Districts', value: formatNumber(appSummaryStats.totalDistricts), icon: TrendingUp },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
              </div>
              <div className="rounded-xl bg-cyan-100 p-3 text-cyan-700">
                <Icon size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">District coverage</h3>
            <Filter className="text-slate-400" size={18} />
          </div>
          <div className="space-y-3">
            {districtData.map((district) => (
              <div key={district.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <span className="font-medium text-slate-700">{district.name}</span>
                <span className="badge bg-emerald-100 text-emerald-700">{district.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent screening activity</h3>
          <div className="space-y-3">
            {screeningSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                <div>
                  <div className="font-medium text-slate-800">{session.name}</div>
                  <div className="text-sm text-slate-500">{session.date}</div>
                </div>
                <span className="badge bg-cyan-100 text-cyan-700">{session.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recorded students</h3>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>SI Number</th>
                <th>Name</th>
                <th>Class</th>
                <th>School</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentRecords.map((student) => (
                <tr key={student.id}>
                  <td>{student.siNumber}</td>
                  <td>{student.studentName}</td>
                  <td>{student.className}</td>
                  <td>{student.schoolId}</td>
                  <td><span className="badge bg-emerald-100 text-emerald-700">{student.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

