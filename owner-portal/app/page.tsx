import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import OwnerDashboardSkeleton from "@/components/skeletons/OwnerDashboardSkeleton";
import Hero from "@/components/home/Hero";
import OwnerHeader from "@/components/owner/OwnerHeader";
import OwnerSummaryCard from "@/components/owner/OwnerSummaryCard";
import FinancialHealthCard from "@/components/financial/FinancialHealthCard";
import IncomeVerificationCard from "@/components/income/IncomeVerificationCard";
import DocumentsTable from "@/components/documents/DocumentsTable";
import ChecksTable from "@/components/checks/ChecksTable";
import { api } from "@/lib/api";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  let overview, documents, checks, financialHealth, income;

  try {
    overview = await api(`/owner-portal/${session.ownerId}/overview`);
    documents = await api(`/owner-portal/${session.ownerId}/documents`);
    checks = await api(`/owner-portal/${session.ownerId}/checks`);
    financialHealth = await api(`/owner-portal/${session.ownerId}/financial-health`);
    income = await api(`/owner-portal/${session.ownerId}/income`);
  } catch (e) {
    return <OwnerDashboardSkeleton />;
  }

  return (
    <div className="ml-64 p-10 space-y-10">
      <Hero />
      <OwnerHeader owner={overview.owner} />
      <OwnerSummaryCard
        riskHistory={overview.riskHistory}
        pricingHistory={overview.pricingHistory}
        bankProfiles={overview.bankProfiles}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FinancialHealthCard health={financialHealth} />
        <IncomeVerificationCard income={income} />
      </div>
      <DocumentsTable documents={documents} />
      <ChecksTable checks={checks} />
    </div>
  );
}
