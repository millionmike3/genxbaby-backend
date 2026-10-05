"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { logAudit } from "@/lib/audit";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";
import { checkRegistryAddress } from "@/config/blockchain";

export default function VoidPage() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();

  const [checkNumber, setCheckNumber] = useState("");

  const voidCheck = async () => {
    await writeContract({
      address: checkRegistryAddress,
      abi: CheckRegistryAbi,
      functionName: "voidCheck",
      args: [checkNumber],
    });

    // ⭐ THIS IS WHERE THE AUDIT LOG GOES
    await logAudit({
      actor: address!,
      action: "VOID_CHECK",
      target: checkNumber,
    });
  };

  return (
    <div>
      {/* your UI */}
    </div>
  );
}
