"use client";

import { useState } from "react";
import { api } from "@/lib/api";

export default function PipelinePage() {
  const [docId, setDocId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [filePath, setFilePath] = useState("");

  async function runPipeline() {
    await api("/admin/pipeline/run", {
      method: "POST",
      body: JSON.stringify({ docId, ownerId, filePath }),
    });
    alert("Pipeline executed");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Run Underwriting Pipeline</h1>

      <input className="input" placeholder="Document ID" onChange={e => setDocId(e.target.value)} />
      <input className="input" placeholder="Owner ID" onChange={e => setOwnerId(e.target.value)} />
      <input className="input" placeholder="File Path" onChange={e => setFilePath(e.target.value)} />

      <button className="btn-primary" onClick={runPipeline}>Run Pipeline</button>
    </div>
  );
}
