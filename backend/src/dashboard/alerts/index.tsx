// src/dashboard/index.tsx
import AlertsPanel from "./AlertsPanel";

export default function Dashboard({ user }) {
  return (
    <div className="p-6">
      <AlertsPanel
        apiUrl="https://your-api-url"
        ownerId={user.ownerId}
      />
    </div>
  );
}
