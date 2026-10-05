import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class OwnersService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  async getOwner(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        documents: true,
        riskHistory: true,
        pricingDecisions: true,
        suspiciousActivityReports: true,
      },
    });

    if (!owner) throw new NotFoundException('Owner not found');
    return owner;
  }

  async updateOwner(ownerId: string, data: any, userId: string) {
    const updated = await this.prisma.owner.update({
      where: { id: ownerId },
      data,
    });

    await this.audit.log('OWNER_UPDATED', userId, { ownerId });
    return updated;
  }

  async addRiskEvent(ownerId: string, type: string, userId: string) {
    const event = await this.prisma.riskHistoryLog.create({
      data: {
        ownerId,
        type,
        timestamp: new Date(),
      },
    });

    await this.audit.log('RISK_EVENT_ADDED', userId, { ownerId, type });
    return event;
  }

  async addPricingDecision(ownerId: string, decision: string, userId: string) {
    const log = await this.prisma.pricingDecisionLog.create({
      data: {
        ownerId,
        decision,
        timestamp: new Date(),
      },
    });

    await this.audit.log('PRICING_DECISION_ADDED', userId, { ownerId, decision });
    return log;
  }

  async fileSAR(ownerId: string, reason: string, userId: string) {
    const sar = await this.prisma.suspiciousActivityReport.create({
      data: {
        ownerId,
        reason,
        timestamp: new Date(),
      },
    });

    await this.audit.log('SAR_FILED', userId, { ownerId, reason });
    return sar;
  }
}
