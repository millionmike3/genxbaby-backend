import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function BankProfilesPage() {
  const profiles = await prisma.bankProfile.findMany({
    orderBy: { bankName: "asc" }
  });

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Bank Profiles</h1>

      <Link
        href="/bank-profiles/create"
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Add New Bank Profile
      </Link>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Bank Name</th>
            <th className="p-2 border">Routing #</th>
            <th className="p-2 border">Account #</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Next Check #</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {profiles.map((p) => (
            <tr key={p.id}>
              <td className="p-2 border">{p.bankName}</td>
              <td className="p-2 border">{p.routingNumber}</td>
              <td className="p-2 border">{p.accountNumber}</td>
              <td className="p-2 border">{p.accountType}</td>
              <td className="p-2 border">{p.nextCheckNumber}</td>
              <td className="p-2 border space-x-3">
                <Link href={`/bank-profiles/edit/${p.id}`} className="text-blue-600">
                  Edit
                </Link>

                <form action="/api/bank-profiles/delete" method="POST" className="inline">
                  <input type="hidden" name="id" value={p.id} />
                  <button className="text-red-600">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
