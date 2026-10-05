"use client";

import { useState } from "react";

export default function InvestorsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6 space-y-8">

      {/* PAGE HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="gx-text-primary text-2xl font-bold">Investors</h1>
      </div>

      {/* FILTERS */}
      <div className="gx-card p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="gx-text-secondary text-sm">Search</label>
          <input
            type="text"
            placeholder="Search investors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary"
          />
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Capital Range</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>Any</option>
            <option>$100k+</option>
            <option>$500k+</option>
            <option>$1M+</option>
            <option>$5M+</option>
          </select>
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Activity</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>All</option>
            <option>Active</option>
            <option>Recently Matched</option>
            <option>Idle</option>
          </select>
        </div>

        <div>
          <label className="gx-text-secondary text-sm">Region</label>
          <select className="w-full mt-1 bg-[#111118] border border-[#2A2A33] rounded-lg px-3 py-2 gx-text-primary">
            <option>All</option>
            <option>East Coast</option>
            <option>West Coast</option>
            <option>Midwest</option>
            <option>South</option>
          </select>
        </div>
      </div>

      {/* INVESTOR GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sampleInvestors.map((inv, idx) => (
          <InvestorCard key={idx} investor={inv} />
        ))}
      </div>

    </div>
  );
}

/* ---------------- SAMPLE DATA ---------------- */

const sampleInvestors = [
  {
    name: "PrimeVest Capital",
    capital: "$12.5M",
    activity: "Active",
    matches: 14,
    region: "East Coast",
  },
  {
    name: "BlueRock Funding",
    capital: "$4.8M",
    activity: "Recently Matched",
    matches: 6,
    region: "West Coast",
  },
  {
    name: "CapitalOne Partners",
    capital: "$22M",
    activity: "Active",
    matches: 21,
    region: "National",
  },
  {
    name: "IronGate Lending",
    capital: "$1.2M",
    activity: "Idle",
    matches: 2,
    region: "South",
  },
];

/* ---------------- COMPONENTS ---------------- */

function InvestorCard({ investor }: { investor: any }) {
  return (
    <div className="gx-card p-6 rounded-xl hover:bg-white/10 transition cursor-pointer">
      <div className="flex items-center justify-between">
        <h2 className="gx-text-primary text-lg font-semibold">{investor.name}</h2>
        <ActivityBadge status={investor.activity} />
      </div>

      <div className="gx-text-secondary text-sm mt-2">
        Capital Available: <span className="gx-text-primary">{investor.capital}</span>
      </div>

      <div className="gx-text-secondary text-sm">
        Region: <span className="gx-text-primary">{investor.region}</span>
      </div>

      <div className="gx-text-secondary text-sm mt-2">
        Recent Matches: <span className="gx-text-primary">{investor.matches}</span>
      </div>

      <button className="gx-btn-secondary mt-4 w-full py-2 text-sm">
        View Profile
      </button>
    </div>
  );
}

function ActivityBadge({ status }: { status: string }) {
  const map: any = {
    Active: "bg-green-600",
    "Recently Matched": "bg-blue-600",
    Idle: "bg-gray-600",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${map[status]}`}>
      {status}
    </span>
  );
}
