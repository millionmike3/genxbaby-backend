export const determineDecision = (riskScore) => {
  if (riskScore >= 75) return { status: "APPROVE", tier: "A" };
  if (riskScore >= 60) return { status: "CONDITIONAL", tier: "B" };
  return { status: "REJECT", tier: "C" };
};
