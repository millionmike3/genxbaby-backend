import { useEffect, useState } from "react";

export default function FraudTimeline({ apiUrl }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/dashboard/ai/fraud-timeline`)
      .then((r) => r.json())
      .then((data) => setEvents(data));
  }, []);

  const colors = {
    HIGH: "bg-red-600",
    MEDIUM: "bg-yellow-500",
    LOW: "bg-green-600",
  };

  return (
    <div className="bg-white border rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">Fraud Timeline</h2>

      <div className="relative border-l-2 border-gray-300 ml-4">
        {events.map((e, i) => (
          <div key={i} className="mb-6 ml-4">
            <div className={`w-4 h-4 rounded-full ${colors[e.severity]} shadow`}></div>
            <div className="ml-6">
              <p className="font-semibold">{e.label}</p>
              <p className="text-xs text-gray-500">
                {new Date(e.timestamp).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Type: {e.type}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
