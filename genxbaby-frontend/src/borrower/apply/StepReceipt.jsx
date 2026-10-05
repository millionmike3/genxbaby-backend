// src/borrower/apply/StepReceipt.jsx
import React from "react";
import Card from "../../components/ui/Card";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepReceipt({ receipt }) {
  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Application Submitted</h1>

      <Card>
        <p>Application ID: {receipt.applicationId}</p>
        <p>Timestamp: {receipt.timestamp}</p>

        <p style={{ marginTop: spacing.md }}>
          Blockchain Anchor:
          <br />
          <span style={{ color: colors.electricCyan }}>
            {receipt.txHash}
          </span>
        </p>

        <button
          style={{
            marginTop: spacing.md,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.electricCyan,
            color: colors.black,
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
          onClick={() =>
            window.open(
              `https://polygonscan.com/tx/${receipt.txHash}`,
              "_blank"
            )
          }
        >
          Verify on Blockchain
        </button>
      </Card>
    </div>
  );
}
