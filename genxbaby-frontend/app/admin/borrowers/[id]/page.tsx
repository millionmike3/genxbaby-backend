"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BorrowerCRM({ params }) {
  const { id } = params;
  const [borrower, setBorrower] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/crm/borrower/${id}`);
        const data = await res.json();

        setBorrower(data.borrower);
        setBehavior(data.behavior);
        setChecks(data.checks || []);
      } catch (err) {
        console.error("Borrower CRM error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-xl">Loading borrower CRM…</div>;
  }

  if (!borrower) {
    return <div className="p-10 text-xl">Borrower not found.</div>;
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-[#0f0f0f] text-black dark:text-white space-y-10">
      <Link href="/borrowers" className="text-blue-500 dark:text-blue-400 underline">
        ← Back to Borrowers
      </Link>

      <h1 className="text-3xl font-bold">{borrower.email}</h1>

      {/* Borrower Profile */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">Borrower Profile</h2>
        <p><strong>Email:</strong> {borrower.email}</p>
        <p><strong>Name:</strong> {borrower.name || "N/A"}</p>
        <p><strong>Pipeline Stage:</strong> {borrower.stage || "Unassigned"}</p>
      </div>

      {/* Behavior Profile */}
      {behavior && (
        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow space-y-3">
          <h2 className="text-xl font-semibold">Behavior Profile</h2>
          <p><strong>Sessions:</strong> {behavior.sessionsCount}</p>
          <p><strong>Avg IS:</strong> {behavior.avgImpulsivenessScore.toFixed(1)}</p>
          <p><strong>Max IS:</strong> {behavior.maxImpulsivenessScore.toFixed(1)}</p>

          <p>
            <strong>Level:</strong>{" "}
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                behavior.impulsivenessLevel === "stable"
                  ? "bg-green-600 text-white"
                  : behavior.impulsivenessLevel === "reactive"
                  ? "bg-yellow-500 text-black"
                  : behavior.impulsivenessLevel === "impulsive"
                  ? "bg-orange-600 text-white"
                  : "bg-red-600 text-white"
              }`}
            >
              {behavior.impulsivenessLevel.toUpperCase()}
            </span>
          </p>

          <Link
            href={`/admin/behavior/${behavior.id}`}
            className="text-blue-500 dark:text-blue-400 underline"
          >
            View Behavior →
          </Link>
        </div>
      )}

      {/* Check History */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">Check History</h2>

        {checks.length === 0 && <p>No checks issued.</p>}

        {checks.map((c) => (
          <div key={c.id} className="border-b dark:border-gray-700 pb-3">
            <p><strong>Check #:</strong> {c.checkNumber}</p>
            <p><strong>Amount:</strong> ${c.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(c.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {c.memo || "Issued"}</p>

            <Link
              href={`/verify?checkNumber=${c.checkNumber}`}
              className="text-blue-500 dark:text-blue-400 underline"
            >
              Verify →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
