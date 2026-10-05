import { prisma } from "./prisma";

export async function getBankProfiles() {
  const profiles = await prisma.bankProfile.findMany({
    orderBy: { bankName: "asc" },
  });

  return profiles;
}
