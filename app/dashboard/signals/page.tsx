"use client";

import { useState } from "react";

export default function SignalsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="gx-text-primary text-2xl font-bold">Signals</h1>
      </div>

      {/* FILTERS */}
      <div className="gx-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="gx-text-secondary text-sm">Search</label>
          <input
            type="text"
            placeholder="Search borrower, investor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary"
          />
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Signal Type</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>All</option>
            <option>Borrower</option>
            <option>Property</option>
            <option>UltraFavorable</option>
          </select>
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Score Threshold</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>Any</option>
            <option>80+</option>
            <option>90+</option>
            <option>95+</option>
          </select>
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Status</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>All</option>
            <option>New</option>
            <option>Reviewed</option>
            <option>Matched</option>
          </select>
        </div>
      </div>

      {/* SIGNALS TABLE */}
      <div className="gx-card p-6">
        <h2 className="gx-text-primary text-lg font-semibold mb-4">Recent Signals</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="gx-text-secondary text-sm border-b border-[#2A2A33]">
                <th className="py-2">Score</th>
                <th className="py-2">Borrower</th>
                <th className="py-2">Investor</th>
                <th className="py-2">Type</th>
                <th className="py-2">Timestamp</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="gx-text-secondary">
              {sampleSignals.map((signal, idx) => (
                <tr key={idx} className="border-b border-[#1A1A22] hover:bg-white/5 transition">
                  <td className="py-3">
                    <ScoreChip score={signal.score} />
                  </td>
                  <td className="py-3">{signal.borrower}</td>
                  <td className="py-3">{signal.investor}</td>
                  <td className="py-3">{signal.type}</td>
                  <td className="py-3">{signal.time}</td>
                  <td className="py-3">
                    <StatusBadge status={signal.status} />
                  </td>
                  <td className="py-3 text-right">
                    <button className="gx-btn-secondary px-3 py-1 text-sm">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

/* ---------------- SAMPLE DATA ---------------- */

const sampleSignals = [
  {
    score: 92,
    borrower: "John Doe",
    investor: "CapitalOne Partners",
    type: "Borrower",
    time: "2m ago",
    status: "New",
  },
  {
    score: 88,
    borrower: "Sarah Lee",
    investor: "BlueRock Funding",
    type: "Property",
    time: "10m ago",
    status: "Reviewed",
  },
  {
    score: 97,
    borrower: "Michael Turner",
    investor: "PrimeVest",
    type: "UltraFavorable",
    time: "22m ago",
    status: "Matched",
  },
];

/* ---------------- COMPONENTS ---------------- */

function ScoreChip({ score }: { score: number }) {
  const color =
    score >= 95
      ? "bg-green-600"
      : score >= 90
      ? "bg-blue-600"
      : "bg-purple-600";

  return (
    <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${color}`}>
      {score}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    New: "bg-blue-600",
    Reviewed: "bg-yellow-600",
    Matched: "bg-green-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}
