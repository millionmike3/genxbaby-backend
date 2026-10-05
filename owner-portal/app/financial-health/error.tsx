"use client";

import { logError } from "@/lib/logError";

export default function FinancialHealthError({ error, reset }) {
  logError(error, "Financial Health Page");

  return (
    <div className="ml-64 p-10">
      <div className="bg-red-900/40 border border-red-700 p-10 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-4">Financial health unavailable</h1>
        <p className="text-gray-300 mb-6">
          Something went wrong while loading your financial health metrics.
        </p>

        <button
          onClick={() => reset()}
          className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-500 transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
