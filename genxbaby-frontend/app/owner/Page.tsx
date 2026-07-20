"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function OwnerPage() {
  const router = useRouter();

  const [properties, setProperties] = useState<any[]>([]);
  const [equity, setEquity] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Protect route — only owners can access
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) router.push("/login");
    if (role !== "owner" && role !== "admin") router.push("/dashboard");
  }, []);

  // Load owner dashboard data
  useEffect(() => {
    async function loadData() {
      try {
        const props = await api("/owner/properties");
        const eq = await api("/owner/equity");
        const act = await api("/owner/activity");
        const pay = await api("/owner/payments");

        setProperties(props);
        setEquity(eq);
        setActivity(act);
        setPayments(pay);
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
        Loading owner dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <h1 className="text-3xl font-bold">Owner Dashboard</h1>

      {/* EQUITY SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Equity Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Equity</div>
            <div className="text-2xl font-bold text-green-600">
              ${equity?.total_equity ?? 0}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Total Properties</div>
            <div className="text-2xl font-bold">
              {equity?.property_count ?? 0}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Average LTV</div>
            <div className="text-2xl font-bold text-blue-600">
              {equity?.avg_ltv ?? "—"}%
            </div>
          </div>

        </div>
      </div>

      {/* PROPERTIES */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Your Properties</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Address</th>
              <th className="py-2">Value</th>
              <th className="py-2">Equity</th>
              <th className="py-2">LTV</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{p.address}</td>
                <td className="py-2">${p.value}</td>
                <td className="py-2">${p.equity}</td>
                <td className="py-2">{p.ltv}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTIVITY */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

        <ul className="space-y-2">
          {activity.map((a, idx) => (
            <li key={idx} className="border-b pb-2">
              <div className="font-medium">{a.action}</div>
              <div className="text-sm text-gray-500">{a.timestamp}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* PAYMENTS */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Payments</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Amount</th>
              <th className="py-2">Date</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((p, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">${p.amount}</td>
                <td className="py-2">{p.date}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      p.status === "paid"
                        ? "bg-green-600"
                        : p.status === "pending"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
