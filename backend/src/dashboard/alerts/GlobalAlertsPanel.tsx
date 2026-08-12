import { useEffect, useState } from "react";

export default function GlobalAlertsPanel({ apiUrl }) {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/alerts`)
      .then(res => res.json())
      .then(setAlerts);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Alerts</h2>

      {alerts.map(a => (
        <div key={a.id} className="gx-card p-4 mb-3">
          <p className="font-semibold">{a.type}</p>
          <p className="gx-text-muted">{a.message}</p>
          <p className="text-sm text-gray-500">
            Severity: {a.severity}
          </p>
          <p className="text-sm text-gray-500">
            Owner: {a.ownerId}
          </p>
        </div>
      ))}
    </div>
  );
}
