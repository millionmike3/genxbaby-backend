import prisma from "@/lib/prisma";

export default async function VerifyCheckPage({ params }) {
  const checkNumber = Number(params.checkNumber);

  const check = await prisma.check.findFirst({
    where: { checkNumber },
    include: {
      bankProfile: true,
      signer: true,
      fraudFlags: true
    }
  });

  if (!check) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-500">Check Not Found</h1>
        <p>This check number does not exist or has been voided.</p>
      </div>
    );
  }

  const issued = new Date(check.createdAt).toLocaleString();

  return (
    <div className="p-10 space-y-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600">Check Verified</h1>

      <div className="space-y-2 border p-4 rounded bg-gray-50">
        <p><strong>Check Number:</strong> {check.checkNumber}</p>
        <p><strong>Payee:</strong> {check.payee}</p>
        <p><strong>Amount:</strong> ${check.amount.toFixed(2)}</p>
        <p><strong>Memo:</strong> {check.memo || "None"}</p>
        <p><strong>Issued:</strong> {issued}</p>

        <p>
          <strong>Signer:</strong>{" "}
          {check.signer?.name} ({check.signer?.title})
        </p>
      </div>

      <div className="pt-4 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-semibold">Bank Profile</h2>
        <p><strong>Bank:</strong> {check.bankProfile.bankName}</p>
        <p><strong>Routing:</strong> {check.bankProfile.routingNumber}</p>
        <p><strong>Account:</strong> {check.bankProfile.accountNumber}</p>
      </div>

      {check.fraudFlags.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h3 className="font-semibold text-red-700">Fraud Alerts</h3>
          {check.fraudFlags.map((flag) => (
            <p key={flag.id} className="text-sm text-red-700">
              • {flag.message}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
