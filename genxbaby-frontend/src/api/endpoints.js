// src/api/endpoints.js
import { api } from "./client";
import { saveUserSession } from "./auth";

export const AuthAPI = {
  login: async (email, password) => {
    const data = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    saveUserSession({
      token: data.token,
      email: data.email,
      role: data.role,
    });

    return data;
  },

  register: (email, password) =>
    api("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  forgot: (email) =>
    api("/auth/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
};
export const OwnerAPI = {
  stats: () => api("/owner/stats"),
  properties: () => api("/owner/properties"),
  equity: () => api("/owner/equity"),
  activity: () => api("/owner/activity"),
  payments: () => api("/owner/payments"),
};
export const InvestorAPI = {
  stats: () => api("/investor/stats"),
  portfolio: () => api("/investor/portfolio"),
  opportunities: () => api("/investor/opportunities"),

  invest: (payload) =>
    api("/investor/invest", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
export const BorrowerAPI = {
  application: () => api("/borrower/application"),

  submitApplication: (payload) =>
    api("/borrower/apply", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  funding: () => api("/borrower/funding"),
  documents: () => api("/borrower/documents"),
  payments: () => api("/borrower/payments"),
};
export const AdminAPI = {
  stats: () => api("/admin/stats"),

  owners: () => api("/admin/owners"),
  ownerDetails: (id) => api(`/admin/owners/${id}`),

  documents: () => api("/admin/documents"),
  snapshots: () => api("/admin/snapshots"),

  system: () => api("/admin/system"),
};
export const NotificationAPI = {
  list: () => api("/notifications"),
  markRead: (id) =>
    api(`/notifications/read/${id}`, {
      method: "POST",
    }),
};
