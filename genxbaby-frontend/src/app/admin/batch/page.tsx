"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";
import { checkRegistryAddress } from "@/config/blockchain";
import { logAudit } from "@/lib/audit";

export default function BatchUploadPage() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [csvText, setCsvText] = useState("");
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Parse CSV into objects
  const parseCsv = () => {
    const rows = csvText.trim().split("\n");
    const parsed = rows.map((row) => {
      const [checkNumber, amount, memo] = row.split(",");
      return { checkNumber, amount, memo };
    });
    setChecks(parsed);
    setMessage(`Loaded ${parsed.length} checks`);
  };

  const uploadBatch = async () => {
    if (!checks.length) {
      setMessage("No checks loaded.");
      return;
    }

    setLoading(true);
    setMessage("Uploading batch…");

    try {
      for (const c of checks) {
        await writeContractAsync({
          address: checkRegistryAddress,
          abi: CheckRegistryAbi,
          functionName: "registerCheck",
          args: [c.checkNumber, c.amount, c.memo],
        });
      }

      // ⭐ AUDIT LOG
      await logAudit({
        actor: address!,
        action: "BATCH_UPLOAD",
        metadata: { count: checks.length },
      });

      setMessage(`Batch upload complete. ${checks.length} checks registered.`);
    } catch (err) {
      console.error(err);
      setMessage("Batch upload failed.");
    }

    setLoading(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Batch Upload Checks
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Paste CSV data in the format:
        <br />
        <span className="font-mono text-sm">
          checkNumber,amount,memo
        </span>
      </p>

      <textarea
        className="w-full h-40 border p-3 rounded bg-white dark:bg-[#1f1f1f] dark:border-[#333] dark:text-white"
        placeholder="12345,500,January rent\n12346,750,Invoice #88"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={parseCsv}
          className="px-4 py-2 bg-black text-white rounded dark:bg-[#333] dark:hover:bg-[#444]"
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

      {message && (
        <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
      )}

      {checks.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 dark:text-white">
            Parsed Checks
          </h2>

          <table className="w-full text-left bg-white dark:bg-[#1a1a1a] border dark:border-[#333]">
            <thead>
              <tr className="border-b dark:border-[#333]">
                <th className="p-2">Check #</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Memo</th>
              </tr>
            </thead>
            <tbody>
              {checks.map((c, idx) => (
                <tr key={idx} className="border-b dark:border-[#333]">
                  <td className="p-2">{c.checkNumber}</td>
                  <td className="p-2">{c.amount}</td>
                  <td className="p-2">{c.memo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
