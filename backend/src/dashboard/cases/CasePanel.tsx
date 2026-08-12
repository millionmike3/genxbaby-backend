import { useEffect, useState } from "react";

export default function CasePanel({ ownerId, apiUrl }) {
  const [cases, setCases] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/cases/owner/${ownerId}`)
      .then(res => res.json())
      .then(setCases);
  }, [ownerId]);

  return (
    <div className="gx-card p-6 mt-6">
      <h2 className="text-xl font-bold mb-3">Cases</h2>

      {cases.length === 0 && (
        <p className="gx-text-muted">No cases found.</p>
      )}

      {cases.map(c => (
        <div key={c.id} className="border-b border-gray-700 py-2">
          <p className="font-semibold">Case #{c.id}</p>
          <p>Status: {c.status}</p>
        </div>
      ))}
    </div>
  );
}
