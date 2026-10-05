// src/admin/Owners.jsx
import React, { useEffect, useState } from "react";
import Table from "../components/ui/Table";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";

export default function Owners() {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    fetch("/admin/owners")
      .then((res) => res.json())
      .then((json) => setOwners(json));
  }, []);

  return (
    <div style={{ padding: spacing.xxl, color: colors.metallicSilver }}>
      <h1>Owners</h1>

      <Table
        columns={["ID", "Name", "Email", "Created"]}
        data={owners.map((o) => ({
          ID: o.id,
          Name: o.name,
          Email: o.email,
          Created: new Date(o.createdAt).toLocaleDateString(),
        }))}
      />
    </div>
  );
}
