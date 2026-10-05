// src/borrower/BorrowerDashboard.jsx
import React, { useEffect, useState } from "react";

import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import SeverityChip from "../components/ui/SeverityChip";
import TrendIndicator from "../components/ui/TrendIndicator";

import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function BorrowerDashboard() {
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [funding, setFunding] = useState(null);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/borrower/application")
      .then((res) => res.json())
      .then((json) => setApplication(json));

    fetch("/borrower/documents")
      .then((res) => res.json())
      .then((json) => setDocuments(json));

    fetch("/borrower/funding")
      .then((res) => res.json())
      .then((json) => setFunding(json));

    fetch("/borrower/payments")
      .then((res) => res.json())
      .then((json) => setPayments(json));
  }, []);

  if (!application || !funding) return <div>Loading...</div>;

  const container = {
    padding: spacing.xxl,
    color: colors.metallicSilver,
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  };

  return (
    <div style={container}>
      <h1 style={{ fontFamily: typography.fonts.header }}>Borrower Dashboard</h1>

      {/* Application Summary */}
      <div style={grid}>
        <Card>
          <h3>Loan Amount</h3>
          <p style={{ fontSize: "28px", color: colors.neonGreen }}>
            ${application.amount.toLocaleString()}
          </p>
        </Card>

        <Card>
          <h3>Loan Purpose</h3>
          <p style={{ fontSize: "22px" }}>{application.purpose}</p>
        </Card>

        <Card>
          <h3>Underwriting Status</h3>
          <SeverityChip severity={application.status} />
        </Card>

        <Card>
          <h3>Risk Score</h3>
          <TrendIndicator value={application.riskScore} />
        </Card>
      </div>

      {/* Funding Progress */}
      <h2 style={{ fontFamily: typography.fonts.header }}>Funding Progress</h2>

      <Card>
        <p>Investors Committed: {funding.investorsCommitted}</p>
        <p>Amount Funded: ${funding.amountFunded.toLocaleString()}</p>
        <p>Amount Remaining: ${funding.amountRemaining.toLocaleString()}</p>
        <p>Expected Closing: {funding.expectedClosing}</p>

        <button
          style={{
            marginTop: spacing.md,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.electricCyan,
            color: colors.black,
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 250ms ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
          onClick={() => alert("Funding details coming soon")}
        >
          View Funding Details
        </button>
      </Card>

      {/* Required Documents */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Required Documents
      </h2>

      <Table
        columns={["Type", "Status", "Uploaded"]}
        data={documents.map((d) => ({
          Type: d.type,
          Status: <SeverityChip severity={d.status} />,
          Uploaded: d.uploaded ? "Yes" : "No",
        }))}
      />

      {/* Payment Schedule */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Payment Schedule
      </h2>

      <Table
        columns={["Due Date", "Amount", "Status"]}
        data={payments.map((p) => ({
          "Due Date": p.dueDate,
          Amount: `$${p.amount.toLocaleString()}`,
          Status: <SeverityChip severity={p.status} />,
        }))}
      />

      {/* Blockchain Verification */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Blockchain Verification
      </h2>

      <Card>
        <p>Smart Contract Address:</p>
        <p style={{ color: colors.electricCyan }}>{application.contractAddress}</p>

        <button
          style={{
            marginTop: spacing.md,
            padding: `${spacing.sm} ${spacing.md}`,
            backgroundColor: colors.neonGreen,
            color: colors.black,
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            transition: "all 250ms ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
          onClick={() =>
            window.open(
              `https://polygonscan.com/address/${application.contractAddress}`,
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
