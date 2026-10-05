"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, []);

  // Load notifications
  useEffect(() => {
    async function load() {
      try {
        const data = await api("/notifications");
        setNotifications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function markAsRead(id: string) {
    try {
      await api(`/notifications/read/${id}`, { method: "POST" });

      // Update UI instantly
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading notifications…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      <h1 className="text-3xl font-bold">Notifications</h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">

        {notifications.length === 0 && (
          <div className="text-gray-500 text-center py-6">
            No notifications yet.
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-lg border ${
              n.read ? "bg-gray-50" : "bg-blue-50 border-blue-300"
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-gray-800">{n.title}</div>
                <div className="text-gray-600 text-sm mt-1">{n.message}</div>
                <div className="text-gray-400 text-xs mt-2">{n.created_at}</div>
              </div>

              {!n.read && (
                <button
                  onClick={() => markAsRead(n.id)}
                  className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
