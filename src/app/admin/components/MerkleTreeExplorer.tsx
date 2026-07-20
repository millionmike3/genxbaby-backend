"use client";

import { useEffect, useState } from "react";

export default function MerkleTreeExplorer() {
  const [tree, setTree] = useState<string[][]>([]);
  const [leaves, setLeaves] = useState<string[]>([]);
  const [root, setRoot] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTree = async () => {
    try {
      const res = await fetch("/api/audit/merkle-tree");
      const data = await res.json();

      setTree(data.tree || []);
      setLeaves(data.leaves || []);
      setRoot(data.root || "");
    } catch (err) {
      console.error("Failed to load Merkle tree", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTree();
  }, []);

  return (
    <div className="border rounded p-6 bg-white dark:bg-[#1a1a1a] dark:border-[#333]">
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Merkle Tree Explorer
      </h2>

      {loading && (
        <p className="text-gray-700 dark:text-gray-300">Loading tree…</p>
      )}

      {!loading && (
        <>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Root:
          </p>

          <div className="font-mono text-xs p-3 bg-gray-100 dark:bg-[#222] rounded mb-6">
            {root || "No root"}
          </div>

          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Leaves (Audit Log Hashes)
          </h3>

          <div className="space-y-2 mb-6">
            {leaves.map((leaf, i) => (
              <div
                key={i}
                className="font-mono text-xs p-2 bg-gray-100 dark:bg-[#222] rounded"
              >
                {i}. {leaf}
              </div>
            ))}
          </div>

          <h3 className="text-lg font-semibold mb-2 dark:text-white">
            Tree Levels
          </h3>

          <div className="space-y-6">
            {tree.map((level, i) => (
              <div key={i}>
                <p className="font-semibold dark:text-white mb-2">
                  Level {i} ({level.length} nodes)
                </p>

                <div className="space-y-2">
                  {level.map((node, j) => (
                    <div
                      key={j}
                      className="font-mono text-xs p-2 bg-gray-100 dark:bg-[#222] rounded"
                    >
                      {node}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
