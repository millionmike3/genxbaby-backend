"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Dashboard", icon: "/icons/owner.svg" },
    { href: "/documents", label: "Documents", icon: "/icons/documents.svg" },
    { href: "/checks", label: "Checks", icon: "/icons/checks.svg" },
    { href: "/underwriting", label: "Underwriting", icon: "/icons/underwriting.svg" },
    { href: "/financial-health", label: "Financial Health", icon: "/icons/financial.svg" },
    { href: "/income", label: "Income Verification", icon: "/icons/income.svg" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-[#0f0f0f] border-r border-gray-800 shadow-xl">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white tracking-wide">
          Owner Portal
        </h1>
      </div>

      <nav className="px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition",
              pathname === item.href && "bg-gray-800 text-white"
            )}
          >
            <img src={item.icon} alt="" className="w-5 h-5 opacity-80" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
