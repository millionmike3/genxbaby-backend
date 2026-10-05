// src/underwriting/UnderwritingEngine.jsx

import React, { useEffect, useState } from "react";
import BorrowerIdentityPanel from "./panels/BorrowerIdentityPanel";
import LoanRequestPanel from "./panels/LoanRequestPanel";
import IncomePanel from "./panels/IncomePanel";
import RiskDashboardPanel from "./panels/RiskDashboardPanel";
import DocumentReviewPanel from "./panels/DocumentReviewPanel";
import UnderwritingDecisionPanel from "./panels/UnderwritingDecisionPanel";

import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";

export default function UnderwritingEngine({ applicationId }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/underwriting/application/${applicationId}`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [applicationId]);

  if (!data) {
    return (
      <div style={{ padding: spacing.xxl, color: colors.metallicSilver }}>
        Loading underwriting data...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: spacing.xxl,
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: spacing.xl,
      }}
    >
      <BorrowerIdentityPanel borrower={data.borrower} />
      <LoanRequestPanel loan={data.loan} />
      <IncomePanel income={data.income} />

      <RiskDashboardPanel risk={data.risk} />
      <DocumentReviewPanel documents={data.documents} />

      <UnderwritingDecisionPanel
        decision={data.decision}
        applicationId={applicationId}
      />
    </div>
  );
}
