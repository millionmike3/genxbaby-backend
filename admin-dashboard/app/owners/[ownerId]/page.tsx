import { api } from "@/lib/api";

export default async function OwnerDetail({ params }) {
  const data = await api(`/admin/owner/${params.ownerId}`);

  return (
    <div className="space-y-6">
      <OwnerHeader owner={data.owner} />
      <UsersTable users={data.users} />
      <BankProfilesTable bankProfiles={data.bankProfiles} />
      <RiskHistoryChart data={data.riskHistory} />
      <PricingHistoryChart data={data.pricingHistory} />
    </div>
  );
}
