import { auditLogs } from '../data/mockData';
import { exportCsv } from '../lib/permissions';

const exportData = auditLogs.map((entry) => ({
  actor: entry.actor,
  action: entry.action,
  recordType: entry.recordType,
  timestamp: entry.timestamp,
}));

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Reports</h2>
        <button onClick={() => exportCsv('student-health-report.csv', exportData)} className="rounded-xl bg-cyan-600 px-4 py-2 font-medium text-white hover:bg-cyan-500">Export CSV</button>
      </div>

      <div className="table-shell">
        <table>
          <thead><tr><th>Actor</th><th>Action</th><th>Record type</th><th>Timestamp</th></tr></thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}><td>{log.actor}</td><td>{log.action}</td><td>{log.recordType}</td><td>{log.timestamp}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

