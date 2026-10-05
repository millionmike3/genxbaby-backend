// src/landing/Features.jsx
import React from "react";
import Card from "../components/ui/Card";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function Features() {
  const container = {
    padding: spacing.xxl,
    color: colors.metallicSilver,
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
    marginTop: spacing.xl,
  };

  const features = [
    {
      title: "AI Underwriting Engine",
      desc: "Real‑time risk, fraud, volatility, and behavior scoring.",
    },
    {
      title: "Document Intelligence",
      desc: "Automated extraction from paystubs, bank statements, checks, and credit reports.",
    },
    {
      title: "Unified Risk Profile",
      desc: "One score combining all financial signals into a single decision.",
    },
    {
      title: "Pipeline Automation",
      desc: "End‑to‑end underwriting pipeline with snapshot history.",
    },
  ];

  return (
    <div style={container}>
      <h2 style={{ fontFamily: typography.fonts.header }}>Features</h2>

      <div style={grid}>
        {features.map((f, idx) => (
          <Card key={idx}>
            <h3 style={{ fontFamily: typography.fonts.header }}>{f.title}</h3>
            <p style={{ fontFamily: typography.fonts.body }}>{f.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
