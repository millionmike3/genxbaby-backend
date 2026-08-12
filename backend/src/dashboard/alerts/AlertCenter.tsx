import { useEffect, useState } from "react";
import AlertTabs from "./AlertTabs";
import AlertSearch from "./AlertSearch";
import AlertFilters from "./AlertFilters";
import AlertList from "./AlertList";
import { initAlertsSocket } from "./alerts.socket";

export default function AlertCenter({ apiUrl, ownerId }) {
  const [alerts, setAlerts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [type, setType] = useState("ALL");

  // Load initial alerts
  useEffect(() => {
    fetch(`${apiUrl}/dashboard/ai/alerts`)
      .then((r) => r.json())
      .then((data) => {
        const combined = [
          ...data.highRiskChecks.map(a => ({ ...a, source: "CHECK" })),
          ...data.highRiskDocs.map(a => ({ ...a, source: "DOCUMENT" })),
        ];
        setAlerts(combined);
        setFiltered(combined);
      });
  }, []);

  // WebSocket real-time alerts
  useEffect(() => {
    const socket = initAlertsSocket(apiUrl, ownerId, (alert) => {
      setAlerts(prev => [alert, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  // Filtering logic
  useEffect(() => {
    let result = [...alerts];

    if (tab !== "ALL") {
      result = result.filter(a => a.riskLevel === tab);
    }

    if (severity !== "ALL") {
      result = result.filter(a => a.riskLevel === severity);
    }

    if (type !== "ALL") {
      result = result.filter(a => a.type === type);
    }

    if (search.trim()) {
      result = result.filter(a =>
        a.type.toLowerCase().includes(search.toLowerCase()) ||
        a.source.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(result);
  }, [alerts, tab, search, severity, type]);

  return (
    <div className="bg-white border rounded shadow p-6 space-y-6">
      <h2 className="text-xl font-bold">Alert Center</h2>

      <AlertTabs tab={tab} setTab={setTab} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AlertSearch search={search} setSearch={setSearch} />
        <AlertFilters severity={severity} setSeverity={setSeverity} type={type} setType={setType} />
      </div>

      <AlertList alerts={filtered} />
    </div>
  );
}
