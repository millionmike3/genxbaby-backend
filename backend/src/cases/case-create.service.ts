import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseCreateService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new case for an owner within an organization.
   * Optionally attach an alert to the case.
   */
  async createCase(ownerId: string, orgId: string, alertId?: string) {
    return this.prisma.case.create({
      data: {
        ownerId,
        organizationId: orgId,
        status: 'OPEN',

        // Optional alert attachment
        alerts: alertId
          ? { connect: { id: alertId } }
          : undefined,
      },
      include: {
        owner: true,
        alerts: true,
      },
    });
  }
