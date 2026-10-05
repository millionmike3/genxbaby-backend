"use client";

import { useEffect, useState } from "react";

export default function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/audit/list");
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error("Failed to load audit logs", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Audit Log
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        All admin actions performed in the system.
      </p>

      {loading && (
        <p className="text-gray-700 dark:text-gray-300">Loading logs…</p>
      )}

      {!loading && logs.length === 0 && (
        <p className="text-gray-700 dark:text-gray-300">
          No audit logs found.
        </p>
      )}

      {!loading && logs.length > 0 && (
        <div className="overflow-auto border rounded bg-white dark:bg-[#1a1a1a] dark:border-[#333]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-[#333] bg-gray-100 dark:bg-[#222]">
                <th className="p-3">Time</th>
                <th className="p-3">Actor</th>
                <th className="p-3">Action</th>
                <th className="p-3">Target</th>
                <th className="p-3">Metadata</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  className="border-b dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                >
                  <td className="p-3">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3">{log.actor}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.target || "-"}</td>
                  <td className="p-3 font-mono text-sm">
                    {log.metadata ? JSON.stringify(log.metadata) : "-"}
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
