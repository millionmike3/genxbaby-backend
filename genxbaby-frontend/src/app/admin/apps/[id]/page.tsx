async function fetchUnderwriting(id: string) {
  const res = await fetch(`http://localhost:4000/underwriting/${id}`);
  return res.json();
}

export default async function ApplicationDetail({ params }: { params: { id: string } }) {
  const file = await fetchUnderwriting(params.id);

  const app = file.application;
  const borrower = app.borrower;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {borrower.fullName} — ${app.amount.toLocaleString()}
        </h2>
        <span className="text-sm text-slate-400">
          Status: {file.decision?.decision || "PENDING"}
        </span>
      </div>

      {/* Risk + pricing */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm text-slate-300">Risk Score</h3>
          <p className="mt-2 text-3xl font-semibold">{file.riskScore || "-"}</p>
          <p className="mt-1 text-sm text-slate-400">Tier: {file.decisionTier || "-"}</p>
        </div>
        <div className="border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm text-slate-300">Pricing</h3>
          <p className="mt-2 text-2xl font-semibold">
            {file.decisionRate ? `${file.decisionRate}%` : "-"}
          </p>
        </div>
        <div className="border border-slate-800 rounded-lg p-4">
          <h3 className="text-sm text-slate-300">Polygon Anchoring</h3>
          <p className="mt-2 text-sm text-slate-400">
            {file.polygonTxHash ? (
              <a
                href={`https://amoy.polygonscan.com/tx/${file.polygonTxHash}`}
                className="text-indigo-400 hover:underline"
                target="_blank"
              >
                {file.polygonTxHash}
              </a>
            ) : (
              "Not anchored"
            )}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <form
          action={`http://localhost:4000/underwriting/decision`}
          method="post"
          className="flex gap-2"
        >
          <input type="hidden" name="applicationId" value={app.id} />
          <button
            name="status"
            value="APPROVED"
            className="px-4 py-2 rounded bg-emerald-600 text-sm"
          >
            Approve
          </button>
          <button
            name="status"
            value="DECLINED"
            className="px-4 py-2 rounded bg-rose-600 text-sm"
          >
            Decline
          </button>
          <button
            name="status"
            value="NEEDS_MORE_INFO"
            className="px-4 py-2 rounded bg-amber-500 text-sm"
          >
            Needs More Info
          </button>
        </form>

        <form
          action={`http://localhost:4000/underwriting/anchor`}
          method="post"
        >
          <input type="hidden" name="applicationId" value={app.id} />
          <button className="px-4 py-2 rounded bg-indigo-600 text-sm">
            Anchor on Polygon
          </button>
        </form>
      </div>
    </div>
  );
}
