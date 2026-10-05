import crypto from "crypto";

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

export function generateMerkleRoot(payload) {
  const leaves = Object.entries(payload).map(([key, value]) =>
    sha256(`${key}:${JSON.stringify(value)}`)
  );

  if (leaves.length === 0) return sha256("empty");

  let level = leaves;

  while (level.length > 1) {
    const nextLevel = [];

    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left; // duplicate last leaf if odd count
      nextLevel.push(sha256(left + right));
    }

    level = nextLevel;
  }

  return level[0];
}
