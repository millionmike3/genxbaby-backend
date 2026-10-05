// genxbaby-backend/server/websocket.ts

import { WebSocketServer } from "ws";
import { prisma } from "@/lib/prisma";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ type: "connected" }));
});

export async function broadcastBluetoothEvent(eventId: string) {
  const event = await prisma.bluetoothEvent.findUnique({
    where: { id: eventId },
  });

  if (!event) return;

  const payload = JSON.stringify({
    type: "bluetooth-event",
    event,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(payload);
    }
  });
}
