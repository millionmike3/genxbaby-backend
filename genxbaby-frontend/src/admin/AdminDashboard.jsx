// src/admin/AdminDashboard.jsx
import React from "react";
import Card from "../components/ui/Card";
import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function AdminDashboard() {
  const container = {
    padding: spacing.xxl,
    color: colors.metallicSilver,
  };

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: spacing.lg,
    marginTop: spacing.xl,
  };

  const items = [
    { title: "Owners", link: "/admin/owners" },
    { title: "Documents", link: "/admin/documents" },
    { title: "Snapshots", link: "/admin/snapshots" },
    { title: "System Monitor", link: "/admin/system" },
  ];

  return (
    <div style={container}>
      <h1 style={{ fontFamily: typography.fonts.header }}>Admin Panel</h1>

      <div style={grid}>
        {items.map((i, idx) => (
          <Card key={idx}>
            <a
              href={i.link}
              style={{
                color: colors.neonGreen,
                fontFamily: typography.fonts.header,
                fontSize: typography.sizes.h2,
                textDecoration: "none",
              }}
            >
              {i.title}
            </a>
          </Card>
        ))}
      </div>
    </div>
  );
}
