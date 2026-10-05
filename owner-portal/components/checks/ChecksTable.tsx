export default function ChecksTable({ checks }) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow-lg">
      <h3 className="text-xl font-bold text-white mb-4">Checks</h3>

      <table className="w-full text-left text-gray-300">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-2">Check #</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {checks.map((check) => (
            <tr key={check.id} className="border-b border-gray-800">
              <td className="py-3">{check.checkNumber}</td>
              <td>${check.amount}</td>
              <td>{check.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
