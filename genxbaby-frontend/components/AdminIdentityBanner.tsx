"use client";

import { useEffect, useState } from "react";

export default function AdminIdentityBanner() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    }
    load();
  }, []);

  if (!data) return null;

  const { admin, session } = data;

  return (
    <div className="p-4 mb-6 border rounded bg-gray-50">
      <h2 className="font-semibold text-lg mb-2">Admin Identity</h2>

      <div className="text-sm">
        <div><strong>Email:</strong> {admin.email}</div>
        <div><strong>Role:</strong> {admin.role}</div>
        <div><strong>Wallet:</strong> {admin.walletAddress || "None"}</div>
        <div><strong>Session Expires:</strong> {new Date(session.expiresIn * 1000).toLocaleString()}</div>
      </div>
    </div>
  );
}
