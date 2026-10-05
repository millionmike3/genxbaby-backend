"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function InvestorCRM({ params }) {
  const { id } = params;
  const [investor, setInvestor] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/crm/investor/${id}`);
        const data = await res.json();

        setInvestor(data.investor);
        setBehavior(data.behavior);
        setInvestments(data.investments || []);
      } catch (err) {
        console.error("Investor CRM error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-xl">Loading investor CRM…</div>;
  }

  if (!investor) {
    return <div className="p-10 text-xl">Investor not found.</div>;
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-[#0f0f0f] text-black dark:text-white space-y-10">
      <Link href="/investors" className="text-blue-500 dark:text-blue-400 underline">
        ← Back to Investors
      </Link>

      <h1 className="text-3xl font-bold">{investor.email}</h1>

      {/* Investor Profile */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">Investor Profile</h2>
        <p><strong>Email:</strong> {investor.email}</p>
        <p><strong>Name:</strong> {investor.name || "N/A"}</p>
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

      {/* Investment History */}
      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow space-y-3">
        <h2 className="text-xl font-semibold">Investment History</h2>

        {investments.length === 0 && <p>No investments recorded.</p>}

        {investments.map((inv) => (
          <div key={inv.id} className="border-b dark:border-gray-700 pb-3">
            <p><strong>Amount:</strong> ${inv.amount.toFixed(2)}</p>
            <p><strong>Date:</strong> {new Date(inv.date).toLocaleString()}</p>
            <p><strong>Status:</strong> {inv.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
