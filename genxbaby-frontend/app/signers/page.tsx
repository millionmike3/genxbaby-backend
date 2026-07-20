import { prisma } from "@/lib/prisma";

export default async function CreateSignerPage() {
  const bankProfiles = await prisma.bankProfile.findMany();

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add New Signer</h1>

      <form action="/api/signers/create" method="POST" className="space-y-4">

        <div>
          <label className="block font-medium">Name</label>
          <input name="name" className="border p-2 rounded w-full" required />
        </div>

        <div>
          <label className="block font-medium">Title</label>
          <input name="title" className="border p-2 rounded w-full" />
        </div>

        <div>
          <label className="block font-medium">Signature Image URL</label>
          <input name="signatureImage" className="border p-2 rounded w-full" required />
        </div>

        <div>
          <label className="block font-medium">Bank Profile</label>
          <select name="bankProfileId" className="border p-2 rounded w-full" required>
            {bankProfiles.map((bp) => (
              <option key={bp.id} value={bp.id}>
                {bp.bankName}
              </option>
            ))}
          </select>
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Signer
        </button>
      </form>
    </div>
  );
}

