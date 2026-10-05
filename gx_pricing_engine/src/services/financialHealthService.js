function computeFinancialHealth({
  liquidityScore,
  incomeStability,
  debtLoadScore,
  cashFlowScore,
  overdraftRisk,
}) {
  // Weighted scoring model
  return Math.round(
    liquidityScore * 0.30 +
    incomeStability * 0.25 +
    cashFlowScore * 0.20 +
    (100 - debtLoadScore) * 0.15 +
    (100 - overdraftRisk) * 0.10
  );
}

module.exports = { computeFinancialHealth };
