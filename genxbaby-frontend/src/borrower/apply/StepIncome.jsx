// src/borrower/apply/StepIncome.jsx
import React, { useState } from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepIncome({ onContinue, onBack }) {
  const [employer, setEmployer] = useState("");
  const [income, setIncome] = useState("");
  const [years, setYears] = useState("");

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Income & Employment</h1>

      <input
        style={{
          width: "100%",
          padding: spacing.md,
          marginBottom: spacing.md,
          borderRadius: "8px",
          backgroundColor: colors.black,
          color: colors.metallicSilver,
          border: `1px solid ${colors.slate}`,
        }}
        placeholder="Employer"
        value={employer}
        onChange={(e) => setEmployer(e.target.value)}
      />

      <input
        style={{
          width: "100%",
          padding: spacing.md,
          marginBottom: spacing.md,
          borderRadius: "8px",
          backgroundColor: colors.black,
          color: colors.metallicSilver,
          border: `1px solid ${colors.slate}`,
        }}
        placeholder="Annual Income"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
      />

      <input
        style={{
          width: "100%",
          padding: spacing.md,
          marginBottom: spacing.md,
          borderRadius: "8px",
          backgroundColor: colors.black,
          color: colors.metallicSilver,
          border: `1px solid ${colors.slate}`,
        }}
        placeholder="Years Employed"
        value={years}
        onChange={(e) => setYears(e.target.value)}
      />

      <button
        style={{
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: colors.neonGreen,
          color: colors.black,
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() =>
          onContinue({ employer, income: Number(income), years: Number(years) })
        }
      >
        Continue
      </button>

      <button
        style={{
          marginLeft: spacing.md,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: colors.slate,
          color: colors.black,
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}
