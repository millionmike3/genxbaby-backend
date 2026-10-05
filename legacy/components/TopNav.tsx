"use client";

import { motion } from "framer-motion";

export default function TopNav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full h-16 bg-white/70 backdrop-blur-xl border-b 
      border-gray-200 shadow-sm flex items-center justify-between px-6"
    >
      <h2 className="text-lg font-semibold tracking-wide text-gray-800">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <button className="material-icons text-gray-600 hover:text-gray-900">
          notifications
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br 
        from-purple-500 to-blue-500 shadow-md" />
      </div>
    </motion.header>
  );
}
