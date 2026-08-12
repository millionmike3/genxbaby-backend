import { useChecks } from '@/hooks/useChecks';

export default function ChecksPage() {
  const { checks, loading } = useChecks();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Checks</h1>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Check #</th>
            <th>Payee</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {checks.map((c) => (
            <tr key={c.id}>
              <td>{c.checkNumber}</td>
              <td>{c.payee}</td>
              <td>${c.amount}</td>
              <td>{c.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
