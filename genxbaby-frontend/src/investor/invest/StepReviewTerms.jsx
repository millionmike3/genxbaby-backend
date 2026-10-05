// src/investor/invest/StepReviewTerms.jsx
import React from "react";
import Card from "../../components/ui/Card";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepReviewTerms({ opportunity, onContinue, onBack }) {
  const terms = {
    duration: "12 months",
    interest: opportunity.expectedReturn,
    repayment: "Monthly",
    collateral: opportunity.collateral || "None",
    risk: opportunity.riskLevel,
  };

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Review Terms</h1>

      <Card>
        <p>Duration: {terms.duration}</p>
        <p>Interest: {terms.interest}%</p>
        <p>Repayment: {terms.repayment}</p>
        <p>Collateral: {terms.collateral}</p>
        <p>Risk Level: {terms.risk}</p>
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
        onClick={() => onContinue(terms)}
      >
        Continue
      </button>

      <button
        style={{
          marginTop: spacing.md,
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
