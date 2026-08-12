import { useEffect, useState } from "react";
import FraudGraph from "./FraudGraph";

export default function FraudDashboard({ ownerId, apiUrl }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`${apiUrl}/fraud/owner/${ownerId}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [ownerId]);

  if (loading || !data) {
    return <div className="gx-card p-6">Loading fraud intelligence…</div>;
  }

  const { score, routingClusters, deviceClusters, graph } = data;

  return (
    <div className="space-y-6 p-6">

      {/* HEADER */}
      <div className="gx-card p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold gx-text-primary">
          Fraud Intelligence Dashboard
        </h1>
        <span className="px-4 py-2 rounded-lg bg-red-600 text-white text-lg font-semibold">
          Fraud Score: {score.score}
        </span>
      </div>

      {/* SCORE + ISSUES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* SCORE PANEL */}
        <div className="gx-card p-6">
          <h2 className="text-xl font-semibold mb-3">Fraud Score</h2>
          <p className="text-4xl font-bold text-red-500">{score.score}</p>

          <h3 className="mt-4 font-semibold">Issues</h3>
          <ul className="list-disc ml-5 text-gray-400">
            {score.issues.length === 0 && <li>No issues detected.</li>}
            {score.issues.map((i, idx) => (
              <li key={idx}>{i}</li>
            ))}
          </ul>
        </div>

        {/* ROUTING CLUSTERS */}
        <div className="gx-card p-6">
          <h2 className="text-xl font-semibold mb-3">Routing Clusters</h2>
          {routingClusters.length === 0 && (
            <p className="gx-text-muted">No routing clusters detected.</p>
          )}
          {routingClusters.map((c) => (
            <div key={c.id} className="border-b border-gray-700 py-2">
              <p className="font-semibold">{c.fullName}</p>
              <p className="gx-text-muted">{c.email}</p>
            </div>
          ))}
        </div>

        {/* DEVICE CLUSTERS */}
        <div className="gx-card p-6">
          <h2 className="text-xl font-semibold mb-3">Device Clusters</h2>
          {deviceClusters.length === 0 && (
            <p className="gx-text-muted">No device clusters detected.</p>
          )}
          {deviceClusters.map((c) => (
            <div key={c.id} className="border-b border-gray-700 py-2">
              <p className="font-semibold">{c.fullName}</p>
              <p className="gx-text-muted">{c.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FRAUD GRAPH */}
      <FraudGraph data={graph} />

      {/* ACTIONS */}
      <div className="gx-card p-6 flex gap-4">
        <button
          className="gx-btn-primary"
          onClick={() => alert("Case escalated to fraud team")}
        >
          Escalate Case
        </button>

        <button
          className="gx-btn-secondary"
          onClick={load}
        >
          Refresh Intelligence
        </button>
      </div>
    </div>
  );
}
