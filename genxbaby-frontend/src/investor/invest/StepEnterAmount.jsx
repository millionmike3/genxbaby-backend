// src/investor/invest/StepEnterAmount.jsx
import React, { useState } from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepEnterAmount({ opportunity, onContinue, onBack }) {
  const [amount, setAmount] = useState("");

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Enter Investment Amount</h1>

      <input
        style={{
          width: "100%",
          padding: spacing.md,
          marginBottom: spacing.md,
          borderRadius: "8px",
          border: `1px solid ${colors.slate}`,
          backgroundColor: colors.black,
          color: colors.metallicSilver,
        }}
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
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
        onClick={() => onContinue(Number(amount))}
      >
        Continue
      </button>

      <button
        style={{
          marginLeft: spacing.md,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: colors.slate,
          color: colors.black,
          borderRadius: "88px",
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
