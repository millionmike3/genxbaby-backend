// src/dashboard/alerts/AlertToast.tsx
import AlertBadge from "./AlertBadge";

export default function AlertToast({ alert }) {
  return (
    <div className="fixed top-4 right-4 bg-white shadow-xl border-l-4 border-red-600 rounded p-4 w-80 animate-slide-in">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-red-700">Fraud Alert</h3>
        <AlertBadge severity={alert.severity} />
      </div>

      <p className="text-sm mt-2">
        {alert.type.replace(/_/g, " ")}
      </p>

      <p className="text-xs text-gray-500 mt-1">
        {new Date(alert.timestamp).toLocaleString()}
      </p>
    </div>
  );
}
