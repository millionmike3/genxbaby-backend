// src/components/ui/TrendIndicator.jsx
import React from "react";
import colors from "../../design/tokens/colors";
import typography from "../../design/tokens/typography";

export default function TrendIndicator({ trend }) {
  const isUp = trend === "improving";
  const isDown = trend === "worsening";

  const style = {
    color: isUp ? colors.neonGreen : isDown ? colors.danger : colors.metallicSilver,
    fontFamily: typography.fonts.numeric,
    fontSize: typography.sizes.body,
    fontWeight: typography.weights.bold,
    transition: "all 250ms ease",
  };

  return <span style={style}>{isUp ? "↑" : isDown ? "↓" : "→"}</span>;
}
