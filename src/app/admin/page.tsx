"use client";

import { useState } from "react";
import MerkleTreeExplorer from "./components/MerkleTreeExplorer";
import SystemHealth from "./components/SystemHealth";
import RecentAnchors from "./components/RecentAnchors";

export default function AdminPage() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // -------------------------------
  // Anchor Audit Logs On-Chain
  // -------------------------------
  const anchorNow = async () => {
    setLoading(true);
    setMessage("Anchoring audit logs on-chain…");

    try {
      const res = await fetch("/api/audit/anchor", {
        method: "POST",
      });
      const data = await res.json();

      if (data.success) {
        setMessage(`✔ Anchored successfully. TX: ${data.txHash}`);
      } else {
        setMessage("❌ Anchor failed.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Anchor failed.");
    }

    setLoading(false);
  };

  // -------------------------------
  // Verify Logs Against On-Chain Root
  // -------------------------------
  const verifyLogs = async () => {
    setLoading(true);
    setMessage("Verifying logs…");

    try {
      const res = await fetch("/api/audit/verify", {
        method: "POST",
      });
      const data = await res.json();

      if (!data.success) {
        setMessage("❌ Verification failed.");
      } else if (data.match) {
        setMessage("✔ Logs verified — on-chain root matches database.");
      } else {
        setMessage("❌ Logs DO NOT match — possible tampering detected.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Verification failed.");
    }

    setLoading(false);
  };

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold dark:text-white">
        Admin Dashboard
      </h1>

      {/* System Health */}
      <SystemHealth />

      {/* Recent Anchors */}
      <RecentAnchors />

      {/* Audit Anchoring */}
      <div className="border rounded p-6 bg-white dark:bg-[#1a1a1a] dark:border-[#333]">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Audit Anchoring
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Anchor the latest audit logs to the blockchain.
        </p>

        <button
          onClick={anchorNow}
          disabled={loading}
          className="px-4 py-2 bg-black text-white rounded dark:bg-[#333] dark:hover:bg-[#444] disabled:opacity-50"
        >
          {loading ? "Anchoring…" : "Anchor Audit Logs"}
        </button>
      </div>

      {/* Verify Logs */}
      <div className="border rounded p-6 bg-white dark:bg-[#1a1a1a] dark:border-[#333]">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Verify Audit Logs
        </h2>

        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Recompute the Merkle root from the database and compare it to the on-chain root.
        </p>

        <button
          onClick={verifyLogs}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded dark:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Verifying…" : "Verify Logs"}
        </button>
      </div>

      {/* Status Message */}
      {message && (
        <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
      )}

      {/* Merkle Tree Explorer */}
      <MerkleTreeExplorer />
    </div>
  );
}
