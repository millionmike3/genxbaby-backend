"use client";

import { motion } from "framer-motion";

export default function UltraFavorable({ active }: { active: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-2xl shadow-xl border backdrop-blur-xl
      ${
        active
          ? "bg-gradient-to-br from-purple-500 to-blue-600 border-white/20 text-white"
          : "bg-white border-gray-200 text-gray-700"
      }`}
    >
      <div className="text-sm opacity-80">Ultra Favorable</div>

      <div
        className={`mt-3 text-3xl font-bold ${
          active ? "text-white" : "text-gray-800"
        }`}
      >
        {active ? "YES" : "NO"}
      </div>

      {active && (
        <div className="mt-2 text-xs opacity-80 animate-pulse">
          Conditions are extremely favorable
        </div>
      )}
    </motion.div>
  );
}
