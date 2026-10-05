import { RiskDashboard } from "@/components/risk/RiskDashboard";

export default async function Page({ params }) {
  const { ownerId } = params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/risk/dashboard/${ownerId}`,
    { cache: "no-store" }
  );

  const dashboard = await res.json();

  return (
    <div className="p-6">
      <RiskDashboard data={dashboard} />
    </div>
  );
}
