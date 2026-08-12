export default function AlertTabs({ tab, setTab }) {
  const tabs = ["ALL", "HIGH", "MEDIUM", "LOW"];

  return (
    <div className="flex space-x-3 border-b pb-2">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`px-3 py-1 rounded font-semibold ${
            tab === t ? "bg-blue-600 text-white" : "text-gray-600"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
