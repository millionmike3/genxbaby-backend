// src/investor/InvestorDashboard.jsx
import React, { useEffect, useState } from "react";

import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import SeverityChip from "../components/ui/SeverityChip";
import TrendIndicator from "../components/ui/TrendIndicator";

import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function InvestorDashboard() {
  const [portfolio, setPortfolio] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/investor/stats")
      .then((res) => res.json())
      .then((json) => setStats(json));

    fetch("/investor/portfolio")
      .then((res) => res.json())
      .then((json) => setPortfolio(json));

    fetch("/investor/opportunities")
      .then((res) => res.json())
      .then((json) => setOpportunities(json));
  }, []);

  if (!stats) return <div>Loading...</div>;

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
      <h1 style={{ fontFamily: typography.fonts.header }}>Investor Dashboard</h1>

      {/* Stats */}
      <div style={grid}>
        <Card>
          <h3>Total Portfolio Value</h3>
          <p style={{ fontSize: "28px", color: colors.neonGreen }}>
            ${stats.totalValue.toLocaleString()}
          </p>
        </Card>

        <Card>
          <h3>Annualized Return</h3>
          <TrendIndicator value={stats.annualReturn} />
        </Card>

        <Card>
          <h3>Active Investments</h3>
          <p style={{ fontSize: "28px" }}>{stats.activeInvestments}</p>
        </Card>

        <Card>
          <h3>Pending Payouts</h3>
          <p style={{ fontSize: "28px", color: colors.electricCyan }}>
            ${stats.pendingPayouts.toLocaleString()}
          </p>
        </Card>
      </div>

      {/* Portfolio Table */}
      <h2 style={{ fontFamily: typography.fonts.header }}>Your Portfolio</h2>

      <Table
        columns={[
          "ID",
          "Borrower",
          "Type",
          "Amount",
          "Return",
          "Risk",
          "Status",
        ]}
        data={portfolio.map((p) => ({
          ID: p.id,
          Borrower: p.borrowerName,
          Type: p.type,
          Amount: `$${p.amount.toLocaleString()}`,
          Return: `${p.returnRate}%`,
          Risk: <SeverityChip severity={p.riskLevel} />,
          Status: p.status,
        }))}
      />

      {/* Opportunities */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Investment Opportunities
      </h2>

      <div style={grid}>
        {opportunities.map((o) => (
          <Card key={o.id}>
            <h3>{o.borrowerName}</h3>
            <p>Type: {o.type}</p>
            <p>Amount Needed: ${o.amountNeeded.toLocaleString()}</p>
            <p>Expected Return: {o.expectedReturn}%</p>
            <p>Risk: <SeverityChip severity={o.riskLevel} /></p>

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
              onClick={() => alert("Investment flow coming soon")}
            >
              Invest Now
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
