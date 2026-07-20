"use client";

import { useEffect, useState } from "react";
import AdminIdentityBanner from "@/components/AdminIdentityBanner";
import { logAudit } from "@/lib/logAudit";

export default function AdminRolesPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadAdmins() {
    const res = await fetch("/api/admin/roles/list");
    const json = await res.json();
    setAdmins(json.admins || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAdmins();
  }, []);

  // ---------------------------------------------------------
  // GRANT ROLE (with audit logging)
  // ---------------------------------------------------------
  async function grant(wallet: string) {
    setMessage("Granting role...");

    const res = await fetch("/api/admin/roles/grant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });

    const json = await res.json();

    if (json.success) {
      setMessage("Role granted!");

      // AUDIT LOG
      await logAudit("GRANT_ROLE", { wallet });

      loadAdmins();
    } else {
      setMessage(json.error || "Failed to grant role");
    }
  }

  // ---------------------------------------------------------
  // REVOKE ROLE (with audit logging)
  // ---------------------------------------------------------
  async function revoke(wallet: string) {
    setMessage("Revoking role...");

    const res = await fetch("/api/admin/roles/revoke", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });

    const json = await res.json();

    if (json.success) {
      setMessage("Role revoked!");

      // AUDIT LOG
      await logAudit("REVOKE_ROLE", { wallet });

      loadAdmins();
    } else {
      setMessage(json.error || "Failed to revoke role");
    }
  }

  if (loading) return <div className="p-6">Loading roles…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <AdminIdentityBanner />

      <h1 className="text-2xl font-bold">Admin Role Management</h1>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2">Email</th>
            <th className="py-2">Wallet</th>
            <th className="py-2">Role</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {admins.map((a) => (
            <tr key={a.id} className="border-b">
              <td className="py-2">{a.email}</td>
              <td className="py-2">{a.walletAddress || "None"}</td>
              <td className="py-2">{a.role}</td>

              <td className="py-2 space-x-3">
                <button
                  onClick={() => grant(a.walletAddress)}
                  className="px-3 py-1 bg-green-600 text-white rounded"
                >
                  Grant Admin
                </button>

                <button
                  onClick={() => revoke(a.walletAddress)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Revoke Admin
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
