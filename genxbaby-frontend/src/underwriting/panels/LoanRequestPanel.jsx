// src/underwriting/panels/LoanRequestPanel.jsx

import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function LoanRequestPanel({ loan }) {
  return (
    <div
      style={{
        backgroundColor: colors.graphite,
        padding: spacing.lg,
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: colors.neonGreen }}>Loan Request</h3>

      <p>Purpose: {loan.purpose}</p>
      <p>Amount: ${loan.amount.toLocaleString()}</p>
      <p>Property Value: ${loan.propertyValue.toLocaleString()}</p>
      <p>LTV: {loan.ltv}%</p>
      <p>DTI: {loan.dti}%</p>
    </div>
  );
}
