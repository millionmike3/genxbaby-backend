// src/landing/Trust.jsx
import React from "react";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function Trust() {
  const container = {
    padding: spacing.xxl,
    color: colors.metallicSilver,
    textAlign: "center",
  };

  const item = {
    marginBottom: spacing.lg,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    transition: "all 250ms ease",
  };

  return (
    <div style={container}>
      <h2 style={{ fontFamily: typography.fonts.header }}>Trust & Security</h2>

      <p style={item}>Bank‑grade encryption</p>
      <p style={item}>Secure document processing</p>
      <p style={item}>AI‑driven fraud detection</p>
      <p style={item}>Institutional underwriting standards</p>
    </div>
  );
}
