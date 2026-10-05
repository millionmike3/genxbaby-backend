// src/borrower/apply/StepDocuments.jsx
import React, { useState } from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";

export default function StepDocuments({ onContinue, onBack }) {
  const [docs, setDocs] = useState([]);

  const uploadDoc = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setDocs([...docs, { name: file.name, file }]);
  };

  return (
    <div style={{ padding: spacing.xxl }}>
      <h1>Upload Required Documents</h1>

      <input
        type="file"
        style={{ marginBottom: spacing.md }}
        onChange={uploadDoc}
      />

      <ul>
        {docs.map((d, idx) => (
          <li key={idx} style={{ color: colors.metallicSilver }}>
            {d.name}
          </li>
        ))}
      </ul>

      <button
        style={{
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: colors.neonGreen,
          color: colors.black,
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={() => onContinue(docs)}
      >
        Continue
      </button>

      <button
        style={{
          marginLeft: spacing.md,
          padding: `${spacing.sm} ${spacing.md}`,
          backgroundColor: colors.slate,
          color: colors.black,
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
}
