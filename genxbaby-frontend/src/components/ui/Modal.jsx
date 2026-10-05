// src/components/ui/Modal.jsx
import React from "react";
import colors from "../../design/tokens/colors";
import spacing from "../../design/tokens/spacing";
import motion from "../../design/tokens/motion";

export default function Modal({ open, children }) {
  if (!open) return null;

  const overlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: colors.overlayDark,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  };

  const modalStyle = {
    backgroundColor: colors.graphite,
    padding: spacing.xl,
    borderRadius: "12px",
    border: `1px solid ${colors.slate}`,
    boxShadow: "0 0 20px rgba(0,0,0,0.6)",
    transition: "all 250ms ease",
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>{children}</div>
    </div>
  );
}
