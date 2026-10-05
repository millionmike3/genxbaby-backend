import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Audit Logging Service
 *
 * Records admin actions such as:
 *  - batch anchoring
 *  - underwriting decisions
 *  - system events
 */
export async function logAudit(params: {
  actor: string;        // adminId
  action: string;       // what happened
  target?: string | number; // optional target entity
  metadata?: any;       // optional JSON metadata
  ip?: string;          // optional IP address
}) {
  const { actor, action, metadata, ip } = params;

  return prisma.auditLog.create({
    data: {
      adminId: actor,
      action,
      ip: ip ?? null,
      metadata: metadata ?? null
    }
  });
}
