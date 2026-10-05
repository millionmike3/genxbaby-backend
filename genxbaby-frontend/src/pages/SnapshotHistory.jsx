// src/pages/SnapshotHistory.jsx
import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import colors from "../design/tokens/colors";

export default function SnapshotHistory({ ownerId }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`/pipeline/${ownerId}/summary`)
      .then((res) => res.json())
      .then((json) => {
        const snapshots = [
          json.risk,
          json.fraud,
          json.volatility,
          json.behavior,
          json.verification,
        ].filter(Boolean);

        setHistory(snapshots);
      });
  }, [ownerId]);

  return (
    <div style={{ padding: "32px", color: colors.metallicSilver }}>
      <h1>Snapshot History</h1>

      <Card style={{ marginTop: "24px" }}>
        <Table
          columns={["Type", "Score", "Severity", "Trend", "Timestamp"]}
          data={history.map((snap) => ({
            Type: snap.type || "Snapshot",
            Score: snap.score,
            Severity: snap.severity,
            Trend: snap.trend,
            Timestamp: new Date(snap.timestamp).toLocaleString(),
          }))}
        />
      </Card>
    </div>
  );
}
