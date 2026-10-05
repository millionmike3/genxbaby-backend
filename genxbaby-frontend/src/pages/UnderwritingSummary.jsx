// src/pages/UnderwritingSummary.jsx
import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import SeverityChip from "../components/ui/SeverityChip";
import TrendIndicator from "../components/ui/TrendIndicator";
import Table from "../components/ui/Table";
import colors from "../design/tokens/colors";

export default function UnderwritingSummary({ ownerId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/pipeline/${ownerId}/summary`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [ownerId]);

  if (!data) return <div style={{ color: colors.metallicSilver }}>Loading...</div>;

  return (
    <div style={{ padding: "32px", color: colors.metallicSilver }}>
      <h1>Underwriting Summary</h1>

      <Card style={{ marginTop: "24px" }}>
        <h2>Global Risk</h2>
        <SeverityChip severity={data.risk?.severity} />
        <TrendIndicator trend={data.risk?.trend} />
        <p>Score: {data.risk?.score}</p>
      </Card>

      <Card style={{ marginTop: "24px" }}>
        <h2>Fraud Analysis</h2>
        <SeverityChip severity={data.fraud?.severity} />
        <TrendIndicator trend={data.fraud?.trend} />
        <p>Signals: {data.fraud?.signals?.income?.length || 0} issues</p>
      </Card>

      <Card style={{ marginTop: "24px" }}>
        <h2>Volatility</h2>
        <SeverityChip severity={data.volatility?.severity} />
        <TrendIndicator trend={data.volatility?.trend} />
        <p>Score: {data.volatility?.score}</p>
      </Card>

      <Card style={{ marginTop: "24px" }}>
        <h2>Behavior</h2>
        <SeverityChip severity={data.behavior?.severity} />
        <TrendIndicator trend={data.behavior?.trend} />
        <p>Score: {data.behavior?.score}</p>
      </Card>

      <Card style={{ marginTop: "24px" }}>
        <h2>Verification Issues</h2>
        <Table
          columns={["Issue"]}
          data={(data.verification?.identityIssues || []).map((i) => ({ Issue: i }))}
        />
      </Card>
    </div>
  );
}
