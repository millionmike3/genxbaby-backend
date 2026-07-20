"use client";

import { motion } from "framer-motion";

export default function SignalCard({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  const color =
    value >= 80
      ? "from-green-500 to-emerald-600"
      : value >= 50
      ? "from-yellow-500 to-amber-600"
      : "from-red-500 to-rose-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.25 }}
      className="p-6 rounded-2xl shadow-xl bg-gradient-to-br text-white cursor-pointer
      backdrop-blur-xl border border-white/10"
    >
      <div className="text-sm opacity-80">{title}</div>

      <div
        className={`mt-3 text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
      >
        {value ?? "—"}
      </div>

      <div className="mt-2 text-xs opacity-70">Updated just now</div>
    </motion.div>
  );
}
