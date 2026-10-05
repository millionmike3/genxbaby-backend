// src/pages/OwnerProfile.jsx
import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import colors from "../design/tokens/colors";
import SeverityChip from "../components/ui/SeverityChip";

export default function OwnerProfile({ ownerId }) {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    fetch(`/owners/${ownerId}`)
      .then((res) => res.json())
      .then((json) => setOwner(json));
  }, [ownerId]);

  if (!owner) return <div style={{ color: colors.metallicSilver }}>Loading...</div>;

  return (
    <div style={{ padding: "32px", color: colors.metallicSilver }}>
      <h1>Owner Profile</h1>

      <Card style={{ marginTop: "24px" }}>
        <h2>{owner.name}</h2>
        <p>Email: {owner.email}</p>
        <p>Phone: {owner.phone}</p>
        <p>Created: {new Date(owner.createdAt).toLocaleDateString()}</p>
      </Card>

      <Card style={{ marginTop: "24px" }}>
        <h2>Latest Risk Snapshot</h2>
        <SeverityChip severity={owner.latestRisk?.severity || "LOW"} />
        <p>Score: {owner.latestRisk?.score || 0}</p>
      </Card>
    </div>
  );
}
