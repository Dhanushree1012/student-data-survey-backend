import { LogIn, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@studenthealthhub.in');
  const [password, setPassword] = useState('password123');
  const [role, setRole] = useState<'organization_admin' | 'district_manager' | 'enumerator'>('organization_admin');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(email, password, role);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="bg-slate-950 p-8 text-slate-50">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-300"><ShieldCheck size={18} /></div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">School health</p>
                <h1 className="text-2xl font-bold">Student Health Hub</h1>
              </div>
            </div>
            <h2 className="text-3xl font-bold leading-tight">Secure student screening, reporting, and operations management.</h2>
            <p className="mt-4 max-w-md text-sm text-slate-300">
              Manage health screening sessions, student records, assignments, reporting, and one-click export workflows with role-based access.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Sign in</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Access the application</h3>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
              <select value={role} onChange={(event) => setRole(event.target.value as 'organization_admin' | 'district_manager' | 'enumerator')} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500">
                <option value="organization_admin">Organization Administrator</option>
                <option value="district_manager">District Manager</option>
                <option value="enumerator">Enumerator</option>
              </select>
            </div>

            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-500">
              <LogIn size={18} />
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

