const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const prisma = new PrismaClient();

function hashLog(log) {
  const str = JSON.stringify({
    action: log.action,
    adminId: log.adminId,
    createdAt: log.createdAt,
    ip: log.ip,
    metadata: log.metadata,
  });
  return crypto.createHash("sha256").update(str).digest("hex");
}

function buildMerkleRoot(hashes) {
  if (hashes.length === 0) return null;
  let level = hashes;

  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      const left = level[i];
      const right = level[i + 1] || left;
      const combined = crypto
        .createHash("sha256")
        .update(left + right)
        .digest("hex");
      next.push(combined);
    }
    level = next;
  }

  return level[0];
}

async function anchorAuditBatch() {
  const logs = await prisma.auditLog.findMany({
    orderBy: { id: "asc" },
  });

  const hashes = logs.map(hashLog);
  const root = buildMerkleRoot(hashes);

  if (!root) return null;

  const anchor = await prisma.auditAnchor.create({
    data: {
      root,
      count: logs.length,
    },
  });

  return anchor;
}

module.exports = { anchorAuditBatch };
