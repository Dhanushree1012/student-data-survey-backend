import { schoolData } from '../data/mockData';

export function SchoolsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Schools</h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {schoolData.map((school) => (
          <div key={school.id} className="card">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900">{school.name}</h3>
              <span className="badge bg-emerald-100 text-emerald-700">{school.status}</span>
            </div>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div>School code: {school.code}</div>
              <div>District ID: {school.districtId}</div>
              <div>Taluk ID: {school.talukId}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

