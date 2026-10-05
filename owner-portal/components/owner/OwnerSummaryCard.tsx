export default function OwnerSummaryCard({ riskHistory, pricingHistory, bankProfiles }) {
  const latestRisk = riskHistory?.[0];
  const latestPricing = pricingHistory?.[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
        <h3 className="text-lg font-semibold text-white">Risk Tier</h3>
        <p className="text-3xl font-bold mt-2 text-[#3CF46B]">
          {latestRisk?.riskTier || "N/A"}
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
        <h3 className="text-lg font-semibold text-white">Final Rate (bps)</h3>
        <p className="text-3xl font-bold mt-2 text-blue-400">
          {latestPricing?.finalRateBps || "N/A"}
        </p>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
        <h3 className="text-lg font-semibold text-white">Bank Profiles</h3>
        <p className="text-3xl font-bold mt-2 text-gray-300">
          {bankProfiles?.length || 0}
        </p>
      </div>
    </div>
  );
}
