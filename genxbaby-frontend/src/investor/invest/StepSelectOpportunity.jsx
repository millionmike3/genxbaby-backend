// src/investor/invest/StepSelectOpportunity.jsx
import React, { useEffect, useState } from "react";
import Card from "../../components/ui/Card";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepSelectOpportunity({ onSelect }) {
  const [ops, setOps] = useState([]);

  useEffect(() => {
    fetch("/investor/opportunities")
      .then((res) => res.json())
      .then((json) => setOps(json));
  }, []);

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Select Investment Opportunity</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: spacing.lg,
        }}
      >
        {ops.map((o) => (
          <Card key={o.id}>
            <h3>{o.borrowerName}</h3>
            <p>Type: {o.type}</p>
            <p>Return: {o.expectedReturn}%</p>
            <p>Risk: {o.riskLevel}</p>

            <button
              style={{
                marginTop: spacing.md,
                padding: `${spacing.sm} ${spacing.md}`,
                backgroundColor: colors.neonGreen,
                color: colors.black,
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => onSelect(o)}
            >
              Select
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
