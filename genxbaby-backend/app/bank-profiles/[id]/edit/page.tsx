import prisma from "@/lib/prisma";
import { updateBankProfile, uploadSignature } from "../../actions";

export default async function EditBankProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id; // Prisma expects a string ID

  const profile = await prisma.bankProfile.findUnique({
    where: { id },
  });

  if (!profile) {
    return <div className="p-10">Bank profile not found.</div>;
  }

  return (
    <div className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Edit Bank Profile</h1>

      {/* UPDATE PROFILE FORM */}
      <form action={updateBankProfile} className="space-y-4">
        <input type="hidden" name="id" value={profile.id} />

        <input
          name="bankName"
          defaultValue={profile.bankName}
          className="w-full border p-2 rounded"
        />

        <input
          name="routingNumber"
          defaultValue={profile.routingNumber}
          className="w-full border p-2 rounded"
        />

        <input
          name="accountNumber"
          defaultValue={profile.accountNumber}
          className="w-full border p-2 rounded"
        />

        <input
          name="nextCheckNumber"
          type="number"
          defaultValue={profile.nextCheckNumber}
          className="w-full border p-2 rounded"
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Changes
        </button>
      </form>

      <hr />

      {/* SIGNATURE SECTION */}
      <h2 className="text-xl font-semibold">Signature Image</h2>

      {profile.signatureImage && (
        <img
          src={profile.signatureImage}
          alt="Signature"
          className="h-20 border"
        />
      )}

      <form
        action={uploadSignature}
        className="space-y-4"
        encType="multipart/form-data"
      >
        <input type="hidden" name="id" value={profile.id} />

        <input type="file" name="signature" accept="image/*" required />

        <button className="px-4 py-2 bg-green-600 text-white rounded">
          Upload Signature
        </button>
      </form>
    </div>
  );
}
