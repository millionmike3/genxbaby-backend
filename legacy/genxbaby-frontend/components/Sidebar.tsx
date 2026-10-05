"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  // Fetch admin role from session
  useEffect(() => {
    async function loadRole() {
      try {
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const json = await res.json();
          setRole(json.admin.role);
        }
      } catch (err) {
        console.error("Sidebar role fetch error:", err);
      }
    }
    loadRole();
  }, []);

  const menu = [
    { label: "Dashboard", icon: "dashboard_customize", href: "/dashboard" },
    { label: "Borrowers", icon: "person", href: "/borrowers" },
    { label: "Investors", icon: "attach_money", href: "/investors" },
    { label: "Pipeline", icon: "timeline", href: "/pipeline" },
    { label: "Scan", icon: "qr_code_scanner", href: "/scan" },
    { label: "Chat", icon: "chat", href: "/chat" },
  ];

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 240 }}
      className="h-screen bg-gradient-to-b from-purple-700 to-purple-900 
      text-white shadow-xl flex flex-col transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5">
        {!collapsed && (
          <h1 className="text-xl font-bold tracking-wide">GEN X BABY</h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="material-icons text-white/80 hover:text-white"
        >
          {collapsed ? "chevron_right" : "chevron_left"}
        </button>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 space-y-2 px-3">
        {menu.map((item, i) => (
          <Link key={i} href={item.href}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer
              hover:bg-white/10 transition"
            >
              <span className="material-icons text-white/80">{item.icon}</span>
              {!collapsed && (
                <span className="text-white/90 font-medium">{item.label}</span>
              )}
            </motion.div>
          </Link>
        ))}

        {/* Admin Tools Section */}
        {role === "admin" && (
          <div className="mt-6 space-y-2">
            {!collapsed && (
              <h3 className="text-xs uppercase text-white/60 mb-2">
                Admin Tools
              </h3>
            )}
{/* Check Verification Portal */}
<Link href="/verify">
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
  >
    <span className="material-icons text-white/80">qr_code</span>
    {!collapsed && (
      <span className="text-white/90 font-medium">Check Verification</span>
    )}
  </motion.div>
</Link>
{/* Batch Upload */}
<Link href="/admin/batch">
  <motion.div
    whileHover={{ scale: 1.03 }}
    className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
  >
    <span className="material-icons text-white/80">upload_file</span>
    {!collapsed && (
      <span className="text-white/90 font-medium">Batch Upload</span>
    )}
  </motion.div>
</Link>

            {/* Audit Logs */}
            <Link href="/admin/audit">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
              >
                <span className="material-icons text-white/80">history</span>
                {!collapsed && (
                  <span className="text-white/90 font-medium">Audit Logs</span>
                )}
              </motion.div>
            </Link>

            {/* Fraud Detection */}
            <Link href="/admin/fraud">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
              >
                <span className="material-icons text-white/80">warning</span>
                {!collapsed && (
                  <span className="text-white/90 font-medium">Fraud Detection</span>
                )}
              </motion.div>
            </Link>

            {/* Suspicious Activity Reports */}
            <Link href="/admin/sar">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
              >
                <span className="material-icons text-white/80">report</span>
                {!collapsed && (
                  <span className="text-white/90 font-medium">
                    Suspicious Activity
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Admin Settings */}
            <Link href="/admin/settings">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
              >
                <span className="material-icons text-white/80">settings</span>
                {!collapsed && (
                  <span className="text-white/90 font-medium">
                    Admin Settings
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Role Management */}
            <Link href="/admin/roles">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
              >
                <span className="material-icons text-white/80">
                  admin_panel_settings
                </span>
                {!collapsed && (
                  <span className="text-white/90 font-medium">
                    Role Management
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Check Registry */}
            <Link href="/admin/checks">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/10 transition"
              >
                <span className="material-icons text-white/80">
                  receipt_long
                </span>
                {!collapsed && (
                  <span className="text-white/90 font-medium">
                    Check Registry
                  </span>
                )}
              </motion.div>
            </Link>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 text-xs text-white/60">
        {!collapsed && "© 2026 Gen X Baby"}
      </div>
    </motion.aside>
  );
}
