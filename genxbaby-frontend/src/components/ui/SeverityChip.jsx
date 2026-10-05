// src/components/ui/SeverityChip.jsx
import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";
import typography from "../../design/tokens/typography";

export default function SeverityChip({ severity }) {
  const map = {
    LOW: colors.neonGreen,
    MEDIUM: colors.electricCyan,
    HIGH: colors.warning,
    CRITICAL: colors.danger,
  };

  const style = {
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: map[severity] || colors.slate,
    color: colors.black,
    borderRadius: "6px",
    fontFamily: typography.fonts.numeric,
    fontSize: typography.sizes.small,
    fontWeight: typography.weights.bold,
    transition: "all 250ms ease",
  };

  return <span style={style}>{severity}</span>;
}
