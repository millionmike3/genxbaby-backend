import prisma from "@/lib/prisma";

export default async function VerifyCheckPage({ params }) {
  const checkNo = Number(params.checkNo);

  const check = await prisma.check.findUnique({
    where: { checkNumber: checkNo },
    include: { bank: true, signer: true }
  });

  if (!check) {
    return (
      <div className="p-10">
        <h1 className="text-2xl font-bold text-red-600">Invalid Check</h1>
        <p>No check exists with this number.</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold text-green-600">Valid Check</h1>

      <div className="space-y-2">
        <p><strong>Check Number:</strong> {check.checkNumber}</p>
        <p><strong>Payee:</strong> {check.payee}</p>
        <p><strong>Amount:</strong> ${check.amount.toFixed(2)}</p>
        <p><strong>Memo:</strong> {check.memo || "None"}</p>
        <p><strong>Date:</strong> {check.date}</p>
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-semibold">Bank Profile</h2>
        <p><strong>Bank:</strong> {check.bank.bankName}</p>
        <p><strong>Routing:</strong> {check.bank.routingNumber}</p>
        <p><strong>Account:</strong> {check.bank.accountNumber}</p>
      </div>

      <div className="pt-4">
        <h2 className="text-xl font-semibold">Signer</h2>
        <p><strong>Name:</strong> {check.signer.name}</p>
        <p><strong>Title:</strong> {check.signer.title}</p>
      </div>
    </div>
  );
}
