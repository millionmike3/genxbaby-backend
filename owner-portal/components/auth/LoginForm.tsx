"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/toast/ToastProvider";

export default function LoginForm() {
  const router = useRouter();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        credentials: "include", // allows httpOnly cookie
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        const message = msg || "Invalid credentials";

        setError(message);
        toast.addToast(message, "error");
        return;
      }

      toast.addToast("Login successful", "success");
      router.push("/");
    } catch (err) {
      setError("Login failed");
      toast.addToast("Login failed — please try again", "error");
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      {error && (
        <div className="bg-red-600 text-white p-3 rounded-lg text-center">
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-300 mb-2">Email</label>
        <input
          type="email"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block text-gray-300 mb-2">Password</label>
        <input
          type="password"
          className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 rounded-lg bg-[#3CF46B] text-black font-semibold shadow-[0_0_20px_rgba(60,244,107,0.7)] hover:bg-[#32d45f] transition"
      >
        Login
      </button>
    </form>
  );
}
