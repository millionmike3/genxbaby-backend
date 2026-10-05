"use client";

import { useEffect, useState } from "react";
import AdminIdentityBanner from "@/components/AdminIdentityBanner";

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [wallet, setWallet] = useState("");

  async function loadAdmin() {
    const res = await fetch("/api/admin/me");
    const json = await res.json();
    setAdmin(json.admin);
    setWallet(json.admin.walletAddress || "");
  }

  useEffect(() => {
    loadAdmin();
  }, []);

  async function updatePassword() {
    setMessage("Updating password...");
    const res = await fetch("/api/admin/settings/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = await res.json();
    setMessage(json.success ? "Password updated!" : json.error);
  }

  async function updateWallet() {
    setMessage("Updating wallet...");
    const res = await fetch("/api/admin/settings/update-wallet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });
    const json = await res.json();
    setMessage(json.success ? "Wallet updated!" : json.error);
  }

  if (!admin) return <div className="p-6">Loading settings…</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <AdminIdentityBanner />

      <h1 className="text-2xl font-bold">Admin Settings</h1>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-700 rounded">{message}</div>
      )}

      {/* Profile Card */}
      <div className="p-4 bg-white/10 rounded-xl text-white space-y-2">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p>Email: {admin.email}</p>
        <p>Role: {admin.role}</p>
        <p>Wallet: {admin.walletAddress || "None"}</p>
        <p>Created: {new Date(admin.createdAt).toLocaleString()}</p>
      </div>

      {/* Change Password */}
      <div className="p-4 bg-white/10 rounded-xl text-white space-y-3">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <input
          type="password"
          placeholder="New password"
          className="w-full p-2 rounded bg-white/20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={updatePassword}
          className="px-4 py-2 bg-purple-700 rounded text-white"
        >
          Update Password
        </button>
      </div>

      {/* Wallet Address */}
      <div className="p-4 bg-white/10 rounded-xl text-white space-y-3">
        <h2 className="text-lg font-semibold">Wallet Address</h2>
        <input
          type="text"
          placeholder="0x..."
          className="w-full p-2 rounded bg-white/20"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <button
          onClick={updateWallet}
          className="px-4 py-2 bg-purple-700 rounded text-white"
        >
          Update Wallet
        </button>
      </div>
    </div>
  );
}
