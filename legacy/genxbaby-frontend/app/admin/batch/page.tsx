"use client";

import { useState } from "react";

export default function BatchUploadPage() {
  const [csvText, setCsvText] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function parseCsv() {
    try {
      const lines = csvText.trim().split("\n");
      const parsed = lines.map((line) => {
        const [checkNumber, payee, amount, memo, date] = line.split(",");
        return {
          checkNumber: Number(checkNumber),
          payee,
          amount: Number(amount),
          memo: memo || null,
          date,
        };
      });

      setRows(parsed);
      setMessage(`Loaded ${parsed.length} checks`);
    } catch (err) {
      setMessage("CSV parsing error");
    }
  }

  async function uploadBatch() {
    if (rows.length === 0) {
      setMessage("No rows parsed.");
      return;
    }

    setLoading(true);
    setMessage("Uploading batch…");

    try {
      const res = await fetch("/api/admin/batch/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows }),
      });

      const json = await res.json();

      if (json.success) {
        setMessage(`Batch upload complete. ${json.count} checks created.`);
      } else {
        setMessage(json.error || "Batch upload failed.");
      }
    } catch (err) {
      console.error("Batch upload error:", err);
      setMessage("Batch upload failed.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen p-10 bg-gray-100 dark:bg-[#0f0f0f] text-black dark:text-white space-y-10">
      <h1 className="text-3xl font-bold">Batch Check Upload</h1>

      <p className="text-gray-600 dark:text-gray-400">
        Paste CSV in the format:
        <br />
        <span className="font-mono text-sm">
          checkNumber,payee,amount,memo,date
        </span>
      </p>

      {message && (
        <div className="p-3 bg-blue-100 text-blue-700 rounded">{message}</div>
      )}

      <textarea
        className="w-full h-40 p-3 rounded bg-white dark:bg-[#1f1f1f] dark:text-white border dark:border-gray-700"
        placeholder="12345,John Doe,500,Rent,2024-01-01\n12346,Jane Smith,750,Invoice,2024-01-02"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={parseCsv}
          className="px-4 py-2 bg-black text-white rounded dark:bg-[#333]"
        >
          Parse CSV
        </button>

        <button
          onClick={uploadBatch}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "Uploading…" : "Upload Batch"}
        </button>
      </div>

      {rows.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Parsed Checks</h2>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className="py-2">Check #</th>
                <th className="py-2">Payee</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Memo</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, idx) => (
                <tr key={idx} className="border-b dark:border-gray-700">
                  <td className="py-2">{r.checkNumber}</td>
                  <td className="py-2">{r.payee}</td>
                  <td className="py-2">${r.amount.toFixed(2)}</td>
                  <td className="py-2">{r.memo || "None"}</td>
                  <td className="py-2">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
