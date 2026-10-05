import { prisma } from "@/lib/prisma";

export async function getNextCheckNumber(profileId: number) {
  const profile = await prisma.bankProfile.findUnique({
    where: { id: profileId },
  });

  if (!profile) throw new Error("Bank profile not found");

  const checkNumber = profile.nextCheckNumber;

  await prisma.bankProfile.update({
    where: { id: profileId },
    data: { nextCheckNumber: { increment: 1 } },
  });

  return checkNumber;
}
