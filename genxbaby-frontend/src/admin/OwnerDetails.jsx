// src/admin/OwnerDetails.jsx
import React, { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";

export default function OwnerDetails({ ownerId }) {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    fetch(`/admin/owners/${ownerId}`)
      .then((res) => res.json())
      .then((json) => setOwner(json));
  }, [ownerId]);

  if (!owner) return <div>Loading...</div>;

  return (
    <div style={{ padding: spacing.xxl, color: colors.metallicSilver }}>
      <h1>{owner.name}</h1>

      <Card style={{ marginTop: spacing.lg }}>
        <p>Email: {owner.email}</p>
        <p>Phone: {owner.phone}</p>
        <p>Created: {new Date(owner.createdAt).toLocaleString()}</p>
      </Card>
    </div>
  );
}
