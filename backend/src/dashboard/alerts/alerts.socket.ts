// src/dashboard/alerts/alerts.socket.ts
import { io } from "socket.io-client";

let socket = null;

export function initAlertsSocket(apiUrl, ownerId, onAlert) {
  socket = io(apiUrl, {
    transports: ["websocket"],
    reconnection: true,
  });

  socket.emit("subscribeToAlerts", { ownerId });

  socket.on("fraudAlert", (alert) => {
    onAlert(alert);
  });

  return socket;
}

export function disconnectAlertsSocket() {
  if (socket) socket.disconnect();
}
