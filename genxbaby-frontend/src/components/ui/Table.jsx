// src/components/ui/Table.jsx
import React from "react";
import colors from "../../design/tokens/colors";
import typography from "../../design/tokens/typography";
import spacing from "../../design/tokens/spacing";

export default function Table({ columns = [], data = [] }) {
  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    fontFamily: typography.fonts.body,
    color: colors.metallicSilver,
  };

  const thStyle = {
    textAlign: "left",
    padding: spacing.sm,
    borderBottom: `1px solid ${colors.slate}`,
    fontSize: typography.sizes.small,
    fontWeight: typography.weights.semibold,
  };

  const tdStyle = {
    padding: spacing.sm,
    borderBottom: `1px solid ${colors.graphite}`,
    fontSize: typography.sizes.small,
    transition: "all 250ms ease",
  };

  return (
    <table style={tableStyle}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} style={thStyle}>{col}</th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map((col) => (
              <td key={col} style={tdStyle}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
