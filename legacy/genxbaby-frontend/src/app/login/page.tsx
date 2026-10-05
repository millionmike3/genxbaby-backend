"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0f0f0f] transition-colors duration-300">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      <div className="login-card p-10 rounded-xl border bg-white dark:bg-[#1a1a1a] dark:border-[#333] shadow-lg w-full max-w-md transition-all duration-300">
        <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">
          Admin Login
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Access the Check Registry Admin Panel
        </p>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="border p-3 w-full rounded bg-white dark:bg-[#1f1f1f] dark:border-[#333] dark:text-white transition-all duration-200"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              className="border p-3 w-full rounded bg-white dark:bg-[#1f1f1f] dark:border-[#333] dark:text-white transition-all duration-200"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded dark:bg-[#333] dark:hover:bg-[#444] transition-all duration-200 active:scale-[0.97]"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
