"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { checkRegistryAddress } from "@/config/blockchain";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";

export default function RegisterCheck() {
  const [form, setForm] = useState({ checkNumber: "", amount: "", memo: "" });

  const { writeContract, isPending } = useWriteContract();

  const submit = () => {
    writeContract({
      address: checkRegistryAddress,
      abi: CheckRegistryAbi,
      functionName: "registerCheck",
      args: [form.checkNumber, form.amount, form.memo],
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Register Check</h1>

      <div className="mt-6 space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Check Number"
          value={form.checkNumber}
          onChange={(e) => setForm({ ...form, checkNumber: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />

        <input
          className="border p-2 w-full"
          placeholder="Memo"
          value={form.memo}
          onChange={(e) => setForm({ ...form, memo: e.target.value })}
        />

        <button
          onClick={submit}
          disabled={isPending}
          className="bg-black text-white px-4 py-2"
        >
          {isPending ? "Submitting…" : "Register Check"}
        </button>
      </div>
    </div>
  );
}
