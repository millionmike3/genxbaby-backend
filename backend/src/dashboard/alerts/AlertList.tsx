import AlertBadge from "./AlertBadge";

export default function AlertList({ alerts }) {
  if (!alerts.length) {
    return <p className="text-gray-500">No alerts found.</p>;
  }

  return (
    <div className="space-y-3">
      {alerts.map((a) => (
        <div
          key={a.id}
          className="border rounded p-4 flex justify-between items-center"
        >
          <div>
            <p className="font-bold">{a.type.replace(/_/g, " ")}</p>
            <p className="text-xs text-gray-500">
              {new Date(a.timestamp).toLocaleString()}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Source: {a.source}
            </p>
          </div>

          <AlertBadge severity={a.riskLevel} />
        </div>
      ))}
    </div>
  );
}
