import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function runFraudChecks(check) {
  const flags = [];

  // 1. Duplicate Payee (same payee within 7 days)
  const recent = await prisma.check.findMany({
    where: {
      payee: check.payee,
      createdAt: {
        gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    }
  });

  if (recent.length > 1) {
    flags.push({
      type: "duplicate_payee",
      severity: "warning",
      message: `Payee "${check.payee}" has received multiple checks recently.`
    });
  }

  // 2. High Amount (over $10,000)
  if (check.amount > 10000) {
    flags.push({
      type: "high_amount",
      severity: "critical",
      message: `Check amount $${check.amount} exceeds $10,000 threshold.`
    });
  }

  // 3. Velocity Check (more than 10 checks in 24 hours)
  const velocity = await prisma.check.count({
    where: {
      createdAt: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
      }
    }
  });

  if (velocity > 10) {
    flags.push({
      type: "velocity_spike",
      severity: "warning",
      message: `High check volume detected in the last 24 hours.`
    });
  }

  // Save flags
  for (const flag of flags) {
    await prisma.fraudFlag.create({
      data: {
        ...flag,
        checkId: check.id
      }
    });
  }

  return flags;
}
