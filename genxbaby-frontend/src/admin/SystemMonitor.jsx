// src/admin/SystemMonitor.jsx
import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";

export default function SystemMonitor() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/admin/system")
      .then((res) => res.json())
      .then((json) => setStats(json));
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div style={{ padding: spacing.xxl, color: colors.metallicSilver }}>
      <h1>System Monitor</h1>

      <Card style={{ marginTop: spacing.lg }}>
        <p>API Status: {stats.apiStatus}</p>
        <p>Pipeline Queue: {stats.pipelineQueue}</p>
        <p>Active Sessions: {stats.activeSessions}</p>
        <p>Errors (24h): {stats.errors24h}</p>
      </Card>
    </div>
  );
}
