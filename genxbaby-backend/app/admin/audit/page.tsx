import { cookies } from "next/headers";
import { getUserFromCookie, requireAdmin } from "@/lib/auth";

import { publicClient } from "@/lib/viem";
import {
  CHECK_REGISTRY_ADDRESS,
  CHECK_REGISTRY_ABI,
} from "@/lib/contract";
import { Hex, Log } from "viem";

// ------------------
// Fetch Functions
// ------------------

async function fetchLatestAuditRoot() {
  try {
    const root = await publicClient.readContract({
      address: CHECK_REGISTRY_ADDRESS,
      abi: CHECK_REGISTRY_ABI,
      functionName: "latestAuditRoot",
      args: [],
    });

    return root as Hex;
  } catch (e) {
    console.error("Error fetching latestAuditRoot:", e);
    return null;
  }
}

async function fetchAuditRootAnchoredEvents() {
  try {
    const logs = await publicClient.getLogs({
      address: CHECK_REGISTRY_ADDRESS,
      event: {
        type: "event",
        name: "AuditRootAnchored",
        inputs: [
          { name: "root", type: "bytes32", indexed: false },
          { name: "timestamp", type: "uint256", indexed: false },
          { name: "actor", type: "address", indexed: true },
        ],
        anonymous: false,
      },
      fromBlock: "0x0",
      toBlock: "latest",
    });

    return logs as Log[];
  } catch (e) {
    console.error("Error fetching AuditRootAnchored logs:", e);
    return [];
  }
}

async function fetchCheckEvents() {
  try {
    const registeredLogs = await publicClient.getLogs({
      address: CHECK_REGISTRY_ADDRESS,
      event: {
        type: "event",
        name: "CheckRegistered",
        inputs: [
          { name: "checkNumber", type: "string", indexed: false },
          { name: "amount", type: "uint256", indexed: false },
          { name: "memo", type: "string", indexed: false },
          { name: "actor", type: "address", indexed: true },
        ],
        anonymous: false,
      },
      fromBlock: "0x0",
      toBlock: "latest",
    });

    const voidedLogs = await publicClient.getLogs({
      address: CHECK_REGISTRY_ADDRESS,
      event: {
        type: "event",
        name: "CheckVoided",
        inputs: [
          { name: "checkNumber", type: "string", indexed: false },
          { name: "actor", type: "address", indexed: true },
        ],
        anonymous: false,
      },
      fromBlock: "0x0",
      toBlock: "latest",
    });

    return {
      registered: registeredLogs as Log[],
      voided: voidedLogs as Log[],
    };
  } catch (e) {
    console.error("Error fetching check logs:", e);
    return { registered: [], voided: [] };
  }
}

// ------------------
// Unified Page Export
// ------------------

export default async function AuditAdminPage() {
  // 1. RBAC Check
  const cookieHeader = cookies().toString();
  const session = getUserFromCookie(cookieHeader);

  if (!requireAdmin(session)) {
    return (
      <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <div className="p-6 border border-red-700 bg-red-900/40 rounded-xl">
          <h1 className="text-xl font-semibold mb-2">Access Denied</h1>
          <p className="text-sm text-red-200">
            Admin privileges required.
          </p>
        </div>
      </main>
    );
  }

  // 2. Load Audit Data
  const latestRoot = await fetchLatestAuditRoot();
  const auditEvents = await fetchAuditRootAnchoredEvents();
  const checkEvents = await fetchCheckEvents();

  // 3. Render Audit Explorer
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">
              GEN X BABY — Audit Explorer
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Smart Contract:{" "}
              <span className="font-mono">
                0x683e29605c03EDE2bCB119eB461AAfFd39B55eec (Polygon Amoy)
              </span>
            </p>
          </div>
          <a
            href={`https://amoy.polygonscan.com/address/${CHECK_REGISTRY_ADDRESS}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
          >
            View on Polygonscan
          </a>
        </header>

        {/* Latest Audit Root */}
        <section className="border border-slate-800 rounded-xl p-6 bg-slate-900/70">
          <h2 className="text-lg font-semibold mb-3">Latest Anchored Audit Root</h2>
          {latestRoot ? (
            <p className="font-mono text-xs break-all text-emerald-300">
              {latestRoot}
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              No audit root anchored yet.
            </p>
          )}
        </section>

        {/* Audit Root History */}
        <section className="border border-slate-800 rounded-xl p-6 bg-slate-900/70">
          <h2 className="text-lg font-semibold mb-3">Audit Root History</h2>
          {auditEvents.length === 0 ? (
            <p className="text-sm text-slate-400">
              No AuditRootAnchored events found.
            </p>
          ) : (
            <div className="space-y-3">
              {auditEvents
                .slice()
                .reverse()
                .map((log, idx) => {
                  const root = log.args?.root as Hex;
                  const timestamp = Number(log.args?.timestamp ?? 0) * 1000;
                  const actor = log.args?.actor as string;

                  return (
                    <div
                      key={idx}
                      className="border border-slate-800 rounded-lg p-3 bg-slate-900/80 text-xs"
                    >
                      <div className="mb-1">
                        <span className="font-semibold text-slate-200">
                          Root:
                        </span>{" "}
                        <span className="font-mono break-all text-slate-300">
                          {root}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">
                          Timestamp:
                        </span>{" "}
                        <span className="text-slate-300">
                          {timestamp
                            ? new Date(timestamp).toLocaleString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-200">
                          Actor:
                        </span>{" "}
                        <span className="font-mono break-all text-slate-300">
                          {actor}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </section>

        {/* Registered + Voided Checks */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Registered Checks */}
          <div className="border border-slate-800 rounded-xl p-6 bg-slate-900/70">
            <h2 className="text-lg font-semibold mb-3">Registered Checks</h2>
            {checkEvents.registered.length === 0 ? (
              <p className="text-sm text-slate-400">
                No CheckRegistered events found.
              </p>
            ) : (
              <div className="space-y-3">
                {checkEvents.registered
                  .slice()
                  .reverse()
                  .map((log, idx) => {
                    const checkNumber = log.args?.checkNumber as string;
                    const amount = log.args?.amount as bigint;
                    const memo = log.args?.memo as string;
                    const actor = log.args?.actor as string;

                    return (
                      <div
                        key={idx}
                        className="border border-slate-800 rounded-lg p-3 bg-slate-900/80 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-200">
                            Check #:
                          </span>{" "}
                          <span className="text-slate-300">
                            {checkNumber}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200">
                            Amount:
                          </span>{" "}
                          <span className="text-slate-300">
                            {Number(amount)}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200">
                            Memo:
                          </span>{" "}
                          <span className="text-slate-300">{memo}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200">
                            Actor:
                          </span>{" "}
                          <span className="font-mono break-all text-slate-300">
                            {actor}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Voided Checks */}
          <div className="border border-slate-800 rounded-xl p-6 bg-slate-900/70">
            <h2 className="text-lg font-semibold mb-3">Voided Checks</h2>
            {checkEvents.voided.length === 0 ? (
              <p className="text-sm text-slate-400">
                No CheckVoided events found.
              </p>
            ) : (
              <div className="space-y-3">
                {checkEvents.voided
                  .slice()
                  .reverse()
                  .map((log, idx) => {
                    const checkNumber = log.args?.checkNumber as string;
                    const actor = log.args?.actor as string;

                    return (
                      <div
                        key={idx}
                        className="border border-slate-800 rounded-lg p-3 bg-slate-900/80 text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-200">
                            Check #:
                          </span>{" "}
                          <span className="text-slate-300">
                            {checkNumber}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-200">
                            Actor:
                          </span>{" "}
                          <span className="font-mono break-all text-slate-300">
                            {actor}
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
