"use client";

import Link from "next/link";
import { logError } from "@/lib/logError";

export default function GlobalError({ error, reset }) {
  logError(error, "Global Error Boundary");

  return (
    <div className="ml-64 p-10">
      <div className="bg-red-900/40 border border-red-700 p-10 rounded-xl text-white">
        <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>

        <p className="text-gray-300 mb-6">
          An unexpected error occurred. You can try again or return to the dashboard.
        </p>

        <div className="flex gap-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-500 transition"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="px-6 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
