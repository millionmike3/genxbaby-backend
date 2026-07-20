"use client";

import { useEffect, useState } from "react";
import AdminIdentityBanner from "@/components/AdminIdentityBanner";
import { api } from "@/lib/api";

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  // Load all users
  useEffect(() => {
    async function loadUsers() {
      try {
        const res = await api("/users");
        setUsers(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  // Create user
  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password, role }),
      });

      setMessage(`User created: ${res.username}`);

      // Refresh user list
      const updated = await api("/users");
      setUsers(updated);

      // Reset form
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("user");

    } catch (err: any) {
      setMessage(err.message || "Error creating user");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading admin panel…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      {/* Admin Identity */}
      <AdminIdentityBanner />

      <h1 className="text-3xl font-bold">Admin Panel</h1>

      {/* CREATE USER */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Create New User</h2>

        {message && (
          <div className="mb-4 text-blue-600 font-medium">{message}</div>
        )}

        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Username"
            className="border rounded-lg px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            className="border rounded-lg px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <select
            className="border rounded-lg px-3 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="borrower">Borrower</option>
            <option value="investor">Investor</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="md:col-span-4 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Create User
          </button>
        </form>
      </div>

      {/* USER LIST */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">All Users</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Username</th>
              <th className="py-2">Email</th>
              <th className="py-2">Role</th>
              <th className="py-2">XP</th>
              <th className="py-2">Created</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2">{u.id}</td>
                <td className="py-2">{u.username}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm ${
                      u.role === "admin"
                        ? "bg-red-600"
                        : u.role === "investor"
                        ? "bg-blue-600"
                        : u.role === "borrower"
                        ? "bg-green-600"
                        : u.role === "owner"
                        ? "bg-purple-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-2">{u.xp}</td>
                <td className="py-2">{u.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
