"use client";

import { logError } from "@/lib/logError";

export default function DocumentsError({ error, reset }) {
  logError(error, "Documents Page");

  return (
    <div className="ml-64 p-10">
      <div className="bg-red-900/40 border border-red-700 p-10 rounded-xl text-white">
        <h1 className="text-2xl font-bold mb-4">Failed to load documents</h1>
        <p className="text-gray-300 mb-6">
          Something went wrong while fetching your documents.
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
