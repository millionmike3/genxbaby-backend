"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/toast/ToastProvider";

export default function ProfileCard() {
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setProfile(data);
        setName(data.name || "");
      } catch (err) {
        toast.addToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function updateProfile() {
    try {
      const token = localStorage.getItem("accessToken");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/update-profile`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        toast.addToast("Failed to update profile", "error");
        return;
      }

      toast.addToast("Profile updated", "success");
    } catch {
      toast.addToast("Update failed", "error");
    }
  }

  if (loading) {
    return (
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <p className="text-gray-400">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-6">
      <h2 className="text-xl font-bold text-white">Account Information</h2>

      <div className="space-y-4">
        <div>
          <label className="text-gray-400">Email</label>
          <p className="text-white font-semibold">{profile.email}</p>
        </div>

        <div>
          <label className="text-gray-400">Owner ID</label>
          <p className="text-white font-semibold">{profile.ownerId}</p>
        </div>

        <div>
          <label className="text-gray-400">Name</label>
          <input
            type="text"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <button
        onClick={updateProfile}
        className="px-6 py-3 bg-[#3CF46B] text-black font-semibold rounded-lg shadow-[0_0_20px_rgba(60,244,107,0.7)] hover:bg-[#32d45f] transition"
      >
        Save Changes
      </button>
    </div>
  );
}
