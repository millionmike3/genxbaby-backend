// src/navigation/Sidebar.jsx
import React, { useContext } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../auth/AuthContext";
import { ROLES } from "../auth/roles";

import colors from "../design/tokens/colors";
import spacing from "../design/tokens/spacing";
import typography from "../design/tokens/typography";

export default function Sidebar() {
  const { user, logout } = useContext(AuthContext);

  const container = {
    width: "240px",
    height: "100vh",
    backgroundColor: colors.black,
    borderRight: `1px solid ${colors.slate}`,
    padding: spacing.lg,
    color: colors.metallicSilver,
    position: "fixed",
    top: 0,
    left: 0,
  };

  const item = {
    display: "block",
    padding: `${spacing.sm} 0`,
    fontFamily: typography.fonts.body,
    fontSize: typography.sizes.body,
    color: colors.metallicSilver,
    textDecoration: "none",
    transition: "all 250ms ease",
  };

  const hover = (e) => (e.target.style.color = colors.neonGreen);
  const leave = (e) => (e.target.style.color = colors.metallicSilver);

  return (
    <div style={container}>
      <h2
        style={{
          fontFamily: typography.fonts.header,
          marginBottom: spacing.xl,
          color: colors.neonGreen,
          textShadow: `0 0 12px ${colors.neonGreen}`,
        }}
      >
        GENXBABY
      </h2>

      {/* Public Links */}
      <Link to="/" style={item} onMouseEnter={hover} onMouseLeave={leave}>
        Home
      </Link>

      {/* Shared Dashboard Links (all authenticated roles) */}
      {user && (
        <>
          <Link
            to="/dashboard"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Dashboard
          </Link>
        </>
      )}

      {/* OWNER + ADMIN */}
      {user?.role === ROLES.ADMIN || user?.role === ROLES.OWNER ? (
        <>
          <Link
            to="/owner"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Owner Profile
          </Link>

          <Link
            to="/upload"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Document Upload
          </Link>

          <Link
            to="/history"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Snapshot History
          </Link>
        </>
      ) : null}

      {/* INVESTOR */}
      {user?.role === ROLES.INVESTOR && (
        <Link
          to="/investor"
          style={item}
          onMouseEnter={hover}
          onMouseLeave={leave}
        >
          Investor Dashboard
        </Link>
      )}

      {/* BORROWER */}
      {user?.role === ROLES.BORROWER && (
        <Link
          to="/borrower"
          style={item}
          onMouseEnter={hover}
          onMouseLeave={leave}
        >
          Borrower Dashboard
        </Link>
      )}

      {/* ADMIN ONLY */}
      {user?.role === ROLES.ADMIN && (
        <>
          <Link
            to="/admin"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Admin Panel
          </Link>

          <Link
            to="/admin/owners"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Owners
          </Link>

          <Link
            to="/admin/documents"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Documents
          </Link>

          <Link
            to="/admin/snapshots"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            Snapshots
          </Link>

          <Link
            to="/admin/system"
            style={item}
            onMouseEnter={hover}
            onMouseLeave={leave}
          >
            System Monitor
          </Link>
        </>
      )}

      {/* Logout */}
      {user && (
        <div
          style={{
            marginTop: spacing.xxl,
            color: colors.electricCyan,
            cursor: "pointer",
            fontFamily: typography.fonts.body,
            transition: "all 250ms ease",
          }}
          onMouseEnter={(e) => (e.target.style.color = colors.neonGreen)}
          onMouseLeave={(e) => (e.target.style.color = colors.electricCyan)}
          onClick={() => {
            logout();
            window.location.href = "/login";
          }}
        >
          Logout
        </div>
      )}
    </div>
  );
}
