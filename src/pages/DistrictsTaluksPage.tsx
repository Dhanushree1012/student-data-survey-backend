import { districtData, talukData } from '../data/mockData';

export function DistrictsTaluksPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Districts and Taluks</h2>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Districts</h3>
          <div className="space-y-3">
            {districtData.map((district) => (
              <div key={district.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span>{district.name}</span>
                <span className="text-sm text-slate-600">{district.code}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="mb-4 text-lg font-semibold text-slate-900">Taluks</h3>
          <div className="space-y-3">
            {talukData.map((taluk) => (
              <div key={taluk.id} className="flex items-center justify-between rounded-xl bg-slate-50 p-3">
                <span>{taluk.name}</span>
                <span className="text-sm text-slate-600">{taluk.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

