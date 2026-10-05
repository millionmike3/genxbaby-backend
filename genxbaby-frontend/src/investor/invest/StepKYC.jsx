// src/investor/invest/StepKYC.jsx
import React, { useState } from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepKYC({ onContinue, onBack }) {
  const [fullName, setFullName] = useState("");
  const [ssn, setSSN] = useState("");
  const [address, setAddress] = useState("");

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>KYC Verification</h1>

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
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />

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
        placeholder="SSN (last 4)"
        value={ssn}
        onChange={(e) => setSSN(e.target.value)}
      />

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
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
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
          onContinue({ fullName, ssn, address })
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
