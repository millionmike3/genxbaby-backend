// src/investor/invest/StepReceipt.jsx
import React from "react";
import Card from "../../components/ui/Card";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepReceipt({ receipt }) {
  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Investment Receipt</h1>

      <Card>
        <p>Investment ID: {receipt.investmentId}</p>
        <p>Amount: ${receipt.amount.toLocaleString()}</p>
        <p>Timestamp: {receipt.timestamp}</p>

        <p style={{ marginTop: spacing.md }}>
          Blockchain TX:
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
