import { auditLogs } from '../data/mockData';

export function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Audit Logs</h2>
      <div className="table-shell">
        <table>
          <thead><tr><th>Actor</th><th>Action</th><th>Record type</th><th>Metadata</th></tr></thead>
          <tbody>
            {auditLogs.map((log) => (
              <tr key={log.id}><td>{log.actor}</td><td>{log.action}</td><td>{log.recordType}</td><td>{log.metadata}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

