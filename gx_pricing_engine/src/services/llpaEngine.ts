import { PrismaClient } from "@prisma/client";
import { LoanPricingInput } from "./types";

const prisma = new PrismaClient();

export async function computeLLPAForLoan(
  loan: LoanPricingInput
): Promise<number> {
  const groups = await prisma.lLPAGroup.findMany({
    where: { active: true },
    include: { adjustments: { where: { active: true } } },
    orderBy: { priority: "asc" },
  });

  let totalBps = 0;

  for (const group of groups) {
    for (const adj of group.adjustments) {
      if (matchesAdjustment(adj, loan)) {
        totalBps += adj.bps;
      }
    }
  }

  return totalBps;
}

function matchesAdjustment(
  adj: {
    minFico: number | null;
    maxFico: number | null;
    minLtv: number | null;
    maxLtv: number | null;
    occupancy: string | null;
    propertyType: string | null;
    purpose: string | null;
    loanType: string | null;
    termMonths: number | null;
    state: string | null;
    firstTimeHomebuyer: boolean | null;
    minImpulsivenessScore: number | null;
    maxImpulsivenessScore: number | null;
    requiresBluetoothPresence: boolean | null;
  },
  loan: LoanPricingInput
): boolean {
  if (adj.minFico !== null && loan.fico < adj.minFico) return false;
  if (adj.maxFico !== null && loan.fico > adj.maxFico) return false;

  if (adj.minLtv !== null && loan.ltv < adj.minLtv) return false;
  if (adj.maxLtv !== null && loan.ltv > adj.maxLtv) return false;

  if (adj.occupancy && adj.occupancy !== loan.occupancy) return false;
  if (adj.propertyType && adj.propertyType !== loan.propertyType) return false;
  if (adj.purpose && adj.purpose !== loan.purpose) return false;
  if (adj.loanType && adj.loanType !== loan.loanType) return false;

  if (adj.termMonths !== null && adj.termMonths !== loan.termMonths) return false;
  if (adj.state && adj.state !== loan.state) return false;

  if (
    adj.firstTimeHomebuyer !== null &&
    adj.firstTimeHomebuyer !== loan.firstTimeHomebuyer
  )
    return false;

  if (
    adj.minImpulsivenessScore !== null &&
    (loan.impulsivenessScore ?? 0) < adj.minImpulsivenessScore
  )
    return false;

  if (
    adj.maxImpulsivenessScore !== null &&
    (loan.impulsivenessScore ?? 0) > adj.maxImpulsivenessScore
  )
    return false;

  if (
    adj.requiresBluetoothPresence &&
    loan.bluetoothPresent !== true
  )
    return false;

  return true;
}
