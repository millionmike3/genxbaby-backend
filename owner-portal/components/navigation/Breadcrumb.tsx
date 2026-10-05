"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Breadcrumb() {
  const pathname = usePathname();

  // Split path into segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return { href, label };
  });

  return (
    <nav className="text-gray-400 text-sm mb-6">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
        </li>

        {crumbs.map((crumb, idx) => (
          <li key={idx} className="flex items-center space-x-2">
            <span>/</span>
            <Link
              href={crumb.href}
              className="hover:text-white transition capitalize"
            >
              {crumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
