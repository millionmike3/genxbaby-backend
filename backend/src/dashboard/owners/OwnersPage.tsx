import { useEffect, useState } from "react";
import OwnerDrawer from "./OwnerDrawer";

export default function OwnersPage({ apiUrl }) {
  const [owners, setOwners] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${apiUrl}/owners`)
      .then(res => res.json())
      .then(setOwners);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Owners</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-400">
            <th>Name</th>
            <th>Email</th>
            <th>Risk</th>
            <th>Fraud</th>
            <th>Synthetic</th>
          </tr>
        </thead>

        <tbody>
          {owners.map(o => (
            <tr
              key={o.id}
              className="border-b border-gray-700 hover:bg-white/5 cursor-pointer"
              onClick={() => setSelected(o.id)}
            >
              <td>{o.fullName}</td>
              <td>{o.email}</td>
              <td>{o.riskScore}</td>
              <td>{o.fraudScore}</td>
              <td>{o.syntheticScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <OwnerDrawer
          ownerId={selected}
          apiUrl={apiUrl}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
