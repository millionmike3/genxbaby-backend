// src/underwriting/panels/IncomePanel.jsx

import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function IncomePanel({ income }) {
  return (
    <div
      style={{
        backgroundColor: colors.graphite,
        padding: spacing.lg,
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: colors.neonGreen }}>Income & Employment</h3>

      <p>Employer: {income.employer}</p>
      <p>Annual Income: ${income.amount.toLocaleString()}</p>
      <p>Years Employed: {income.years}</p>

      <p style={{ marginTop: spacing.md }}>
        Verification:{" "}
        <span style={{ color: income.verified ? colors.neonGreen : colors.danger }}>
          {income.verified ? "Verified" : "Pending"}
        </span>
      </p>
    </div>
  );
}
