"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { checkRegistryAddress } from "@/config/blockchain";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";

export default function ViewChecks() {
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const { data: checks, isLoading } = useReadContract({
    address: checkRegistryAddress,
    abi: CheckRegistryAbi,
    functionName: "getAllChecks",
  });

  useEffect(() => {
    if (!checks) return;

    const normalized = checks.map((c) => ({
      checkNumber: c.checkNumber.toString(),
      amount: Number(c.amount),
      memo: c.memo,
      registeredAt: Number(c.registeredAt),
      voided: c.voided,
    }));

    if (!search) {
      setFiltered(normalized);
      return;
    }

    const s = search.toLowerCase();

    setFiltered(
      normalized.filter(
        (c) =>
          c.checkNumber.toLowerCase().includes(s) ||
          c.memo.toLowerCase().includes(s)
      )
    );
  }, [checks, search]);

  return (
    <div>
      <h1 className="text-xl font-bold">View Checks</h1>

      <div className="mt-6">
        <input
          className="border p-2 w-full"
          placeholder="Search by check number or memo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <p className="mt-4 text-gray-600">Loading checks…</p>}

      {!isLoading && filtered.length === 0 && (
        <p className="mt-4 text-gray-600">No checks found.</p>
      )}

      <div className="mt-6 border rounded">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Check #</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Memo</th>
              <th className="p-2">Registered</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c, i) => {
              const rowClass = c.voided
                ? "check-row voided"
                : "check-row registered";

              return (
                <tr key={i} className={rowClass}>
                  <td className="p-2">{c.checkNumber}</td>
                  <td className="p-2">${c.amount.toFixed(2)}</td>
                  <td className="p-2">{c.memo}</td>
                  <td className="p-2">
                    {new Date(c.registeredAt * 1000).toLocaleString()}
                  </td>
                  <td className="p-2">
                    {c.voided ? (
                      <span className="text-red-600 font-semibold">Voided</span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Registered
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
