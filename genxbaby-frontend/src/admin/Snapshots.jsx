// src/admin/Snapshots.jsx
import React, { useEffect, useState } from "react";
import Table from "../components/ui/Table";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";

export default function Snapshots() {
  const [snaps, setSnaps] = useState([]);

  useEffect(() => {
    fetch("/admin/snapshots")
      .then((res) => res.json())
      .then((json) => setSnaps(json));
  }, []);

  return (
    <div style={{ padding: spacing.xxl, color: colors.metallicSilver }}>
      <h1>Snapshots</h1>

      <Table
        columns={["ID", "Owner", "Type", "Score", "Timestamp"]}
        data={snaps.map((s) => ({
          ID: s.id,
          Owner: s.ownerName,
          Type: s.type,
          Score: s.score,
          Timestamp: new Date(s.timestamp).toLocaleString(),
        }))}
      />
    </div>
  );
}
