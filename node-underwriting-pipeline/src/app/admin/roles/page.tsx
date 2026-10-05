"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract } from "wagmi";
import CheckRegistryAbi from "@/abi/CheckRegistry.json";
import { checkRegistryAddress } from "@/config/blockchain";
import { logAudit } from "@/lib/audit";

export default function RoleManagerPage() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [target, setTarget] = useState("");
  const [roles, setRoles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch roles for a target wallet
  const fetchRoles = async () => {
    if (!target) {
      setMessage("Enter a wallet address.");
      return;
    }

    setLoading(true);
    setMessage("Checking roles…");

    try {
      const res = await fetch("/api/auth/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: target }),
      });

      const data = await res.json();
      setRoles(data);
      setMessage("Roles loaded.");
    } catch (err) {
      console.error(err);
      setMessage("Failed to load roles.");
    }

    setLoading(false);
  };

  // Grant a role
  const grantRole = async (roleName) => {
    if (!target) return;

    try {
      await writeContractAsync({
        address: checkRegistryAddress,
        abi: CheckRegistryAbi,
        functionName: "grantRole",
        args: [roleName, target],
      });

      // ⭐ AUDIT LOG
      await logAudit({
        actor: address!,
        action: "GRANT_ROLE",
        target,
        metadata: { role: roleName },
      });

      setMessage(`Granted ${roleName} to ${target}`);
      fetchRoles();
    } catch (err) {
      console.error(err);
      setMessage("Grant failed.");
    }
  };

  // Revoke a role
  const revokeRole = async (roleName) => {
    if (!target) return;

    try {
      await writeContractAsync({
        address: checkRegistryAddress,
        abi: CheckRegistryAbi,
        functionName: "revokeRole",
        args: [roleName, target],
      });

      // ⭐ AUDIT LOG
      await logAudit({
        actor: address!,
        action: "REVOKE_ROLE",
        target,
        metadata: { role: roleName },
      });

      setMessage(`Revoked ${roleName} from ${target}`);
      fetchRoles();
    } catch (err) {
      console.error(err);
      setMessage("Revoke failed.");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">
        Role Management
      </h1>

      <p className="text-gray-600 dark:text-gray-400 mb-4">
        Enter a wallet address to view or modify its roles.
      </p>

      <input
        className="border p-3 w-full rounded bg-white dark:bg-[#1f1f1f] dark:border-[#333] dark:text-white"
        placeholder="0x1234..."
        value={target}
        onChange={(e) => setTarget(e.target.value)}
      />

      <button
        onClick={fetchRoles}
        className="mt-4 px-4 py-2 bg-black text-white rounded dark:bg-[#333] dark:hover:bg-[#444]"
      >
        Check Roles
      </button>

      {message && (
        <p className="mt-4 text-gray-700 dark:text-gray-300">{message}</p>
      )}

      {loading && <p className="mt-4">Loading…</p>}

      {roles && (
        <div className="mt-8 border rounded p-6 bg-white dark:bg-[#1a1a1a] dark:border-[#333]">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Current Roles
          </h2>

          <p className="mb-2">
            <strong>Admin:</strong> {roles.admin ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <strong>Register:</strong> {roles.register ? "Yes" : "No"}
          </p>
          <p className="mb-2">
            <strong>Void:</strong> {roles.void ? "Yes" : "No"}
          </p>

          <div className="mt-6">
            <h3 className="font-semibold mb-2 dark:text-white">Grant Roles</h3>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => grantRole("DEFAULT_ADMIN_ROLE")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Grant Admin
              </button>

              <button
                onClick={() => grantRole("REGISTER_ROLE")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Grant Register
              </button>

              <button
                onClick={() => grantRole("VOID_ROLE")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Grant Void
              </button>
            </div>

            <h3 className="font-semibold mt-6 mb-2 dark:text-white">
              Revoke Roles
            </h3>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={() => revokeRole("DEFAULT_ADMIN_ROLE")}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Revoke Admin
              </button>

              <button
                onClick={() => revokeRole("REGISTER_ROLE")}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Revoke Register
              </button>

              <button
                onClick={() => revokeRole("VOID_ROLE")}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Revoke Void
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
