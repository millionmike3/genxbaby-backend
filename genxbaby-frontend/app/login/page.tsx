"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          address: email,     // using email as identifier
          roles: ["admin"],   // admin role
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/admin/audit");
    } catch (err) {
      console.error(err);
      setError("Unexpected error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-purple-700 via-purple-500 to-blue-500 p-6">

      {/* Glow behind the card */}
      <div className="absolute w-96 h-96 bg-purple-400/40 blur-3xl rounded-full -z-10" />

      {/* Glass card */}
      <form
        onSubmit={handleLogin}
        className="backdrop-blur-xl bg-white/10 border border-white/20 
        p-10 rounded-2xl shadow-2xl w-full max-w-sm space-y-6 text-white"
      >
        <h1 className="text-3xl font-bold text-center tracking-wide">
          GEN X BABY — ADMIN
        </h1>

        <p className="text-center text-white/70 text-sm -mt-3">
          Secure access required
        </p>

        {error && (
          <div className="text-red-300 text-center font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
            placeholder-white/60 text-white focus:outline-none focus:ring-2 
            focus:ring-white/70 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-white/20 border border-white/30 
            placeholder-white/60 text-white focus:outline-none focus:ring-2 
            focus:ring-white/70 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white/20 hover:bg-white/30 text-white p-3 
          rounded-lg font-semibold tracking-wide border border-white/40 
          transition-all shadow-lg active:scale-[0.97]"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
