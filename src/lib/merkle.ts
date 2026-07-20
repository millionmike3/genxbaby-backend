import crypto from "crypto";

function hashPair(a: string, b: string): string {
  const combined = a + b;
  return crypto.createHash("sha256").update(combined).digest("hex");
}

export function buildMerkleRoot(hashes: string[]): string | null {
  if (!hashes.length) return null;

  let level = [...hashes];

  while (level.length > 1) {
    const next: string[] = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] ?? left; // duplicate last if odd
      next.push(hashPair(left, right));
    }

    level = next;
  }

  return level[0];
}
