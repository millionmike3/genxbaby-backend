// src/landing/CTA.jsx
import React from "react";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";
import motion from "../design/tokens/motion";

export default function CTA() {
  const container = {
    padding: spacing.xxl,
    textAlign: "center",
    color: colors.metallicSilver,
  };

  const title = {
    fontFamily: typography.fonts.header,
    fontSize: "36px",
    marginBottom: spacing.md,
  };

  const button = {
    padding: `${spacing.md} ${spacing.xl}`,
    backgroundColor: colors.electricCyan,
    color: colors.black,
    borderRadius: "10px",
    fontFamily: typography.fonts.body,
    fontWeight: typography.weights.semibold,
    cursor: "pointer",
    transition: "all 250ms ease",
    boxShadow: `0 0 12px ${colors.electricCyan}`,
  };

  return (
    <div style={container}>
      <h2 style={title}>Ready to Underwrite Smarter?</h2>

      <button
        style={button}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
      >
        Start Now
      </button>
    </div>
  );
}
