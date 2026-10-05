export function PricingPreviewCard({ pricing }) {
  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h2 className="text-xl font-semibold mb-2">Pricing Preview</h2>

      <div className="space-y-2">
        <div>
          <span className="font-semibold">Base Rate:</span>{" "}
          {pricing.baseRatePercent}%
        </div>
        <div>
          <span className="font-semibold">Margin:</span>{" "}
          {pricing.marginPercent}%
        </div>
        <div>
          <span className="font-semibold">Final Rate:</span>{" "}
          {pricing.finalRatePercent}%
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full"
            style={{ width: `${pricing.finalRatePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
