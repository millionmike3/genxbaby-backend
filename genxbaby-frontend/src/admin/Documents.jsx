// src/admin/Documents.jsx
import React, { useEffect, useState } from "react";
import Table from "../components/ui/Table";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";

export default function Documents() {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetch("/admin/documents")
      .then((res) => res.json())
      .then((json) => setDocs(json));
  }, []);

  return (
    <div style={{ padding: spacing.xxl, color: colors.metallicSilver }}>
      <h1>Documents</h1>

      <Table
        columns={["ID", "Owner", "Type", "Uploaded"]}
        data={docs.map((d) => ({
          ID: d.id,
          Owner: d.ownerName,
          Type: d.type,
          Uploaded: new Date(d.uploadedAt).toLocaleString(),
        }))}
      />
    </div>
  );
}
