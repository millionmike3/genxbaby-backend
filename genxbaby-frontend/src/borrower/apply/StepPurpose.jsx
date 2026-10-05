// src/borrower/apply/StepPurpose.jsx
import React, { useState } from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepPurpose({ onContinue }) {
  const [purpose, setPurpose] = useState("");

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Loan Purpose</h1>

      <select
        style={{
          width: "100%",
          padding: spacing.md,
          marginBottom: spacing.md,
          borderRadius: "8px",
          backgroundColor: colors.black,
          color: colors.metallicSilver,
          border: `1px solid ${colors.slate}`,
        }}
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      >
        <option value="">Select purpose</option>
        <option value="Home Purchase">Home Purchase</option>
        <option value="Refinance">Refinance</option>
        <option value="Investment Property">Investment Property</option>
        <option value="Renovation">Renovation</option>
        <option value="Debt Consolidation">Debt Consolidation</option>
      </select>

      <button
        style={{
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: colors.neonGreen,
          color: colors.black,
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => onContinue(purpose)}
      >
        Continue
      </button>
    </div>
  );
}
