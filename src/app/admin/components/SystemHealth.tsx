"use client";

import { useEffect, useState } from "react";

export default function SystemHealth() {
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    try {
      const res = await fetch("/api/system/health");
      const data = await res.json();
      setHealth(data);
    } catch (err) {
      console.error("Health check failed", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="border rounded p-6 bg-white dark:bg-[#1a1a1a] dark:border-[#333]">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        System Health
      </h2>

      {loading && (
        <p className="text-gray-700 dark:text-gray-300">Checking system…</p>
      )}

      {health && (
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <div>
            <strong>Database:</strong>{" "}
            {health.db ? "Connected" : "Unavailable"}
          </div>

          <div>
            <strong>Audit Logs:</strong> {health.auditCount}
          </div>

          <div>
            <strong>Latest Merkle Root:</strong>
            <div className="font-mono text-xs mt-1 p-2 bg-gray-100 dark:bg-[#222] rounded">
              {health.latestRoot || "None anchored yet"}
            </div>
          </div>

          <div>
            <strong>Last Anchor Time:</strong>{" "}
            {health.lastAnchor
              ? new Date(health.lastAnchor).toLocaleString()
              : "Never"}
          </div>

          <div>
            <strong>Contract Connection:</strong>{" "}
            {health.contract ? "OK" : "Failed"}
          </div>

          <div>
            <strong>RPC Status:</strong>{" "}
            {health.rpc ? "Healthy" : "Unreachable"}
          </div>
        </div>
      )}
    </div>
  );
}
