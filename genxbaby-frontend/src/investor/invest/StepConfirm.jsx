// src/investor/invest/StepConfirm.jsx
import React from "react";
import Card from "../../components/ui/Card";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepConfirm({
  opportunity,
  terms,
  amount,
  kyc,
  onConfirm,
  onBack,
}) {
  const confirmInvestment = async () => {
    const res = await fetch("/investor/invest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        opportunityId: opportunity.id,
        amount,
        terms,
        kyc,
      }),
    });

    const receipt = await res.json();
    onConfirm(receipt);
  };

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Confirm Investment</h1>

      <Card>
        <p>Opportunity: {opportunity.borrowerName}</p>
        <p>Amount: ${amount.toLocaleString()}</p>
        <p>Interest: {terms.interest}%</p>
        <p>Duration: {terms.duration}</p>
        <p>KYC: {kyc.fullName}</p>
      </Card>

      <button
        style={{
          marginTop: spacing.md,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: colors.neonGreen,
          color: colors.black,
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={confirmInvestment}
      >
        Confirm Investment
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
