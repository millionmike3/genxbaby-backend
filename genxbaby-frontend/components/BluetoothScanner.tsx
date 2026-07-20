"use client";

import { motion } from "framer-motion";

export default function BluetoothScanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className="p-6 rounded-2xl shadow-xl bg-white backdrop-blur-xl border border-gray-200"
    >
      <div className="text-sm text-gray-600">Bluetooth Scanner</div>

      <div className="mt-4 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/40"
        />
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        Scanning nearby devices…
      </div>
    </motion.div>
  );
}
