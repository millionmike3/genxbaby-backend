import { useEffect, useState } from "react";

export default function RiskProfileCard({ apiUrl }) {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/dashboard/ai/risk-profile`)
      .then((r) => r.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) {
    return <div className="p-4 bg-white border rounded shadow">Loading risk profile…</div>;
  }

  const colors = {
    HIGH: "bg-red-600 text-white",
    MEDIUM: "bg-yellow-500 text-black",
    LOW: "bg-green-600 text-white",
  };

  return (
    <div className="bg-white border rounded shadow p-6 space-y-4">
      <h2 className="text-xl font-bold">Owner Risk Profile</h2>

      <div className={`px-4 py-2 rounded font-bold inline-block ${colors[profile.riskLevel]}`}>
        {profile.riskLevel} Risk
      </div>

      <p className="text-gray-700">{profile.summary}</p>

      <div>
        <h3 className="font-semibold mb-2">Recent Alerts</h3>
        <ul className="list-disc ml-5 text-sm text-gray-600">
          {profile.recentAlerts.map((a) => (
            <li key={a.id}>{a.type.replace(/_/g, " ")}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Top Fraud Drivers</h3>
        <ul className="list-disc ml-5 text-sm text-gray-600">
          {profile.topDrivers.map((d) => (
            <li key={d.id}>Check #{d.check.id} — Score {d.score}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
