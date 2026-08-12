import { useEffect, useState } from "react";

export default function OwnerDashboard({ apiUrl, ownerId }) {
  const [owner, setOwner] = useState(null);
  const [duplicates, setDuplicates] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadOwner() {
    setLoading(true);

    const res = await fetch(`${apiUrl}/owners/${ownerId}`);
    const data = await res.json();

    setOwner(data.owner);
    setDuplicates(data.duplicates);
    setClusters(data.clusters);

    setLoading(false);
  }

  useEffect(() => {
    if (ownerId) loadOwner();
  }, [ownerId]);

  async function verify(status) {
    await fetch(`${apiUrl}/owners/${ownerId}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    loadOwner();
  }

  async function recalcRisk() {
    await fetch(`${apiUrl}/owners/${ownerId}/risk`, {
      method: "POST",
    });

    loadOwner();
  }

  if (loading || !owner) {
    return <div className="p-4 text-gray-600">Loading owner…</div>;
  }

  return (
    <div className="bg-white border rounded shadow p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">
          {owner.fullName}
        </h2>
        <span className="px-3 py-1 rounded bg-blue-600 text-white text-sm">
          {owner.verificationStatus}
        </span>
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-700 mb-2">Identity</h3>
          <p><strong>Email:</strong> {owner.email || "—"}</p>
          <p><strong>Phone:</strong> {owner.phone || "—"}</p>
          <p><strong>DOB:</strong> {owner.dob ? new Date(owner.dob).toLocaleDateString() : "—"}</p>
          <p><strong>Address:</strong> {owner.primaryAddress || "—"}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-700 mb-2">Risk</h3>
          <p><strong>Risk Score:</strong> {owner.riskScore}</p>
          <p><strong>Risk Level:</strong> {owner.riskLevel}</p>

          <button onClick={recalcRisk} className="btn mt-3">
            Recalculate Risk
          </button>
        </div>
      </div>

      {/* VERIFICATION ACTIONS */}
      <div className="bg-gray-50 p-4 rounded border">
        <h3 className="font-semibold text-gray-700 mb-2">Verification</h3>

        <div className="flex gap-3">
          <button onClick={() => verify("VERIFIED")} className="btn">
            Mark Verified
          </button>
          <button onClick={() => verify("HIGH_RISK")} className="btn bg-red-600 hover:bg-red-700">
            Mark High Risk
          </button>
          <button onClick={() => verify("SYNTHETIC_SUSPECT")} className="btn bg-yellow-600 hover:bg-yellow-700">
            Mark Synthetic
          </button>
        </div>
      </div>

      {/* FRAUD FLAGS */}
      <Section title="Fraud Flags">
        {owner.fraudFlags.length === 0 && <p>No fraud flags.</p>}
        {owner.fraudFlags.map((f) => (
          <div key={f.id} className="border-b pb-2">
            <strong>{f.type}</strong> — {f.message} ({f.severity})
          </div>
        ))}
      </Section>

      {/* SAR REPORTS */}
      <Section title="SAR Reports">
        {owner.sarReports.length === 0 && <p>No SAR reports.</p>}
        {owner.sarReports.map((s) => (
          <div key={s.id} className="border-b pb-2">
            <strong>{s.type}</strong> — {s.summary}
          </div>
        ))}
      </Section>

      {/* IDENTITY EVENTS */}
      <Section title="Identity Events">
        {owner.identityEvents.map((e) => (
          <div key={e.id} className="border-b pb-2">
            <strong>{e.type}</strong> — {new Date(e.timestamp).toLocaleString()}
          </div>
        ))}
      </Section>

      {/* ACCOUNTS */}
      <Section title="Bank Accounts">
        {owner.accounts.map((a) => (
          <div key={a.id} className="border-b pb-2">
            <strong>{a.routingNumber}</strong> — {a.accountNumber}
          </div>
        ))}
      </Section>

      {/* DEVICES */}
      <Section title="Devices">
        {owner.devices.map((d) => (
          <div key={d.id} className="border-b pb-2">
            <strong>{d.deviceId}</strong> — Last Seen: {new Date(d.lastSeen).toLocaleString()}
          </div>
        ))}
      </Section>

      {/* DOCUMENTS */}
      <Section title="Documents">
        {owner.documents.map((doc) => (
          <div key={doc.id} className="border-b pb-2">
            <strong>{doc.fileName}</strong> — {doc.status}
          </div>
        ))}
      </Section>

      {/* CHECKS */}
      <Section title="Checks">
        {owner.checks.map((c) => (
          <div key={c.id} className="border-b pb-2">
            <strong>#{c.checkNumber}</strong> — {c.status} — ${c.amount}
          </div>
        ))}
      </Section>

      {/* DUPLICATES */}
      <Section title="Possible Duplicate Identities">
        {duplicates.length === 0 && <p>No duplicates detected.</p>}
        {duplicates.map((d) => (
          <div key={d.id} className="border-b pb-2">
            {d.fullName} — {d.email}
          </div>
        ))}
      </Section>

      {/* FRAUD CLUSTERS */}
      <Section title="Fraud Clusters">
        {clusters.length === 0 && <p>No fraud clusters detected.</p>}
        {clusters.map((c) => (
          <div key={c.id} className="border-b pb-2">
            {c.fullName} — {c.email}
          </div>
        ))}
      </Section>

    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
      <div className="bg-gray-50 p-4 rounded border space-y-2">
        {children}
      </div>
    </div>
  );
}
