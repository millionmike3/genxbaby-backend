// src/dashboard/alerts/AlertFeed.tsx
import AlertBadge from "./AlertBadge";

export default function AlertFeed({ alerts }) {
  return (
    <div className="bg-white rounded shadow p-4 border">
      <h2 className="text-lg font-bold mb-4">Fraud Alerts</h2>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{alert.type.replace(/_/g, " ")}</p>
              <p className="text-xs text-gray-500">
                {new Date(alert.timestamp).toLocaleString()}
              </p>
            </div>

            <AlertBadge severity={alert.severity} />
          </div>
        ))}
      </div>
    </div>
  );
}
