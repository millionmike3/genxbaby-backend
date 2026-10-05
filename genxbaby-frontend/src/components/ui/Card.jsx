// src/components/ui/Card.jsx
import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";
import motion from "../../design/tokens/motion";

export default function Card({ children, style }) {
  const baseStyle = {
    backgroundColor: colors.graphite,
    padding: spacing.lg,
    borderRadius: "12px",
    border: `1px solid ${colors.slate}`,
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    transition: `"all 250ms ease",
  };

  return (
    <div
      style={{ ...baseStyle, ...style }}
      onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 12px #00FF66")}
      onMouseLeave={(e) => (e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)")}
    >
      {children}
    </div>
  );
}
