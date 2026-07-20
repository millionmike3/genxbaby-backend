export async function logAudit(action: string, metadata: any = {}) {
  await fetch("/api/admin/audit/log", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, metadata }),
  });
}
