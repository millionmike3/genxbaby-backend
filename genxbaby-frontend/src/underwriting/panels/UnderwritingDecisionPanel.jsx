// src/underwriting/panels/UnderwritingDecisionPanel.jsx

import React, { useState } from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function UnderwritingDecisionPanel({ decision, applicationId }) {
  const [notes, setNotes] = useState("");

  const submitDecision = async (status) => {
    await fetch(`/underwriting/decision/${applicationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    alert("Decision submitted.");
  };

  return (
    <div
      style={{
        backgroundColor: colors.graphite,
        padding: spacing.lg,
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: colors.neonGreen }}>Underwriting Decision</h3>

      <p>Current Tier: {decision.tier}</p>
      <p>Final Rate: {decision.finalRate}%</p>

      <textarea
        placeholder="Underwriter notes..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{
          width: "100%",
          height: "120px",
          marginTop: spacing.md,
          backgroundColor: colors.black,
          color: colors.metallicSilver,
          borderRadius: "8px",
          padding: spacing.md,
        }}
      />

      <div style={{ marginTop: spacing.md }}>
        <button
          style={{
            backgroundColor: colors.neonGreen,
            padding: spacing.md,
            borderRadius: "8px",
            marginRight: spacing.md,
            cursor: "pointer",
          }}
          onClick={() => submitDecision("APPROVED")}
        >
          Approve
        </button>

        <button
          style={{
            backgroundColor: colors.danger,
            padding: spacing.md,
            borderRadius: "8px",
            marginRight: spacing.md,
            cursor: "pointer",
          }}
          onClick={() => submitDecision("DECLINED")}
        >
          Decline
        </button>

        <button
          style={{
            backgroundColor: colors.slate,
            padding: spacing.md,
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => submitDecision("NEEDS_MORE_INFO")}
        >
          Needs More Info
        </button>
      </div>
    </div>
  );
}
