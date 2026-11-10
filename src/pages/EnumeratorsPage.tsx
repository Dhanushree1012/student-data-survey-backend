import { users } from '../data/mockData';

export function EnumeratorsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Enumerators</h2>
      <div className="table-shell">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Assigned schools</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td className="capitalize">{user.role.replace('_', ' ')}</td>
                <td>{user.schoolIds?.join(', ') ?? 'Not assigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

