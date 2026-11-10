import { screeningSessions } from '../data/mockData';

export function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Assignments</h2>
      <div className="table-shell">
        <table>
          <thead><tr><th>Session</th><th>Assigned enumerators</th><th>Status</th></tr></thead>
          <tbody>
            {screeningSessions.map((session) => (
              <tr key={session.id}>
                <td>{session.name}</td>
                <td>{session.enumerators.join(', ')}</td>
                <td><span className="badge bg-emerald-100 text-emerald-700">{session.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

