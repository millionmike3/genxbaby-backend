import RiskTierBadge from "@/components/underwriting/RiskTierBadge";
import PricingCard from "@/components/underwriting/PricingCard";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  const overview = await api(`/owner-portal/${session.ownerId}/overview`);
  const latestRisk = overview.riskHistory?.[0];
  const latestPricing = overview.pricingHistory?.[0];

  return (
    <div className="ml-64 p-10 space-y-10">
      <h1 className="text-3xl font-bold text-white">Underwriting Summary</h1>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h2 className="text-xl font-semibold text-white mb-4">Risk Tier</h2>
        <RiskTierBadge tier={latestRisk?.riskTier || "N/A"} />
      </div>

      <PricingCard pricing={latestPricing} />
    </div>
  );
}
