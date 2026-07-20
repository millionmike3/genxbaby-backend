import prisma from "@/lib/prisma";
import CheckHistoryClient from "./CheckHistoryClient";

export default async function CheckHistoryPage() {
  const checks = await prisma.check.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      bankProfile: true,
      signer: true,
      fraudFlags: true,
    },
  });

  return <CheckHistoryClient checks={checks} />;
}
