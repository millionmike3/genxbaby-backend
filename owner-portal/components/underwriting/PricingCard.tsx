export default function PricingCard({ pricing }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-2">Pricing Decision</h3>

      <p className="text-gray-400">Base Rate: {pricing.baseRateBps} bps</p>
      <p className="text-gray-400">Margin: {pricing.marginBps} bps</p>

      <p className="text-3xl font-bold text-blue-400 mt-4">
        {pricing.finalRateBps} bps
      </p>
    </div>
  );
}
