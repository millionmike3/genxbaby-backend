"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function InvestorPage() {
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [pipeline, setPipeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route — only investors or admin can access
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) router.push("/login");
    if (role !== "investor" && role !== "admin") router.push("/dashboard");
  }, []);

  // Load investor dashboard data
  useEffect(() => {
    async function loadData() {
      try {
        const s = await api("/investor/stats");
        const p = await api("/investor/properties");
        const d = await api("/investor/distributions");
        const pl = await api("/investor/pipeline");

        setStats(s);
        setProperties(p);
        setDistributions(d);
        setPipeline(pl);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading investor dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <h1 className="text-3xl font-bold">Investor Dashboard</h1>

      {/* PORTFOLIO STATS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Invested</div>
            <div className="text-2xl font-bold text-blue-600">
              ${stats?.totalInvested ?? 0}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Returns</div>
            <div className="text-2xl font-bold text-green-600">
              ${stats?.totalReturns ?? 0}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Active Deals</div>
            <div className="text-2xl font-bold">
              {stats?.activeDeals ?? 0}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Average ROI</div>
            <div className="text-2xl font-bold text-purple-600">
              {stats?.avgROI ?? 0}%
            </div>
          </div>

        </div>
      </div>

      {/* INVESTMENT PROPERTIES */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Investments</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Address</th>
              <th className="py-2">Investment</th>
              <th className="py-2">Equity Share</th>
              <th className="py-2">Returns</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{p.address}</td>
                <td className="py-2">${p.investment}</td>
                <td className="py-2">{p.equityShare}%</td>
                <td className="py-2">${p.returns}</td>
                <td className="py-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DISTRIBUTIONS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Distributions</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Amount</th>
              <th className="py-2">Property</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {distributions.map((d, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">${d.amount}</td>
                <td className="py-2">{d.property}</td>
                <td className="py-2">{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PIPELINE DEALS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Pipeline Deals</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Address</th>
              <th className="py-2">Projected ROI</th>
              <th className="py-2">Raise Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {pipeline.map((d, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{d.address}</td>
                <td className="py-2">{d.projectedROI}%</td>
                <td className="py-2">${d.raiseAmount}</td>
                <td className="py-2">{d.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
