import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/logAudit";
import runFraudChecks from "@/lib/runFraudChecks";
import anchorMerkleRoot from "@/lib/anchorMerkleRoot";

export async function POST(req: Request) {
  try {
    const { rows } = await req.json();

    let created = 0;

    for (const row of rows) {
      const check = await prisma.check.create({
        data: {
          checkNumber: row.checkNumber,
          payee: row.payee,
          amount: row.amount,
          memo: row.memo,
          date: new Date(row.date),
          bankProfileId: "default-bank", // replace with real
          signerId: "default-signer", // replace with real
        },
      });

      created++;

      // FRAUD CHECKS + SAR
      await runFraudChecks(check);

      // AUDIT
      await logAudit("BATCH_CHECK_CREATED", {
        checkId: check.id,
        checkNumber: check.checkNumber,
      });
    }

    // ANCHOR MERKLE ROOT
    await anchorMerkleRoot();

    return NextResponse.json({ success: true, count: created });
  } catch (err) {
    console.error("BATCH UPLOAD ERROR:", err);
    return NextResponse.json({ error: "Batch upload failed" }, { status: 500 });
  }
}
