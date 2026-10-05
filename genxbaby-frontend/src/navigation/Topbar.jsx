// src/navigation/Topbar.jsx
import React, { useContext, useState } from "react";

import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

import { AuthContext } from "../auth/AuthContext";
import { ROLES } from "../auth/roles";

import NotificationBell from "../notifications/NotificationBell";
import NotificationFeed from "../notifications/NotificationFeed";

export default function Topbar({ title }) {
  const { user, logout } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const container = {
    width: "100%",
    height: "70px",
    backgroundColor: colors.graphite,
    borderBottom: `1px solid ${colors.slate}`,
    padding: spacing.lg,
    paddingLeft: "260px",
    color: colors.metallicSilver,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 10,
  };

  const titleStyle = {
    fontFamily: typography.fonts.header,
    fontSize: typography.sizes.h2,
    color: colors.metallicSilver,
  };

  const rightSection = {
    display: "flex",
    alignItems: "center",
    gap: spacing.lg,
    marginRight: spacing.xl,
  };

  const roleBadge = {
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: "6px",
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.small,
    fontWeight: typography.weights.bold,
    textTransform: "uppercase",
    transition: "all 250ms ease",
    backgroundColor:
      user?.role === ROLES.ADMIN
        ? colors.danger
        : user?.role === ROLES.INVESTOR
        ? colors.electricCyan
        : user?.role === ROLES.BORROWER
        ? colors.neonGreen
        : colors.slate,
    color: colors.black,
  };

  const emailStyle = {
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    opacity: 0.85,
  };

  const logoutStyle = {
    color: colors.electricCyan,
    cursor: "pointer",
    fontFamily: typography.fonts.body,
    transition: "all 250ms ease",
  };

  const logoutHover = (e) => (e.target.style.color = colors.neonGreen);
  const logoutLeave = (e) => (e.target.style.color = colors.electricCyan);

  return (
    <>
      <div style={container}>
        {/* Page Title */}
        <h2 style={titleStyle}>{title}</h2>

        {/* Right Section */}
        <div style={rightSection}>
          {/* Notification Bell */}
          <NotificationBell onClick={() => setOpen(true)} />

          {user && (
            <>
              {/* Role Badge */}
              <div style={roleBadge}>{user.role}</div>

              {/* Email */}
              <div style={emailStyle}>{user.email}</div>

              {/* Logout */}
              <div
                style={logoutStyle}
                onMouseEnter={logoutHover}
                onMouseLeave={logoutLeave}
                onClick={() => {
                  logout();
                  window.location.href = "/login";
                }}
              >
                Logout
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notification Feed Drawer */}
      <NotificationFeed open={open} onClose={() => setOpen(false)} />
    </>
  );
}
