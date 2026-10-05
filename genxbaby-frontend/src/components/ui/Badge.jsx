// src/components/ui/Badge.jsx
import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";
import typography from "../../design/tokens/typography";

export default function Badge({ text, color = colors.neonGreen }) {
  const style = {
    display: "inline-block",
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: color,
    color: colors.black,
    borderRadius: "6px",
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.small,
    fontWeight: typography.weights.semibold,
    transition: "all 250ms ease",
  };

  return <span style={style}>{text}</span>;
}
