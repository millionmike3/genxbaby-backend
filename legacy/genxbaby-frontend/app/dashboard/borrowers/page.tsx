"use client";

import { useState } from "react";

export default function BorrowersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="gx-text-primary text-2xl font-bold">Borrowers</h1>
      </div>

      {/* FILTERS */}
      <div className="gx-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="gx-text-secondary text-sm">Search</label>
          <input
            type="text"
            placeholder="Search borrowers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary"
          />
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Loan Status</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>All</option>
            <option>New</option>
            <option>In Review</option>
            <option>Approved</option>
            <option>Funded</option>
          </select>
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Credit Score</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>Any</option>
            <option>700+</option>
            <option>650+</option>
            <option>600+</option>
          </select>
        </div>

        <div>
          <label className="gx-text-secondary text-sm">DTI Range</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>Any</option>
            <option>0–30%</option>
            <option>30–45%</option>
            <option>45–55%</option>
          </select>
        </div>
      </div>

      {/* BORROWERS TABLE */}
      <div className="gx-card p-6">
        <h2 className="gx-text-primary text-lg font-semibold mb-4">Borrower List</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="gx-text-secondary text-sm border-b border-[#2A2A33]">
                <th className="py-2">Name</th>
                <th className="py-2">Loan Amount</th>
                <th className="py-2">Credit Score</th>
                <th className="py-2">DTI</th>
                <th className="py-2">Signal Score</th>
                <th className="py-2">Status</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="gx-text-secondary">
              {sampleBorrowers.map((b, idx) => (
                <tr key={idx} className="border-b border-[#1A1A22] hover:bg-white/5 transition">
                  <td className="py-3">{b.name}</td>
                  <td className="py-3">{b.amount}</td>
                  <td className="py-3">{b.credit}</td>
                  <td className="py-3">{b.dti}</td>
                  <td className="py-3">
                    <ScoreChip score={b.score} />
                  </td>
                  <td className="py-3">
                    <StatusBadge status={b.status} />
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

const sampleBorrowers = [
  {
    name: "John Doe",
    amount: "$420,000",
    credit: 720,
    dti: "32%",
    score: 92,
    status: "New",
  },
  {
    name: "Sarah Lee",
    amount: "$310,000",
    credit: 680,
    dti: "41%",
    score: 88,
    status: "In Review",
  },
  {
    name: "Marcus Hill",
    amount: "$780,000",
    credit: 740,
    dti: "28%",
    score: 95,
    status: "Approved",
  },
  {
    name: "Emily Carter",
    amount: "$250,000",
    credit: 660,
    dti: "47%",
    score: 90,
    status: "Funded",
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
    "In Review": "bg-yellow-600",
    Approved: "bg-green-600",
    Funded: "bg-purple-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}
