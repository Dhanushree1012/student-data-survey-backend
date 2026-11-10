import { getEnumerators } from '../lib/dataService';
import { useRemoteData } from '../hooks/useRemoteData';

export function EnumeratorsPage() {
  const { data: enumerators, isLoading, error, reload } = useRemoteData(getEnumerators);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Enumerators</h2>
      {error && <div role="alert" className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">Enumerator accounts could not be loaded: {error} <button onClick={reload} className="ml-2 underline">Retry</button></div>}
      {isLoading && <p role="status" className="text-sm text-slate-500">Loading enumerators…</p>}
      {!isLoading && !error && enumerators?.length === 0 && <p className="text-sm text-slate-500">No enumerator profiles are configured.</p>}
      {!error && (enumerators?.length ?? 0) > 0 && (
        <div className="table-shell">
          <table>
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>District</th></tr></thead>
            <tbody>
              {(enumerators ?? []).map((enumerator) => (
                <tr key={enumerator.id}>
                  <td>{enumerator.name}</td><td>{enumerator.email}</td>
                  <td className="capitalize">{enumerator.role.replace('_', ' ')}</td>
                  <td>{enumerator.districtId ?? 'Not assigned'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
