export default function Sidebar({ onNavigate }) {
  const items = [
    { key: "owners", label: "Owners" },
    { key: "fraud", label: "Fraud Intelligence" },
    { key: "synthetic", label: "Synthetic Identity" },
    { key: "underwriting", label: "Underwriting" },
    { key: "cases", label: "Cases" },
    { key: "alerts", label: "Alerts" },
  ];

  return (
    <div className="w-64 bg-[#111118] text-gray-200 h-screen p-4 space-y-4">
      <h1 className="text-xl font-bold mb-6">Admin Dashboard</h1>

      {items.map((item) => (
        <button
          key={item.key}
          className="w-full text-left px-3 py-2 rounded hover:bg-white/10"
          onClick={() => onNavigate(item.key)}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
