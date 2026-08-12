import { useEffect, useState } from "react";

export default function FraudClusterMap({ apiUrl }) {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/dashboard/ai/fraud-clusters`)
      .then((r) => r.json())
      .then((data) => setClusters(data));
  }, []);

  const severityColors = {
    HIGH: "bg-red-600",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-600",
  };

  return (
    <div className="bg-white border rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">Fraud Cluster Map</h2>

      <div className="flex flex-wrap gap-4">
        {clusters.map((cluster) => (
          <div
            key={cluster.id}
            className={`rounded-full w-24 h-24 flex flex-col justify-center items-center text-white shadow ${severityColors[cluster.severity]}`}
          >
            <span className="text-lg font-bold">#{cluster.id}</span>
            <span className="text-sm">{cluster.size} alerts</span>
            <span className="text-xs">{cluster.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
