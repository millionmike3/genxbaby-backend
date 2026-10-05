export async function logAudit({
  actor,
  action,
  target,
  metadata,
}: {
  actor: string;
  action: string;
  target?: string;
  metadata?: any;
}) {
  try {
    await fetch("/api/audit/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actor, action, target, metadata }),
    });
  } catch (e) {
    console.error("Audit log failed", e);
  }
}
