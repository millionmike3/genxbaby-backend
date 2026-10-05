// src/services/underwriting.service.ts

import { runUnderwriting } from "../underwriting/decisionEngine";
import { UnderwritingInputs, UnderwritingResult } from "../types/underwriting.types";

/**
 * Executes underwriting and returns a result object.
 */
export async function runUnderwritingService(inputs: UnderwritingInputs): Promise<UnderwritingResult> {
  const decision = runUnderwriting(inputs);

  return {
    id: Date.now(), // placeholder, replace with DB ID
    borrowerId: inputs.borrower.id,
    applicationId: inputs.application.id,
    loanAmount: inputs.application.loanAmount,
    approved: decision.status === "APPROVED",
    riskScore: inputs.borrower.creditScore ?? undefined,
    decisionNotes: decision.notes,
    createdAt: new Date()
  };
}
