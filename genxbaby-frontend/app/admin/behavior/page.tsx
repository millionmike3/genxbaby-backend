"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function BehaviorDashboard() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/behavior");
        const data = await res.json();
        setProfiles(data.profiles || []);
      } catch (err) {
        console.error("Behavior dashboard error:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading behavior analytics…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-[#0f0f0f] text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6">Behavior Analytics Dashboard</h1>

      <p className="text-gray-600 dark:text-gray-400 mb-10">
        Monitoring impulsiveness, volatility, and behavioral risk across users and leads.
      </p>

      <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Impulsiveness Profiles</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b dark:border-gray-700">
              <th className="py-2">User/Lead</th>
              <th className="py-2">Sessions</th>
              <th className="py-2">Avg IS</th>
              <th className="py-2">Max IS</th>
              <th className="py-2">Level</th>
              <th className="py-2">View Sessions</th>
            </tr>
          </thead>

          <tbody>
            {profiles.map((p, idx) => (
              <tr key={idx} className="border-b dark:border-gray-700">
                <td className="py-2">
                  {p.user?.email || p.lead?.email || "Unknown"}
                </td>

                <td className="py-2">{p.sessionsCount}</td>

                <td className="py-2 font-semibold">
                  {p.avgImpulsivenessScore.toFixed(1)}
                </td>

                <td className="py-2 font-semibold">
                  {p.maxImpulsivenessScore.toFixed(1)}
                </td>

                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      p.impulsivenessLevel === "stable"
                        ? "bg-green-600 text-white"
                        : p.impulsivenessLevel === "reactive"
                        ? "bg-yellow-500 text-black"
                        : p.impulsivenessLevel === "impulsive"
                        ? "bg-orange-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {p.impulsivenessLevel.toUpperCase()}
                  </span>
                </td>

                <td className="py-2">
                  <Link
                    href={`/admin/behavior/${p.id}`}
                    className="text-blue-500 dark:text-blue-400 underline"
                  >
                    View Sessions →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
