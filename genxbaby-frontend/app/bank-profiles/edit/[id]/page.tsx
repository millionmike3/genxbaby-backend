import { prisma } from "@/lib/prisma";

export default async function EditBankProfilePage({ params }) {
  const profile = await prisma.bankProfile.findUnique({
    where: { id: params.id }
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Bank Profile</h1>

      <form action="/api/bank-profiles/update" method="POST" className="space-y-4">
        <input type="hidden" name="id" value={profile.id} />

        <div>
          <label className="block font-medium">Bank Name</label>
          <input
            name="bankName"
            defaultValue={profile.bankName}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Routing Number</label>
          <input
            name="routingNumber"
            defaultValue={profile.routingNumber}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Account Number</label>
          <input
            name="accountNumber"
            defaultValue={profile.accountNumber}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Account Type</label>
          <select
            name="accountType"
            defaultValue={profile.accountType}
            className="border p-2 rounded w-full"
            required
          >
            <option value="Operating">Operating</option>
            <option value="Escrow">Escrow</option>
            <option value="Business">Business</option>
            <option value="Treasury">Treasury</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Next Check Number</label>
          <input
            name="nextCheckNumber"
            type="number"
            defaultValue={profile.nextCheckNumber}
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Update Bank Profile
        </button>
      </form>
    </div>
  );
}
