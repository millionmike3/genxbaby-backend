"use client";

import { useEffect, useState } from "react";
import AdminIdentityBanner from "@/components/AdminIdentityBanner";

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/audit/list");
      const json = await res.json();
      setLogs(json.logs || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="p-6">Loading audit logs…</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <AdminIdentityBanner />

      <h1 className="text-2xl font-bold">Audit Logs</h1>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Admin</th>
            <th className="py-2">Action</th>
            <th className="py-2">Metadata</th>
            <th className="py-2">IP</th>
            <th className="py-2">Time</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b">
              <td className="py-2">
                {log.admin.email}
                <br />
                <span className="text-xs text-gray-500">
                  {log.admin.walletAddress}
                </span>
              </td>

              <td className="py-2">{log.action}</td>

              <td className="py-2 text-xs">
                <pre className="bg-gray-100 p-2 rounded">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </td>

              <td className="py-2">{log.ip}</td>

              <td className="py-2">
                {new Date(log.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
