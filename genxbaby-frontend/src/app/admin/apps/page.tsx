async function fetchApplications() {
  const res = await fetch("http://localhost:4000/underwriting/apps"); // you’ll add this route
  return res.json();
}

export default async function ApplicationsPage() {
  const apps = await fetchApplications();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Applications</h2>
      <table className="w-full text-sm border border-slate-800 rounded-lg overflow-hidden">
        <thead className="bg-slate-900">
          <tr>
            <th className="px-3 py-2 text-left">Borrower</th>
            <th className="px-3 py-2 text-left">Amount</th>
            <th className="px-3 py-2 text-left">Status</th>
            <th className="px-3 py-2 text-left">Risk Tier</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {apps.map((app: any) => (
            <tr key={app.id} className="border-t border-slate-800">
              <td className="px-3 py-2">{app.borrower.fullName}</td>
              <td className="px-3 py-2">${app.amount.toLocaleString()}</td>
              <td className="px-3 py-2">{app.decisionStatus || "PENDING"}</td>
              <td className="px-3 py-2">{app.decisionTier || "-"}</td>
              <td className="px-3 py-2 text-right">
                <a
                  href={`/admin/apps/${app.id}`}
                  className="text-indigo-400 hover:underline"
                >
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
