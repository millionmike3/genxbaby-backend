// src/dashboard/alerts/AlertBadge.tsx
import { severityColors } from "./alertColors";

export default function AlertBadge({ severity }) {
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded border ${severityColors[severity]}`}
    >
      {severity}
    </span>
  );
}
