import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
      <div className="card max-w-xl">
        <div className="space-y-3 text-sm text-slate-700">
          <div><span className="font-semibold">Name:</span> {user?.name}</div>
          <div><span className="font-semibold">Email:</span> {user?.email}</div>
          <div><span className="font-semibold">Role:</span> {user?.role.replace('_', ' ')}</div>
          <div><span className="font-semibold">District:</span> {user?.districtId ?? 'Organization-wide'}</div>
        </div>
      </div>
    </div>
  );
}

