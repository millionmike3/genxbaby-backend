// src/underwriting/panels/RiskDashboardPanel.jsx

import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function RiskDashboardPanel({ risk }) {
  return (
    <div
      style={{
        backgroundColor: colors.graphite,
        padding: spacing.lg,
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: colors.neonGreen }}>Risk Dashboard</h3>

      <p>Risk Tier: {risk.tier}</p>
      <p>Risk Score: {risk.score}</p>

      <p style={{ marginTop: spacing.md }}>
        Fraud Signals:
        <ul>
          {risk.fraudSignals.map((s, i) => (
            <li key={i} style={{ color: colors.danger }}>
              {s}
            </li>
          ))}
        </ul>
      </p>

      <p style={{ marginTop: spacing.md }}>
        Pricing Preview:
        <br />
        Base Rate: {risk.pricing.baseRate}%  
        <br />
        Margin: {risk.pricing.margin}%  
        <br />
        Final Rate: {risk.pricing.finalRate}%
      </p>
    </div>
  );
}
