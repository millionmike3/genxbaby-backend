"use client";

import { usePathname, useRouter } from "next/navigation";

export default function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navItem = (path: string, label: string, icon: string) => {
    const active = pathname.startsWith(path);

    return (
      <div
        onClick={() => router.push(path)}
        className={`flex flex-col items-center justify-center flex-1 py-2 cursor-pointer transition ${
          active ? "text-black font-semibold" : "text-gray-500"
        }`}
      >
        <span className="material-icons text-2xl">{icon}</span>
        <span className="text-xs mt-1">{label}</span>
      </div>
    );
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex z-50">
      {navItem("/dashboard", "Home", "home")}
      {navItem("/pipeline", "Pipeline", "timeline")}
      {navItem("/notifications", "Alerts", "notifications")}
      {navItem("/profile", "Profile", "person")}
    </div>
  );
}
