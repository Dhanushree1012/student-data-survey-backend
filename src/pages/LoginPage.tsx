import { LogIn, ShieldCheck } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';
import { isLocalTestLoginEnabled } from '../lib/localTestMode';

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsLocalTestEnumerator, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isStartingLocalSession, setIsStartingLocalSession] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (loginError) {
      console.error('Unable to sign in.', loginError);
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Try again.');
    }
  };

  const handleLocalTestLogin = async () => {
    setError('');
    setIsStartingLocalSession(true);
    try {
      await loginAsLocalTestEnumerator();
      navigate('/dashboard');
    } catch (loginError) {
      console.error('Unable to start local test session.', loginError);
      setError(loginError instanceof Error ? loginError.message : 'Unable to start local test session.');
    } finally {
      setIsStartingLocalSession(false);
    }
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
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">Supabase sign in</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Access the application</h3>
            </div>

            {!isSupabaseConfigured && (
              <div role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Backend not configured. Add your Supabase project URL and public anon key to a local <code>.env</code> file, then restart the app.
              </div>
            )}
            {authError && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{authError}</div>}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-cyan-500" />
            </div>

            {error && <div role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</div>}

            <button type="submit" disabled={!isSupabaseConfigured} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50">
              <LogIn size={18} />
              Sign in
            </button>
            {isLocalTestLoginEnabled && (
              <div className="space-y-2 border-t border-slate-200 pt-4">
                <p className="text-xs text-amber-800">Temporary local test access. This is not a real account and will not sync data to Supabase.</p>
                <button type="button" onClick={() => void handleLocalTestLogin()} disabled={isStartingLocalSession} className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 font-semibold text-amber-950 hover:bg-amber-100 disabled:opacity-50">
                  {isStartingLocalSession ? 'Starting…' : 'Continue as local enumerator'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
