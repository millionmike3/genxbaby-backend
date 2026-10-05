// app/verify/[hash]/page.tsx
import { publicClient } from '@/lib/viem';
import {
  CHECK_REGISTRY_ADDRESS,
  CHECK_REGISTRY_ABI,
} from '@/lib/contract';
import { Hex } from 'viem';

type Props = {
  params: { hash: string };
};

async function fetchDocument(hash: string) {
  const documentHash = hash as Hex; // expecting 0x... format

  try {
    const result = await publicClient.readContract({
      address: CHECK_REGISTRY_ADDRESS,
      abi: CHECK_REGISTRY_ABI,
      functionName: 'getDocument',
      args: [documentHash],
    });

    const [user, timestamp, documentType, merkleRoot] = result as [
      string,
      bigint,
      string,
      Hex,
    ];

    return {
      user,
      timestamp: Number(timestamp) * 1000,
      documentType,
      merkleRoot,
    };
  } catch (e) {
    console.error('Error fetching document:', e);
    return null;
  }
}

export default async function VerifyPage({ params }: Props) {
  const { hash } = params;
  const data = await fetchDocument(hash);

  const verified = !!data;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
      <div className="max-w-xl w-full border border-slate-800 rounded-xl p-6 bg-slate-900/70 shadow-xl">
        <h1 className="text-2xl font-semibold mb-4">
          GEN X BABY — Document Verification
        </h1>

        <p className="text-xs text-slate-400 mb-4">
          Smart Contract:{' '}
          <span className="font-mono">
            0x683e29605c03EDE2bCB119eB461AAfFd39B55eec (Polygon Amoy)
          </span>
        </p>

        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-200">
            Document Hash
          </h2>
          <p className="font-mono text-xs break-all text-slate-300">
            {hash}
          </p>
        </div>

        {!verified && (
          <div className="mt-4 p-3 rounded-lg bg-red-900/40 border border-red-700 text-sm">
            <strong>Status:</strong> Not Found on Chain
            <br />
            This hash does not match any verified document in the GEN X BABY
            registry.
          </div>
        )}

        {verified && data && (
          <>
            <div className="mt-4 p-3 rounded-lg bg-emerald-900/40 border border-emerald-700 text-sm">
              <strong>Status:</strong> Verified on Chain
              <br />
              This document is anchored to the GEN X BABY smart contract and
              cannot be tampered with.
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div>
                <span className="font-semibold text-slate-200">
                  Document Type:
                </span>{' '}
                <span className="text-slate-300">{data.documentType}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-200">
                  Merkle Root:
                </span>{' '}
                <span className="font-mono text-xs break-all text-slate-300">
                  {data.merkleRoot}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-200">
                  User:
                </span>{' '}
                <span className="font-mono text-xs break-all text-slate-300">
                  {data.user}
                </span>
              </div>
              <div>
                <span className="font-semibold text-slate-200">
                  Timestamp:
                </span>{' '}
                <span className="text-slate-300">
                  {new Date(data.timestamp).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <a
                href={`https://amoy.polygonscan.com/address/${CHECK_REGISTRY_ADDRESS}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
              >
                View Contract on Polygonscan
              </a>
              <button
                className="text-xs px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600"
                onClick={() => window.print()}
              >
                Download Audit Report (Print)
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
