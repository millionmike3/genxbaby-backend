// src/components/ui/Button.jsx
import React from "react";
import colors from "../../design/tokens/colors";
import typography from "../../design/tokens/typography";
import spacing from "../../design/tokens/spacing";
import motion from "../../design/tokens/motion";

export default function Button({ children, onClick, variant = "primary", style }) {
  const baseStyle = {
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: "8px",
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.semibold,
    cursor: "pointer",
    transition: "all 250ms ease",
    border: "none",
  };

  const variants = {
    primary: {
      backgroundColor: colors.neonGreen,
      color: colors.black,
      boxShadow: `0 0 8px ${colors.neonGreen}`,
    },
    secondary: {
      backgroundColor: colors.electricCyan,
      color: colors.black,
      boxShadow: `0 0 8px ${colors.electricCyan}`,
    },
    danger: {
      backgroundColor: colors.danger,
      color: colors.white,
      boxShadow: `0 0 8px ${colors.danger}`,
    },
  };

  return (
    <button
      onClick={onClick}
      style={{ ...baseStyle, ...variants[variant], ...style }}
      onMouseEnter={(e) => (e.target.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.target.style.transform = "scale(1.0)")}
    >
      {children}
    </button>
  );
}
