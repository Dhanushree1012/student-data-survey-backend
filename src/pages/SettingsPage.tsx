export function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><h3 className="font-semibold text-slate-900">Organization configuration</h3><div className="mt-4 space-y-2 text-sm text-slate-600"><div>Retention policy: 7 years</div><div>Reporting timezone: IST</div><div>Sync strategy: background queue</div></div></div>
        <div className="card"><h3 className="font-semibold text-slate-900">Security defaults</h3><div className="mt-4 space-y-2 text-sm text-slate-600"><div>Enforce 2FA for administrators: Yes</div><div>Session expiry: 30 minutes</div><div>Offline policy: cached with expiry</div></div></div>
      </div>
    </div>
  );
}

