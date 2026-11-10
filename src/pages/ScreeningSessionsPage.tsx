import { CalendarClock, Plus } from 'lucide-react';
import { screeningSessions } from '../data/mockData';

export function ScreeningSessionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-bold text-slate-900">Screening Sessions</h2>
        <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500">
          <Plus size={16} /> New session
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {screeningSessions.map((session) => (
          <div key={session.id} className="card">
            <div className="flex items-center justify-between">
              <div className="font-semibold text-slate-900">{session.name}</div>
              <span className="badge bg-emerald-100 text-emerald-700">{session.status}</span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><CalendarClock size={16} /> {session.date}</div>
              <div>School ID: {session.schoolId}</div>
              <div>Enumerators: {session.enumerators.length}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

