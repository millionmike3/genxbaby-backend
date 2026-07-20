"use client";

import { useState } from "react";
import Link from "next/link";

export default function CheckTable({ checks, banks }) {
  const [search, setSearch] = useState("");
  const [bankFilter, setBankFilter] = useState("all");

  const filtered = checks.filter((c) => {
    const matchesSearch =
      c.payee.toLowerCase().includes(search.toLowerCase()) ||
      (c.memo || "").toLowerCase().includes(search.toLowerCase()) ||
      String(c.checkNo).includes(search);

    const matchesBank =
      bankFilter === "all" ? true : c.bankId === Number(bankFilter);

    return matchesSearch && matchesBank;
  });

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4">
        <input
          placeholder="Search checks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-64"
        />

        <select
          value={bankFilter}
          onChange={(e) => setBankFilter(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All Banks</option>
          {banks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.bankName}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="border rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Check #</th>
              <th className="p-2">Payee</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Bank</th>
              <th className="p-2">Issued</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.checkNo}</td>
                <td className="p-2">{c.payee}</td>
                <td className="p-2">${c.amount.toFixed(2)}</td>
                <td className="p-2">{c.bank.bankName}</td>
                <td className="p-2">
                  {new Date(c.createdAt).toLocaleString()}
                </td>
                <td className="p-2">
                  <Link
                    href={`/verify/check/${c.checkNo}`}
                    className="text-blue-600 underline"
                  >
                    Verify
                  </Link>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500">
                  No checks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
