// src/navigation/DashboardLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({ title, children }) {
  const content = {
    marginLeft: "260px",
    marginTop: "80px",
    padding: "32px",
  };

  return (
    <>
      <Sidebar />
      <Topbar title={title} />
      <div style={content}>{children}</div>
    </>
  );
}
