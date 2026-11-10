import { getAuditLogs } from '../lib/dataService';
import { useRemoteData } from '../hooks/useRemoteData';

export function AuditLogsPage() {
  const { data: logs, isLoading, error, reload } = useRemoteData(getAuditLogs);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Audit Logs</h2>
      {error && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">Audit logs could not be loaded: {error} <button onClick={reload} className="ml-2 underline">Retry</button></div>}
      {isLoading && <p role="status" className="text-sm text-slate-500">Loading audit logs…</p>}
      {!isLoading && !error && logs?.length === 0 && <p className="text-sm text-slate-500">No auditable changes have been recorded.</p>}
      {!error && (logs?.length ?? 0) > 0 && (
        <div className="table-shell">
          <table>
            <thead><tr><th>Actor ID</th><th>Action</th><th>Record type</th><th>Timestamp</th><th>Metadata</th></tr></thead>
            <tbody>
              {(logs ?? []).map((log) => (
                <tr key={log.id}>
                  <td>{log.actor}</td><td>{log.action}</td><td>{log.recordType}</td><td>{log.timestamp}</td><td>{log.metadata}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
