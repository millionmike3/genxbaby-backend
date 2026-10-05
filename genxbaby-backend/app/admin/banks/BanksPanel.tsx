// app/admin/banks/BanksPanel.tsx
"use client";

import { useEffect, useState } from "react";

export default function BanksPanel() {
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    fetch("/api/owners/OWNER_ID/banks")
      .then((res) => res.json())
      .then(setBanks);
  }, []);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Bank Profiles</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th>Bank</th>
            <th>Routing</th>
            <th>Account</th>
            <th>Next Check #</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((b: any) => (
            <tr key={b.id}>
              <td>{b.bankName}</td>
              <td>{b.routingNumber}</td>
              <td>{b.accountNumber}</td>
              <td>{b.nextCheckNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
