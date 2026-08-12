export default function AlertBadge({ severity }) {
  const colors = {
    HIGH: "bg-red-600 text-white",
    MEDIUM: "bg-yellow-500 text-black",
    LOW: "bg-green-600 text-white",
  };

  return (
    <span className={`px-3 py-1 rounded text-xs font-bold ${colors[severity]}`}>
      {severity}
    </span>
  );
}
