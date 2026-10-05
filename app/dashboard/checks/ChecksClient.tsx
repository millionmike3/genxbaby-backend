"use client";

import { useState } from "react";

export default function ChecksClient() {
  const [bankId, setBankId] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [result, setResult] = useState(null);

  async function generateCheck() {
    const res = await fetch("/api/checks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bankId: Number(bankId),
        payee,
        amount: Number(amount),
        memo,
      }),
    });

    const data = await res.json();
    setResult(data);
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Certified Checks</h1>

      <div className="space-y-4 p-6 border rounded-lg bg-[#111]">
        <input
          className="w-full p-2 rounded bg-[#222]"
          placeholder="Bank ID"
          value={bankId}
          onChange={(e) => setBankId(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-[#222]"
          placeholder="Payee"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-[#222]"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          className="w-full p-2 rounded bg-[#222]"
          placeholder="Memo (optional)"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <button
          onClick={generateCheck}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Generate Check
        </button>
      </div>

      {result && (
        <div className="p-4 border rounded bg-[#111]">
          <h2 className="text-xl font-semibold mb-2">Check Created</h2>
          <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
console.log("PAGE LOADED: /dashboard/checks");
