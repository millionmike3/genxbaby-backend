// dashboard/alerts.socket.ts

import { io } from "socket.io-client";

let socket = null;

/**
 * Initialize WebSocket connection for real-time fraud alerts
 */
export function initAlertsSocket(apiUrl: string, ownerId: string, onAlertCallback: (alert: any) => void) {
  if (!apiUrl || !ownerId) return;

  // Create socket connection
  socket = io(apiUrl, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
  });

  // Subscribe to owner-specific alert channel
  socket.emit("subscribeToAlerts", { ownerId });

  // Listen for fraud alerts
  socket.on("fraudAlert", (alert) => {
    console.log("🔥 New Fraud Alert:", alert);

    // Pass alert to dashboard UI
    if (onAlertCallback) {
      onAlertCallback(alert);
    }
  });

  return socket;
}

/**
 * Close the socket connection
 */
export function disconnectAlertsSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
