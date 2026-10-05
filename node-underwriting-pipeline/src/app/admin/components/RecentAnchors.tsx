"use client";

import { useEffect, useState } from "react";

export default function RecentAnchors() {
  const [anchors, setAnchors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnchors = async () => {
    try {
      const res = await fetch("/api/audit/anchors");
      const data = await res.json();
      setAnchors(data.anchors || []);
    } catch (err) {
      console.error("Failed to load anchors", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnchors();
  }, []);

  return (
    <div className="border rounded p-6 bg-white dark:bg-[#1a1a1a] dark:border-[#333]">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Recent Anchors
      </h2>

      {loading && (
        <p className="text-gray-700 dark:text-gray-300">Loading…</p>
      )}

      {!loading && anchors.length === 0 && (
        <p className="text-gray-700 dark:text-gray-300">
          No anchors found.
        </p>
      )}

      {!loading && anchors.length > 0 && (
        <div className="overflow-auto">
          <table className="w-full text-left bg-white dark:bg-[#1a1a1a]">
            <thead>
              <tr className="border-b dark:border-[#333] bg-gray-100 dark:bg-[#222]">
                <th className="p-3">Root</th>
                <th className="p-3">Logs</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {anchors.map((a) => (
                <tr
                  key={a.id}
                  className="border-b dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                >
                  <td className="p-3 font-mono text-xs">{a.root}</td>
                  <td className="p-3">{a.count}</td>
                  <td className="p-3">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
