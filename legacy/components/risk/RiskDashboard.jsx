export function RiskDashboard({ data }) {
  const {
    ownerId,
    signals,
    riskScore,
    tier,
    tierAdjustmentBps,
    pricingPreview,
  } = data;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Risk Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RiskScoreCard riskScore={riskScore} tier={tier} />
        <PricingPreviewCard pricing={pricingPreview} />
      </div>

      <RiskSignalsPanel signals={signals} />
    </div>
  );
}
