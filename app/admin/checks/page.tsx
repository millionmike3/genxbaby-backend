"use client";

import { useEffect, useState } from "react";
import AdminIdentityBanner from "@/components/AdminIdentityBanner";

export default function CheckRegistryPage() {
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadChecks() {
    const res = await fetch("/api/checks/list");
    const json = await res.json();
    setChecks(json.checks || []);
    setLoading(false);
  }

  useEffect(() => {
    loadChecks();
  }, []);

  async function voidCheck(id: string) {
    setMessage("Voiding check...");
    const res = await fetch("/api/checks/void", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkId: id }),
    });
    const json = await res.json();
    setMessage(json.success ? "Check voided!" : json.error);
    loadChecks();
  }

  async function reissueCheck(id: string) {
    const newNumber = prompt("Enter new check number:");
    if (!newNumber) return;

    setMessage("Reissuing check...");
    const res = await fetch("/api/checks/reissue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldCheckId: id, newCheckNumber: Number(newNumber) }),
    });
    const json = await res.json();
    setMessage(json.success ? "Check reissued!" : json.error);
    loadChecks();
  }

  async function anchorRoot() {
    setMessage("Anchoring Merkle root...");
    const res = await fetch("/api/checks/anchor", { method: "POST" });
    const json = await res.json();
    setMessage(json.success ? "Root anchored!" : json.error);
  }

  if (loading) return <div className="p-6">Loading checks…</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <AdminIdentityBanner />

      <h1 className="text-2xl font-bold">Check Registry</h1>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-700 rounded">{message}</div>
      )}

      <button
        onClick={anchorRoot}
        className="px-4 py-2 bg-purple-700 text-white rounded"
      >
        Anchor Merkle Root
      </button>

      <table className="w-full text-left mt-4">
        <thead>
          <tr className="border-b">
            <th className="py-2">Check #</th>
            <th className="py-2">Payee</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Memo</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {checks.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2">{c.checkNumber}</td>
              <td className="py-2">{c.payee}</td>
              <td className="py-2">${c.amount}</td>
              <td className="py-2">{c.memo}</td>

              <td className="py-2 space-x-3">
                <button
                  onClick={() => voidCheck(c.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Void
                </button>

                <button
                  onClick={() => reissueCheck(c.id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Reissue
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
