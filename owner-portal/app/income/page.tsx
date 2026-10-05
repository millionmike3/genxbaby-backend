import IncomeVerificationCard from "@/components/income/IncomeVerificationCard";
import { api } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getSession();
  if (!session) redirect("/login");

  const income = await api(`/owner-portal/${session.ownerId}/income`);

  return (
    <div className="ml-64 p-10">
      <h1 className="text-3xl font-bold text-white mb-6">Income Verification</h1>
      <IncomeVerificationCard income={income} />
    </div>
  );
}
