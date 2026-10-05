// src/pages/DocumentUpload.jsx
import React, { useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import colors from "../design/tokens/colors";

export default function DocumentUpload({ ownerId }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const upload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/documents/upload/${ownerId}`, {
      method: "POST",
      body: formData,
    });

    setStatus(res.ok ? "Uploaded successfully" : "Upload failed");
  };

  return (
    <div style={{ padding: "32px", color: colors.metallicSilver }}>
      <h1>Upload Documents</h1>

      <Card style={{ marginTop: "24px" }}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: "16px" }}
        />

        <Button onClick={upload}>Upload</Button>

        {status && <p style={{ marginTop: "16px" }}>{status}</p>}
      </Card>
    </div>
  );
}
