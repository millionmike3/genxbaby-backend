// src/api/client.js
import { logoutUser } from "./auth";

const API_BASE = "https://api.genxbaby.com"; // change to your backend URL

export async function api(path, options = {}) {
  const token = localStorage.getItem("genxbaby_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  // Auto logout on expired token
  if (res.status === 401) {
    logoutUser();
    window.location.href = "/login";
    return;
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new Error(data?.message || "API Error");
  }

  return data;
}
