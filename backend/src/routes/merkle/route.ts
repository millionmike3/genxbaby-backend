// app/api/merkle/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

// Hash helper (SHA-256 → hex → 0x-prefixed)
function sha256(data: string): string {
  return "0x" + crypto.createHash("sha256").update(data).digest("hex");
}

// Build Merkle tree from array of leaf hashes
function buildMerkleTree(leaves: string[]) {
  if (leaves.length === 0) {
    return { tree: [], root: null };
  }

  let level = [...leaves];
  const tree: string[][] = [level];

  while (level.length > 1) {
    const nextLevel: string[] = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left; // duplicate last if odd count

      const combined = left + right.replace("0x", "");
      const parentHash = sha256(combined);

      nextLevel.push(parentHash);
    }

    level = nextLevel;
    tree.push(level);
  }

  return {
    tree,
    root: level[0],
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !Array.isArray(body.documents)) {
      return NextResponse.json(
        { error: "Payload must include { documents: [...] }" },
        { status: 400 }
      );
    }

    const docs = body.documents;

    // Normalize + hash each leaf
    const leaves = docs.map((doc) => {
      const normalized =
        typeof doc === "string"
          ? doc
          : JSON.stringify(doc, Object.keys(doc).sort());

      return sha256(normalized);
    });

    // Build Merkle tree
    const { tree, root } = buildMerkleTree(leaves);

    return NextResponse.json({
      leaves,
      tree,
      root,
      anchorReadyRoot: root, // already 0x-prefixed hex
    });
  } catch (err) {
    console.error("Merkle API error:", err);
    return NextResponse.json(
      { error: "Failed to build Merkle tree" },
      { status: 500 }
    );
  }
}
