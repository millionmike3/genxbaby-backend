"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  // Load profile
  useEffect(() => {
    async function load() {
      try {
        const data = await api("/profile");
        setProfile(data);

        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function saveChanges(e: any) {
    e.preventDefault();
    setSaving(true);

    try {
      await api("/profile/update", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password: password || undefined,
        }),
      });

      alert("Profile updated successfully");

      // Refresh profile
      const updated = await api("/profile");
      setProfile(updated);

      // Reset password field
      setPassword("");

    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading profile…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <h1 className="text-3xl font-bold">Profile Settings</h1>

      {/* PROFILE SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Account Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Role</div>
            <div className="text-xl font-bold capitalize">{profile.role}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">XP</div>
            <div className="text-xl font-bold text-green-600">{profile.xp}</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500">Member Since</div>
            <div className="text-xl font-bold">{profile.created_at}</div>
          </div>

        </div>
      </div>

      {/* EDIT PROFILE FORM */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

        <form onSubmit={saveChanges} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="border rounded-lg px-3 py-2 w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="border rounded-lg px-3 py-2 w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">New Password (optional)</label>
            <input
              type="password"
              className="border rounded-lg px-3 py-2 w-full"
              placeholder="Leave blank to keep current password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="md:col-span-2 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>

        </form>
      </div>

    </div>
  );
}
