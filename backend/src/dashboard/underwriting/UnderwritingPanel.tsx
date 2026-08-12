import { useEffect, useState } from "react";

export default function UnderwritingPanel({ ownerId, apiUrl }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/underwriting/owner/${ownerId}`)
      .then(res => res.json())
      .then(setData);
  }, [ownerId]);

  if (!data) return null;

  return (
    <div className="gx-card p-6 mt-6">
      <h2 className="text-xl font-bold mb-3">Underwriting Decision</h2>

      <p className="text-3xl font-bold text-blue-400">
        {data.decision}
      </p>

      <h3 className="font-semibold mt-4">Reasons</h3>
      <ul className="list-disc ml-5 text-gray-400">
        {data.reasons.map((r, idx) => (
          <li key={idx}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
