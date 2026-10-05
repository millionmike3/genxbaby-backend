// src/auth/AuthLayout.jsx
import React from "react";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function AuthLayout({ title, children }) {
  const container = {
    backgroundColor: colors.black,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
    color: colors.metallicSilver,
  };

  const box = {
    backgroundColor: colors.graphite,
    padding: spacing.xxl,
    borderRadius: "12px",
    width: "420px",
    border: `1px solid ${colors.slate}`,
    boxShadow: "0 0 20px rgba(0,0,0,0.6)",
  };

  const titleStyle = {
    fontFamily: typography.fonts.header,
    fontSize: "32px",
    marginBottom: spacing.lg,
    textAlign: "center",
    textShadow: `0 0 12px ${colors.neonGreen}`,
  };

  return (
    <div style={container}>
      <div style={box}>
        <h2 style={titleStyle}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
