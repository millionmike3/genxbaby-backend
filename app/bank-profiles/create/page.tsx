export default function CreateBankProfilePage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Add New Bank Profile</h1>

      <form action="/api/bank-profiles/create" method="POST" className="space-y-4">

        <div>
          <label className="block font-medium">Bank Name</label>
          <input name="bankName" className="border p-2 rounded w-full" required />
        </div>

        <div>
          <label className="block font-medium">Routing Number</label>
          <input name="routingNumber" className="border p-2 rounded w-full" required />
        </div>

        <div>
          <label className="block font-medium">Account Number</label>
          <input name="accountNumber" className="border p-2 rounded w-full" required />
        </div>

        <div>
          <label className="block font-medium">Account Type</label>
          <select name="accountType" className="border p-2 rounded w-full" required>
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
            className="border p-2 rounded w-full"
            required
          />
        </div>

        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Save Bank Profile
        </button>
      </form>
    </div>
  );
}
