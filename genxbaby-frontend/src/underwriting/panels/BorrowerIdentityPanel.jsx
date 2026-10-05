// src/underwriting/panels/BorrowerIdentityPanel.jsx

import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function BorrowerIdentityPanel({ borrower }) {
  return (
    <div
      style={{
        backgroundColor: colors.graphite,
        padding: spacing.lg,
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: colors.neonGreen }}>Borrower Identity</h3>

      <p>Name: {borrower.fullName}</p>
      <p>SSN: ***-**-{borrower.ssn}</p>
      <p>DOB: {borrower.dob}</p>
      <p>Address: {borrower.address}</p>

      <p style={{ marginTop: spacing.md }}>
        KYC Status:{" "}
        <span style={{ color: borrower.kycVerified ? colors.neonGreen : colors.danger }}>
          {borrower.kycVerified ? "Verified" : "Pending"}
        </span>
      </p>
    </div>
  );
}
