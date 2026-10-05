export function RiskSignalsPanel({ signals }) {
  const items = [
    { label: "Fraud Score", value: signals.fraudScore },
    { label: "SAR Severity", value: signals.sarSeverity },
    { label: "Volatility Index", value: signals.volatilityIndex },
    { label: "Behavior Score", value: signals.behaviorScore },
    { label: "Bank Risk Score", value: signals.bankRiskScore },
  ];

  return (
    <div className="border rounded-lg p-4 shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Risk Signals</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="border rounded p-3 bg-gray-50 shadow-sm"
          >
            <div className="text-sm text-gray-600">{item.label}</div>
            <div className="text-2xl font-bold">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
