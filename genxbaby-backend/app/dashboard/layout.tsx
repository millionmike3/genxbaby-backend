"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0B0B0F]">

      {/* SIDEBAR (DESKTOP) */}
      <aside
        className={`hidden md:flex flex-col gx-card transition-all duration-300 h-screen fixed top-0 left-0
        ${collapsed ? "w-20" : "w-64"}`}
      >
        <div className="p-6 flex items-center justify-between">
          {!collapsed && <span className="gx-text-primary text-xl font-bold">GenXBaby</span>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="gx-btn-ghost"
          >
            {collapsed ? "→" : "←"}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <SidebarLink href="/dashboard" label="Dashboard" collapsed={collapsed} />
          <SidebarLink href="/dashboard/signals" label="Signals" collapsed={collapsed} />
          <SidebarLink href="/dashboard/pipeline" label="Pipeline" collapsed={collapsed} />
          <SidebarLink href="/dashboard/investors" label="Investors" collapsed={collapsed} />
          <SidebarLink href="/dashboard/borrowers" label="Borrowers" collapsed={collapsed} />
          <SidebarLink href="/dashboard/ultrafavorable" label="UltraFavorable" collapsed={collapsed} />
          <SidebarLink href="/dashboard/bluetooth" label="Bluetooth Scanner" collapsed={collapsed} />
        </nav>
      </aside>

      {/* SIDEBAR (MOBILE) */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 gx-card z-50 transform transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6 flex items-center justify-between">
          <span className="gx-text-primary text-xl font-bold">GenXBaby</span>
          <button onClick={() => setMobileOpen(false)} className="gx-btn-ghost">
            <X size={22} />
          </button>
        </div>

        <nav className="px-4 space-y-2">
          <SidebarLink href="/dashboard" label="Dashboard" />
          <SidebarLink href="/dashboard/signals" label="Signals" />
          <SidebarLink href="/dashboard/pipeline" label="Pipeline" />
          <SidebarLink href="/dashboard/investors" label="Investors" />
          <SidebarLink href="/dashboard/borrowers" label="Borrowers" />
          <SidebarLink href="/dashboard/ultrafavorable" label="UltraFavorable" />
          <SidebarLink href="/dashboard/bluetooth" label="Bluetooth Scanner" />
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex-1 min-h-screen transition-all duration-300
        ${collapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        {/* TOP NAV */}
        <header
          className={`gx-glass fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-40
            md:left-auto md:right-auto md:w-[calc(100%-64px)]
            transition-all duration-300
            ${collapsed ? "md:ml-[80px]" : "md:ml-[256px]"}
          `}
        >
          <button
            className="md:hidden gx-btn-ghost"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <h1 className="gx-text-primary text-lg font-semibold">Dashboard</h1>

          <div className="flex items-center gap-4">
            <button className="gx-btn-ghost">🔔</button>
            <div className="w-8 h-8 rounded-full bg-white/10"></div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="pt-20 pb-10 px-6">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ---------------- SIDEBAR LINK COMPONENT ---------------- */

function SidebarLink({
  href,
  label,
  collapsed = false,
}: {
  href: string;
  label: string;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gx-text-secondary hover:gx-text-primary transition p-2 rounded-lg hover:bg-white/5"
    >
      <span className="text-lg">•</span>
      {!collapsed && <span className="ml-3">{label}</span>}
    </Link>
  );
}
