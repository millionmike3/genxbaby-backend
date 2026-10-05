// src/owner/OwnerDashboard.jsx
import React, { useEffect, useState } from "react";

import Card from "../components/ui/Card";
import Table from "../components/ui/Table";
import SeverityChip from "../components/ui/SeverityChip";
import TrendIndicator from "../components/ui/TrendIndicator";

import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function OwnerDashboard() {
  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [equity, setEquity] = useState([]);
  const [activity, setActivity] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetch("/owner/stats").then((res) => res.json()).then(setStats);
    fetch("/owner/properties").then((res) => res.json()).then(setProperties);
    fetch("/owner/equity").then((res) => res.json()).then(setEquity);
    fetch("/owner/activity").then((res) => res.json()).then(setActivity);
    fetch("/owner/payments").then((res) => res.json()).then(setPayments);
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
      <h1 style={{ fontFamily: typography.fonts.header }}>Owner Dashboard</h1>

      {/* Portfolio Stats */}
      <div style={grid}>
        <Card>
          <h3>Total Properties</h3>
          <p style={{ fontSize: "28px" }}>{stats.totalProperties}</p>
        </Card>

        <Card>
          <h3>Estimated Equity</h3>
          <p style={{ fontSize: "28px", color: colors.neonGreen }}>
            ${stats.estimatedEquity.toLocaleString()}
          </p>
        </Card>

        <Card>
          <h3>Monthly Cash Flow</h3>
          <TrendIndicator value={stats.monthlyCashFlow} />
        </Card>

        <Card>
          <h3>New This Quarter</h3>
          <p style={{ fontSize: "28px" }}>{stats.newThisQuarter}</p>
        </Card>
      </div>

      {/* Properties */}
      <h2 style={{ fontFamily: typography.fonts.header }}>Your Properties</h2>

      <Table
        columns={["Address", "Value", "Equity", "Status"]}
        data={properties.map((p) => ({
          Address: p.address,
          Value: `$${p.estimatedValue.toLocaleString()}`,
          Equity: `$${p.equity.toLocaleString()} (${p.equityPercent}%)`,
          Status: <SeverityChip severity={p.status} />,
        }))}
      />

      {/* Equity Breakdown */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Equity Breakdown
      </h2>

      <Table
        columns={["Address", "Value", "Balance", "Equity"]}
        data={equity.map((e) => ({
          Address: e.address,
          Value: `$${e.value.toLocaleString()}`,
          Balance: `$${e.balance.toLocaleString()}`,
          Equity: `$${e.equity.toLocaleString()} (${e.equityPct}%)`,
        }))}
      />

      {/* Activity Timeline */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Recent Activity
      </h2>

      <div style={{ marginBottom: spacing.xxl }}>
        {activity.map((a, idx) => (
          <Card key={idx} style={{ marginBottom: spacing.md }}>
            <strong>{a.type}</strong> — {a.description}
            <div style={{ opacity: 0.7 }}>{a.date}</div>
          </Card>
        ))}
      </div>

      {/* Payment History */}
      <h2 style={{ fontFamily: typography.fonts.header }}>Payment History</h2>

      <Table
        columns={["Amount", "Property", "Date", "Status"]}
        data={payments.map((p) => ({
          Amount: `$${p.amount.toLocaleString()}`,
          Property: p.property,
          Date: p.date,
          Status: <SeverityChip severity={p.status} />,
        }))}
      />

      {/* Document Generation Shortcuts */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Document Generation
      </h2>

      <div style={grid}>
        {[
          "Certified Check",
          "Proof of Funds",
          "Pre‑Approval",
          "Commitment Letter",
          "Rate Lock",
          "Closing Disclosure",
        ].map((doc) => (
          <Card key={doc}>
            <h3>{doc}</h3>
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
              onClick={() => alert(`${doc} generator coming soon`)}
            >
              Generate
            </button>
          </Card>
        ))}
      </div>

      {/* Blockchain Anchoring */}
      <h2 style={{ marginTop: spacing.xxl, fontFamily: typography.fonts.header }}>
        Blockchain Anchoring
      </h2>

      <Card>
        <p>Merkle Root:</p>
        <p style={{ color: colors.electricCyan }}>{stats.merkleRoot}</p>

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
          onClick={() =>
            window.open(
              `https://polygonscan.com/tx/${stats.anchorTx}`,
              "_blank"
            )
          }
        >
          Verify Anchor
        </button>
      </Card>
    </div>
  );
}
