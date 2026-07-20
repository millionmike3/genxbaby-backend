"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { checkRegistryAddress } from "@/config/blockchain";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";

export default function VoidCheck() {
  const [checkNumber, setCheckNumber] = useState("");

  const { writeContract, isPending } = useWriteContract();

  const submit = () => {
    writeContract({
      address: checkRegistryAddress,
      abi: CheckRegistryAbi,
      functionName: "voidCheck",
      args: [checkNumber],
    });
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Void Check</h1>

      <div className="mt-6 space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="Check Number"
          value={checkNumber}
          onChange={(e) => setCheckNumber(e.target.value)}
        />

        <button
          onClick={submit}
          disabled={isPending}
          className="bg-red-600 text-white px-4 py-2"
        >
          {isPending ? "Voiding…" : "Void Check"}
        </button>
      </div>
    </div>
  );
}
