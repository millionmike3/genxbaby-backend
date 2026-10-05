import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPair(a: string, b: string): string {
  return crypto.createHash("sha256").update(a + b).digest("hex");
}

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: "asc" },
      take: 500,
    });

    if (!logs.length) {
      return NextResponse.json({ tree: [], leaves: [] });
    }

    const leaves = logs.map((l) => l.hash);
    let level = [...leaves];

    const tree: string[][] = [level];

    while (level.length > 1) {
      const next: string[] = [];

      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = level[i + 1] ?? left;
        next.push(hashPair(left, right));
      }

      level = next;
      tree.push(level);
    }

    return NextResponse.json({
      leaves,
      tree,
      root: tree[tree.length - 1][0],
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to build Merkle tree" }, { status: 500 });
  }
}
