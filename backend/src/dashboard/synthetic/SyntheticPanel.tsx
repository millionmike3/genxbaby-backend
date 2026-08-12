import { useEffect, useState } from "react";

export default function SyntheticPanel({ ownerId, apiUrl }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/synthetic/owner/${ownerId}`)
      .then(res => res.json())
      .then(setData);
  }, [ownerId]);

  if (!data) return null;

  return (
    <div className="gx-card p-6 mt-6">
      <h2 className="text-xl font-bold mb-3">Synthetic Identity</h2>

      <p className="text-3xl font-bold text-yellow-400">
        Score: {data.syntheticScore}
      </p>

      <h3 className="font-semibold mt-4">Signals</h3>
      <ul className="list-disc ml-5 text-gray-400">
        {data.signals.map((s, idx) => (
          <li key={idx}>{s}</li>
        ))}
      </ul>
    </div>
  );
}
