export default function RiskTierBadge({ tier }) {
  const colors = {
    LOW: "bg-green-600",
    MEDIUM: "bg-yellow-600",
    HIGH: "bg-orange-600",
    EXTREME: "bg-red-600",
  };

  return (
    <span className={`px-4 py-2 rounded-lg text-white font-bold ${colors[tier]}`}>
      {tier}
    </span>
  );
}
