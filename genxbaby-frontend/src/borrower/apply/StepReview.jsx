// src/borrower/apply/StepReview.jsx
import React from "react";
import Card from "../../components/ui/Card";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepReview({
  purpose,
  amount,
  income,
  kyc,
  documents,
  onSubmit,
  onBack,
}) {
  const submitApplication = async () => {
    const res = await fetch("/borrower/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purpose,
        amount,
        income,
        kyc,
        documents: documents.map((d) => d.name),
      }),
    });

    const receipt = await res.json();
    onSubmit(receipt);
  };

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Review Application</h1>

      <Card>
        <p>Purpose: {purpose}</p>
        <p>Amount: ${amount.toLocaleString()}</p>
        <p>Employer: {income.employer}</p>
        <p>Income: ${income.income.toLocaleString()}</p>
        <p>KYC: {kyc.fullName}</p>
        <p>Documents: {documents.length} uploaded</p>
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
        onClick={submitApplication}
      >
        Submit Application
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
