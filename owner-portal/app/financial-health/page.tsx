import FinancialHealthCard from "@/components/financial/FinancialHealthCard";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  const health = await api(`/owner-portal/${session.ownerId}/financial-health`);

  return (
    <div className="ml-64 p-10">
      <h1 className="text-3xl font-bold text-white mb-6">Financial Health</h1>
      <FinancialHealthCard health={health} />
    </div>
  );
}
