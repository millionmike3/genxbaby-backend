// src/dashboard/AlertsPanel.tsx
import { useEffect, useState } from "react";
import { initAlertsSocket } from "./alerts/alerts.socket";
import AlertToast from "./alerts/AlertToast";
import AlertFeed from "./alerts/AlertFeed";

export default function AlertsPanel({ apiUrl, ownerId }) {
  const [alerts, setAlerts] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const socket = initAlertsSocket(apiUrl, ownerId, (alert) => {
      setAlerts((prev) => [alert, ...prev]);
      setToast(alert);

      setTimeout(() => setToast(null), 5000);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <>
      {toast && <AlertToast alert={toast} />}
      <AlertFeed alerts={alerts} />
    </>
  );
}
