import { getBankProfiles } from "@/lib/bankProfiles";
import ChecksClient from "@/app/checks/ChecksClient";

export default async function Page() {
  const profiles = await getBankProfiles();

  const safeProfiles = profiles.map((p) => ({
    id: p.id,
    bankName: p.bankName,
    routingNumber: p.routingNumber,
    accountNumber: p.accountNumber,
    accountType: p.accountType,
    signerName: p.signerName,
    signatureImage: p.signatureImage ?? null,
    nextCheckNumber: p.nextCheckNumber,
    createdAt: p.createdAt.toISOString(),
  }));

  return <ChecksClient profiles={safeProfiles} />;
}
console.log("SERVER PAGE LOADED: CHECKS ROUTE");
