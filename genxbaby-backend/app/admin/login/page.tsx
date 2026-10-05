"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useSignMessage } from "wagmi";

export default function AdminLogin() {
  const router = useRouter();

  // Wallet hooks
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

  // Password login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------------------------------------
  // PASSWORD LOGIN
  // ---------------------------------------------
  async function loginWithPassword() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
      setLoading(false);
    }
  }

  // ---------------------------------------------
  // WALLET LOGIN
  // ---------------------------------------------
  async function loginWithWallet() {
    try {
      if (!isConnected || !address) {
        setError("Connect your wallet first");
        return;
      }

      setLoading(true);
      setError("");

      // 1. Get nonce + message
      const nonceRes = await fetch("/api/admin/login-wallet/nonce");
      const { message } = await nonceRes.json();

      // 2. Sign message
      const signature = await signMessageAsync({ message });

      // 3. Send signature to backend
      const res = await fetch("/api/admin/login-wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address,
          signature,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Wallet login failed");
        setLoading(false);
        return;
      }

      router.push("/admin");
    } catch (err) {
      console.error(err);
      setError("Wallet login error");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Admin Login</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* PASSWORD LOGIN */}
      <div className="mb-8">
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={loginWithPassword}
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Loading..." : "Login with Password"}
        </button>
      </div>

      <hr className="my-6" />

      {/* WALLET LOGIN */}
      <button
        onClick={loginWithWallet}
        disabled={loading}
        className="w-full bg-purple-600 text-white p-2 rounded"
      >
        {loading ? "Loading..." : "Login with Wallet"}
      </button>
    </div>
  );
}
