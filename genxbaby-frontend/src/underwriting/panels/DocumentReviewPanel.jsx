// src/underwriting/panels/DocumentReviewPanel.jsx

import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function DocumentReviewPanel({ documents }) {
  return (
    <div
      style={{
        backgroundColor: colors.graphite,
        padding: spacing.lg,
        borderRadius: "10px",
      }}
    >
      <h3 style={{ color: colors.neonGreen }}>Documents</h3>

      {documents.map((doc, i) => (
        <div key={i} style={{ marginBottom: spacing.md }}>
          <p>{doc.name}</p>
          <p
            style={{
              color: doc.verified ? colors.neonGreen : colors.danger,
            }}
          >
            {doc.verified ? "Verified" : "Pending"}
          </p>
        </div>
      ))}
    </div>
  );
}
