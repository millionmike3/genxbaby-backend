export default function AlertFilters({ severity, setSeverity, type, setType }) {
  return (
    <div className="flex space-x-3">
      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="ALL">All Severity</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="ALL">All Types</option>
        <option value="CHECK_HIGH_RISK">Check High Risk</option>
        <option value="DOCUMENT_HIGH_RISK">Document High Risk</option>
        <option value="OWNER_RISK_SPIKE">Owner Risk Spike</option>
      </select>
    </div>
  );
}
