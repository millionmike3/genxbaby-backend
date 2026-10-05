"use client";

import { useEffect, useState } from "react";
import AdminIdentityBanner from "@/components/AdminIdentityBanner";

export default function FraudDetectionPage() {
  const [flags, setFlags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadFlags() {
    const res = await fetch("/api/fraud/list");
    const json = await res.json();
    setFlags(json.flags || []);
    setLoading(false);
  }

  useEffect(() => {
    loadFlags();
  }, []);

  async function resolveFlag(id: string) {
    setMessage("Resolving flag...");
    const res = await fetch("/api/fraud/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    setMessage(json.success ? "Flag resolved!" : json.error);
    loadFlags();
  }

  if (loading) return <div className="p-6">Loading fraud flags…</div>;

  const activeFlags = flags.filter((f) => !f.resolved);
  const resolvedFlags = flags.filter((f) => f.resolved);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <AdminIdentityBanner />

      <h1 className="text-2xl font-bold">Fraud Detection</h1>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-700 rounded">{message}</div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-red-100 text-red-700 rounded">
          <h3 className="font-bold text-lg">Active Flags</h3>
          <p className="text-3xl">{activeFlags.length}</p>
        </div>

        <div className="p-4 bg-yellow-100 text-yellow-700 rounded">
          <h3 className="font-bold text-lg">Warnings</h3>
          <p className="text-3xl">
            {activeFlags.filter((f) => f.severity === "warning").length}
          </p>
        </div>

        <div className="p-4 bg-green-100 text-green-700 rounded">
          <h3 className="font-bold text-lg">Resolved</h3>
          <p className="text-3xl">{resolvedFlags.length}</p>
        </div>
      </div>

      {/* Active Flags Table */}
      <h2 className="text-xl font-semibold mt-6">Active Fraud Flags</h2>

      <table className="w-full text-left mt-2">
        <thead>
          <tr className="border-b">
            <th className="py-2">Type</th>
            <th className="py-2">Severity</th>
            <th className="py-2">Message</th>
            <th className="py-2">Check #</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {activeFlags.map((f) => (
            <tr key={f.id} className="border-b">
              <td className="py-2">{f.type}</td>
              <td className="py-2">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    f.severity === "critical"
                      ? "bg-red-600"
                      : f.severity === "warning"
                      ? "bg-yellow-600"
                      : "bg-gray-600"
                  }`}
                >
                  {f.severity}
                </span>
              </td>
              <td className="py-2">{f.message}</td>
              <td className="py-2">{f.check.checkNumber}</td>

              <td className="py-2">
                <button
                  onClick={() => resolveFlag(f.id)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Resolve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Resolved Flags */}
      <h2 className="text-xl font-semibold mt-6">Resolved Flags</h2>

      <table className="w-full text-left mt-2">
        <thead>
          <tr className="border-b">
            <th className="py-2">Type</th>
            <th className="py-2">Severity</th>
            <th className="py-2">Message</th>
            <th className="py-2">Check #</th>
          </tr>
        </thead>

        <tbody>
          {resolvedFlags.map((f) => (
            <tr key={f.id} className="border-b">
              <td className="py-2">{f.type}</td>
              <td className="py-2">{f.severity}</td>
              <td className="py-2">{f.message}</td>
              <td className="py-2">{f.check.checkNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
