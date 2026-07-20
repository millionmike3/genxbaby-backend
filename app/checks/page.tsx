import { PrismaClient } from "@prisma/client";
import ChecksClient from "./ChecksClient";

const prisma = new PrismaClient();

export default async function ChecksPage() {
  const profiles = await prisma.bankProfile.findMany({
    orderBy: { bankName: "asc" }
  });

  // Serialize for client component
  const safeProfiles = profiles.map((p) => ({
    id: p.id,
    bankName: p.bankName,
    routingNumber: p.routingNumber,
    accountNumber: p.accountNumber,
    accountType: p.accountType,
    signerName: p.signerName,
    signatureImage: p.signatureImage,
    nextCheckNumber: p.nextCheckNumber
  }));

  return <ChecksClient profiles={safeProfiles} />;
}
