// src/navigation/AppRouter.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthProvider from "../auth/AuthContext";
import ProtectedRoute from "../auth/ProtectedRoute";
import { ROLES } from "../auth/roles";

// Layout
import DashboardLayout from "./DashboardLayout";

// Landing
import Landing from "../landing/Landing";

// Auth
import Login from "../auth/Login";
import Register from "../auth/Register";
import ForgotPassword from "../auth/ForgotPassword";

// Dashboard
import UnderwritingSummary from "../pages/UnderwritingSummary";
import OwnerProfile from "../pages/OwnerProfile";
import DocumentUpload from "../pages/DocumentUpload";
import SnapshotHistory from "../pages/SnapshotHistory";

// Admin
import AdminDashboard from "../admin/AdminDashboard";
import Owners from "../admin/Owners";
import OwnerDetails from "../admin/OwnerDetails";
import Documents from "../admin/Documents";
import Snapshots from "../admin/Snapshots";
import SystemMonitor from "../admin/SystemMonitor";

export default function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          {/* Dashboard (OWNER, INVESTOR, BORROWER, ADMIN) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN, ROLES.OWNER, ROLES.INVESTOR, ROLES.BORROWER]}>
                <DashboardLayout title="Underwriting Summary">
                  <UnderwritingSummary ownerId="1" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/owner"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN, ROLES.OWNER]}>
                <DashboardLayout title="Owner Profile">
                  <OwnerProfile ownerId="1" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN, ROLES.OWNER]}>
                <DashboardLayout title="Document Upload">
                  <DocumentUpload ownerId="1" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN, ROLES.OWNER]}>
                <DashboardLayout title="Snapshot History">
                  <SnapshotHistory ownerId="1" />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN]}>
                <DashboardLayout title="Admin Panel">
                  <AdminDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/owners"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN]}>
                <DashboardLayout title="Owners">
                  <Owners />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/owners/:id"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN]}>
                <DashboardLayout title="Owner Details">
                  <OwnerDetails />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/documents"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN]}>
                <DashboardLayout title="Documents">
                  <Documents />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/snapshots"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN]}>
                <DashboardLayout title="Snapshots">
                  <Snapshots />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/system"
            element={
              <ProtectedRoute allowed={[ROLES.ADMIN]}>
                <DashboardLayout title="System Monitor">
                  <SystemMonitor />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
