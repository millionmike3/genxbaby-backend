import { createBankProfile } from "../actions";

export default function NewBankProfilePage() {
  return (
    <div className="p-10 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Add Bank Profile</h1>

      <form action={createBankProfile} className="space-y-4">
        <input
          name="bankName"
          placeholder="Bank Name"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="routingNumber"
          placeholder="Routing Number"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="accountNumber"
          placeholder="Account Number"
          className="w-full border p-2 rounded"
          required
        />

        <input
          name="nextCheckNumber"
          placeholder="Starting Check Number"
          type="number"
          className="w-full border p-2 rounded"
          required
        />

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save
        </button>
      </form>
    </div>
  );
}
