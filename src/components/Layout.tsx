import { Menu, ShieldCheck, UserCircle2 } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatNumber } from '../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/screening-sessions', label: 'Screening Sessions' },
  { to: '/student-registration', label: 'Student Registration' },
  { to: '/students', label: 'Students' },
  { to: '/schools', label: 'Schools' },
  { to: '/districts', label: 'Districts & Taluks' },
  { to: '/enumerators', label: 'Enumerators' },
  { to: '/assignments', label: 'Assignments' },
  { to: '/reports', label: 'Reports' },
  { to: '/audit-logs', label: 'Audit Logs' },
  { to: '/settings', label: 'Settings' },
  { to: '/profile', label: 'Profile' },
];

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 flex w-72 flex-col border-r border-slate-200 bg-slate-950 text-slate-100">
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
          <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-300"><ShieldCheck size={18} /></div>
          <div>
            <div className="text-sm font-semibold tracking-[0.2em] text-cyan-300 uppercase">Student Health</div>
            <div className="text-lg font-bold">Hub</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-cyan-500/15 text-cyan-200' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              <span>{item.label}</span>
              <Menu size={14} className="opacity-80" />
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-800 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-200">
              <UserCircle2 size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{user?.name ?? 'User'}</div>
              <div className="truncate text-xs capitalize text-slate-300">{user?.role.replace('_', ' ')}</div>
            </div>
          </div>
          <button onClick={logout} className="mt-3 w-full rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white hover:bg-slate-600">
            Logout
          </button>
        </div>
      </aside>

      <main className="ml-72 min-h-screen p-6 md:p-8">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">Operations overview</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Student Health Hub</h1>
            </div>
            <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              {user?.role ? user.role.replace('_', ' ') : 'Authenticated'}
            </div>
          </div>

          <div className="mb-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Students</div>
              <div className="mt-2 text-2xl font-bold">{formatNumber(6348)}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Sessions</div>
              <div className="mt-2 text-2xl font-bold">{formatNumber(98)}</div>
            </div>
            <div className="rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Pending sync</div>
              <div className="mt-2 text-2xl font-bold">{formatNumber(24)}</div>
            </div>
          </div>

          <Outlet />
        </div>
      </main>
    </div>
  );
}

