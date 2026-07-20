"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import ThemeToggle from "@/components/ThemeToggle";

export default function AdminLayout({ children }) {
  const { address } = useAccount();
  const [roles, setRoles] = useState(null);

  useEffect(() => {
    if (!address) return;

    fetch("/api/auth/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    })
      .then((res) => res.json())
      .then((data) => setRoles(data));
  }, [address]);

  if (!address) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold">Connect your wallet</h1>
      </div>
    );
  }

  if (!roles.admin && !roles.register && !roles.void) {
  return (
    <div className="p-10">
      <h1 className="text-xl font-bold text-red-600">Not Authorized</h1>
      <p>Your wallet does not have admin permissions.</p>
    </div>
  );
}


  if (!roles.register && !roles.void) {
    return (
      <div className="p-10">
        <h1 className="text-xl font-bold text-red-600">Not Authorized</h1>
        <p>Your wallet does not have admin permissions.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <aside className="w-64 fixed h-full bg-white dark:bg-[#1a1a1a] border-r dark:border-[#333]">
        <nav className="p-6 space-y-4">
  <ThemeToggle />

  <a href="/admin" className="block font-semibold">Dashboard</a>

  {(roles.admin || roles.register) && (
    <a href="/admin/register" className="block">Register Check</a>
  )}

  {(roles.admin || roles.void) && (
    <a href="/admin/void" className="block">Void Check</a>
  )}

  {(roles.admin || roles.register) && (
    <a href="/admin/batch" className="block">Batch Upload</a>
  )}
{roles.admin && (
  <a href="/admin/roles" className="block">Role Management</a>
)}

  <a href="/admin/checks" className="block">View Checks</a>
</nav>

      </aside>

      <main className="ml-64 p-10">{children}</main>
    </div>
  );
}
