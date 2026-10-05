import prisma from "@/lib/prisma";
import CheckTable from "../CheckTable";

export default async function CheckLogsPage() {
  const checks = await prisma.check.findMany({
    orderBy: { createdAt: "desc" },
    include: { bank: true },
  });

  const banks = await prisma.bankProfile.findMany({
    orderBy: { bankName: "asc" },
  });

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold">Check Logs</h1>

      <CheckTable checks={checks} banks={banks} />
    </div>
  );
}
