export function logError(error, context = "") {
  console.error(`[${context}]`, error);

  // Optional: send to backend
  // fetch("/api/log-error", { method: "POST", body: JSON.stringify({ error, context }) });
}
