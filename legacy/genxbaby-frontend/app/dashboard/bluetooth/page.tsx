"use client";

import BluetoothScanner from "@/components/BluetoothScanner";
import { useState } from "react";

export default function BluetoothPage() {
  const [history, setHistory] = useState<any[]>([]);

  const handleDeviceDetected = (device: any) => {
    setHistory((prev) => [
      { name: device?.name || "Unknown Device", time: new Date().toLocaleTimeString() },
      ...prev,
    ]);
  };

  return (
    <div className="p-6 space-y-8">

      {/* HERO HEADER */}
      <div className="gx-gradient p-8 rounded-2xl shadow-lg">
        <h1 className="gx-text-primary text-3xl font-bold">Bluetooth Scanner</h1>
        <p className="gx-text-secondary mt-2 text-lg">
          Detect nearby GenXBaby users and devices in real time.
        </p>
      </div>

      {/* SCANNER COMPONENT */}
      <div className="gx-card p-6 rounded-xl">
        <BluetoothScanner onDeviceDetected={handleDeviceDetected} />
      </div>

      {/* RECENT DEVICES */}
      <div className="gx-card p-6 rounded-xl">
        <h2 className="gx-text-primary text-lg font-semibold mb-4">Recently Detected Devices</h2>

        {history.length === 0 && (
          <p className="gx-text-secondary text-sm">No devices detected yet.</p>
        )}

        <div className="space-y-3">
          {history.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
            >
              <span className="gx-text-primary">{item.name}</span>
              <span className="gx-text-secondary text-sm">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
