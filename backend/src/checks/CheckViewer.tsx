import { useEffect, useState } from "react";

export default function CheckViewer({ apiUrl, checkId }) {
  const [check, setCheck] = useState(null);
  const [events, setEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [flags, setFlags] = useState([]);
  const [sarReports, setSarReports] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadCheck() {
    setLoading(true);

    const res = await fetch(`${apiUrl}/checks/${checkId}`);
    const data = await res.json();

    setCheck(data.check);
    setEvents(data.lifecycleEvents);
    setAuditLogs(data.auditLogs);
    setFlags(data.fraudFlags);
    setSarReports(data.sarReports);

    setLoading(false);
  }

  useEffect(() => {
    if (checkId) loadCheck();
  }, [checkId]);

  async function action(endpoint, body = {}) {
    await fetch(`${apiUrl}/checks/${checkId}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: Object.keys(body).length ? JSON.stringify(body) : undefined,
    });

    loadCheck();
  }

  if (loading || !check) {
    return <div className="p-4 text-gray-600">Loading check…</div>;
  }

  return (
    <div className="bg-white border rounded shadow p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Check #{check.checkNumber}
        </h2>
        <span className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
          {check.status}
        </span>
      </div>

      {/* METADATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-700 mb-2">Check Details</h3>
          <p><strong>Payee:</strong> {check.payee}</p>
          <p><strong>Amount:</strong> ${check.amount.toFixed(2)}</p>
          <p><strong>Date:</strong> {new Date(check.date).toLocaleDateString()}</p>
          <p><strong>Memo:</strong> {check.memo || "—"}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-700 mb-2">Bank & Signer</h3>
          <p><strong>Bank Profile ID:</strong> {check.bankProfileId}</p>
          <p><strong>Signer ID:</strong> {check.signerId}</p>
          <p><strong>Reissued To:</strong> {check.reissuedToId || "—"}</p>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">
        <button onClick={() => action("issue")} className="btn">Issue</button>
        <button onClick={() => action("clear")} className="btn">Clear</button>
        <button onClick={() => action("return")} className="btn">Return</button>
        <button onClick={() => action("void")} className="btn">Void</button>
        <button onClick={() => action("archive")} className="btn">Archive</button>
      </div>

      {/* REISSUE */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold text-gray-700 mb-2">Reissue Check</h3>
        <ReissueForm apiUrl={apiUrl} checkId={checkId} reload={loadCheck} />
      </div>

      {/* LIFECYCLE EVENTS */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Lifecycle History</h3>
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          {events.map((e) => (
            <div key={e.id} className="border-b pb-2">
              <strong>{e.type}</strong> — {new Date(e.timestamp).toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      {/* AUDIT LOGS */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Audit Log</h3>
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="border-b pb-2">
              <strong>{log.action}</strong> — {new Date(log.timestamp).toLocaleString()}
            </div>
          ))}
        </div>
      </div>

      {/* FRAUD FLAGS */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Fraud Flags</h3>
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          {flags.length === 0 && <p>No fraud flags.</p>}
          {flags.map((f) => (
            <div key={f.id} className="border-b pb-2">
              <strong>{f.category}</strong> — {f.message}
            </div>
          ))}
        </div>
      </div>

      {/* SAR REPORTS */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">SAR Reports</h3>
        <div className="bg-gray-50 p-4 rounded border space-y-2">
          {sarReports.length === 0 && <p>No SAR reports.</p>}
          {sarReports.map((s) => (
            <div key={s.id} className="border-b pb-2">
              <strong>{s.reason}</strong> — {new Date(s.createdAt).toLocaleString()}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function ReissueForm({ apiUrl, checkId, reload }) {
  const [newId, setNewId] = useState("");

  async function submit() {
    await fetch(`${apiUrl}/checks/${checkId}/reissue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newCheckId: newId }),
    });

    setNewId("");
    reload();
  }

  return (
    <div className="flex gap-3">
      <input
        className="border rounded px-3 py-2"
        placeholder="New Check ID"
        value={newId}
        onChange={(e) => setNewId(e.target.value)}
      />
      <button onClick={submit} className="btn">Reissue</button>
    </div>
  );
}
