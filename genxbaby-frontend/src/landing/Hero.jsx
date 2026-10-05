// src/landing/Hero.jsx
import React from "react";
import colors from "../design/tokens/colors";
import typography from "../design/tokens/typography";
import spacing from "../design/tokens/spacing";
import motion from "../design/tokens/motion";

export default function Hero() {
  const container = {
    padding: spacing.xxl,
    textAlign: "center",
    color: colors.metallicSilver,
  };

  const title = {
    fontFamily: typography.fonts.header,
    fontSize: "48px",
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
    textShadow: `0 0 12px ${colors.neonGreen}`,
  };

  const subtitle = {
    fontFamily: typography.fonts.body,
    fontSize: "20px",
    marginBottom: spacing.xl,
    opacity: 0.85,
  };

  const button = {
    padding: `${spacing.md} ${spacing.xl}`,
    backgroundColor: colors.neonGreen,
    color: colors.black,
    borderRadius: "10px",
    fontFamily: typography.fonts.body,
    fontWeight: typography.weights.semibold,
    cursor: "pointer",
    
    boxShadow: `0 0 12px ${colors.neonGreen}`,
    transition: "all 250ms ease",
  };

  return (
    <div style={container}>
      <h1 style={title}>GENXBABY</h1>
      <p style={subtitle}>AI‑Powered Underwriting Intelligence for Modern Finance</p>

      <button
        style={button}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
      >
        Get Started
      </button>
    </div>
  );
}
