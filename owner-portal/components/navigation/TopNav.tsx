"use client";

import Link from "next/link";
import DarkModeToggle from "./DarkModeToggle";

export default function TopNav() {
  return (
    <header className="w-full bg-[#0f0f0f] dark:bg-black border-b border-gray-800 px-10 py-4 flex items-center justify-between">
      {/* Left: Portal Title */}
      <h1 className="text-xl font-bold text-white tracking-wide">
        Owner Portal
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-6">
        <DarkModeToggle />

        <Link
          href="/profile"
          className="text-gray-300 hover:text-white transition"
        >
          Profile
        </Link>

        <Link
  href="/logout"
  className="text-red-400 hover:text-red-300 transition"
>
  Logout
</Link>

      </div>
    </header>
  );
}
