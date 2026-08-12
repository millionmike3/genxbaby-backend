import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Log an audit event
   */
  async log(action: string, userId: string, meta: any = {}) {
    return this.prisma.auditLog.create({
      data: {
        action,
        userId,
        meta: JSON.stringify(meta),
        timestamp: new Date(),
      },
    });
  }

  /**
   * Get recent audit events for dashboard activity feed
   */
  async getRecent(ownerId: string) {
    return this.prisma.auditLog.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
      take: 50,
    });
  }

  /**
   * Get full audit history (used for anchoring)
   */
  async getAll(ownerId: string) {
    return this.prisma.auditLog.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'asc' },
    });
  }
}
