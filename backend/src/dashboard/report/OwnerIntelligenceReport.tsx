import { useEffect, useState } from "react";

export default function OwnerIntelligenceReport({ apiUrl }) {
  const [profile, setProfile] = useState(null);
  const [clusters, setClusters] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [heatmap, setHeatmap] = useState({});

  useEffect(() => {
    fetch(`${apiUrl}/dashboard/ai/risk-profile`)
      .then(r => r.json())
      .then(setProfile);

    fetch(`${apiUrl}/dashboard/ai/fraud-clusters`)
      .then(r => r.json())
      .then(setClusters);

    fetch(`${apiUrl}/dashboard/ai/fraud-timeline`)
      .then(r => r.json())
      .then(setTimeline);

    fetch(`${apiUrl}/dashboard/ai/fraud-heatmap`)
      .then(r => r.json())
      .then(setHeatmap);
  }, []);

  if (!profile) {
    return (
      <div className="p-6 bg-white border rounded shadow">
        Loading Owner Intelligence Report…
      </div>
    );
  }

  const severityColors = {
    HIGH: "text-red-600",
    MEDIUM: "text-yellow-600",
    LOW: "text-green-600",
  };

  return (
    <div className="bg-white border rounded shadow p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Owner Intelligence Report</h1>
        <p className="text-gray-600 text-sm">AI‑Generated Fraud Intelligence Summary</p>
      </div>

      {/* RISK SUMMARY */}
      <div className="border rounded p-6 bg-gray-50">
        <h2 className="text-xl font-bold mb-2">Risk Summary</h2>
        <p className={`text-2xl font-bold ${severityColors[profile.riskLevel]}`}>
          {profile.riskLevel} Risk
        </p>
        <p className="text-gray-700 mt-2">{profile.summary}</p>
      </div>

      {/* RECENT ALERTS */}
      <div>
        <h2 className="text-xl font-bold mb-2">Recent Alerts</h2>
        <ul className="list-disc ml-5 text-gray-700">
          {profile.recentAlerts.map(a => (
            <li key={a.id}>
              {a.type.replace(/_/g, " ")} — {new Date(a.timestamp).toLocaleString()}
            </li>
          ))}
        </ul>
      </div>

      {/* TOP FRAUD DRIVERS */}
      <div>
        <h2 className="text-xl font-bold mb-2">Top Fraud Drivers</h2>
        <ul className="list-disc ml-5 text-gray-700">
          {profile.topDrivers.map(d => (
            <li key={d.id}>
              Check #{d.check.id} — Score {d.score}
            </li>
          ))}
        </ul>
      </div>

      {/* CLUSTER SUMMARY */}
      <div>
        <h2 className="text-xl font-bold mb-2">Fraud Cluster Summary</h2>
        <p className="text-gray-700 mb-3">
          {clusters.length} fraud clusters detected. Largest cluster contains{" "}
          {clusters.length ? clusters[0].alerts.length : 0} events.
        </p>

        <div className="flex flex-wrap gap-4">
          {clusters.map(c => (
            <div
              key={c.id}
              className={`rounded-full w-20 h-20 flex flex-col justify-center items-center text-white shadow ${
                c.severity === "HIGH"
                  ? "bg-red-600"
                  : c.severity === "MEDIUM"
                  ? "bg-yellow-500"
                  : "bg-green-600"
              }`}
            >
              <span className="font-bold">#{c.id}</span>
              <span className="text-xs">{c.size} events</span>
            </div>
          ))}
        </div>
      </div>

      {/* TIMELINE SUMMARY */}
      <div>
        <h2 className="text-xl font-bold mb-2">Fraud Timeline Summary</h2>
        <p className="text-gray-700 mb-3">
          {timeline.length} fraud‑related events recorded chronologically.
        </p>

        <div className="border-l-2 border-gray-300 ml-4">
          {timeline.slice(0, 5).map((e, i) => (
            <div key={i} className="mb-4 ml-4">
              <div
                className={`w-3 h-3 rounded-full ${
                  e.severity === "HIGH"
                    ? "bg-red-600"
                    : e.severity === "MEDIUM"
                    ? "bg-yellow-500"
                    : "bg-green-600"
                }`}
              ></div>
              <div className="ml-4">
                <p className="font-semibold">{e.label}</p>
                <p className="text-xs text-gray-500">
                  {new Date(e.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HEATMAP SUMMARY */}
      <div>
        <h2 className="text-xl font-bold mb-2">Fraud Heatmap Summary</h2>
        <p className="text-gray-700 mb-3">
          {Object.keys(heatmap).length} days with fraud activity detected.
        </p>

        <div className="grid grid-cols-6 gap-2">
          {Object.entries(heatmap).map(([day, score]) => (
            <div
              key={day}
              className={`p-2 text-center rounded text-white ${
                score >= 6 ? "bg-red-600" : score >= 3 ? "bg-yellow-500" : "bg-green-600"
              }`}
            >
              <p className="text-xs">{day}</p>
              <p className="text-xs font-bold">{score}</p>
            </div>
          ))}
        </div>
      </div>

      {/* RECOMMENDED ACTIONS */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-bold mb-2">Recommended Actions</h2>
        <ul className="list-disc ml-5 text-gray-700">
          <li>Review high‑risk checks and documents immediately.</li>
          <li>Investigate clusters with repeated HIGH severity alerts.</li>
          <li>Monitor risk trend daily for worsening patterns.</li>
          <li>Enable automated alerts for future risk spikes.</li>
        </ul>
      </div>
    </div>
  );
}
