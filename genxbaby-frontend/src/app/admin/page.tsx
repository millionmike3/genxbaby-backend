export default async function AdminHome() {
  // later: fetch metrics from /admin/metrics
  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-lg border border-slate-800 p-4">
        <h2 className="text-sm font-medium text-slate-300">Active Applications</h2>
        <p className="mt-2 text-3xl font-semibold">24</p>
      </div>
      <div className="rounded-lg border border-slate-800 p-4">
        <h2 className="text-sm font-medium text-slate-300">Approved</h2>
        <p className="mt-2 text-3xl font-semibold text-emerald-400">12</p>
      </div>
      <div className="rounded-lg border border-slate-800 p-4">
        <h2 className="text-sm font-medium text-slate-300">Anchored on Polygon</h2>
        <p className="mt-2 text-3xl font-semibold text-indigo-400">7</p>
      </div>
    </div>
  );
}
