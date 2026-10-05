import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CaseWorkflowService {
  constructor(private prisma: PrismaService) {}

  /**
   * Update the status of a case within an organization.
   * Enforces tenant isolation using organizationId.
   */
  async updateStatus(caseId: string, orgId: string, status: string) {
    // updateMany ensures tenant isolation (id + organizationId)
    const result = await this.prisma.case.updateMany({
      where: { id: caseId, organizationId: orgId },
      data: { status },
    });

    if (result.count === 0) {
      throw new Error('Case not found in this organization');
    }

    return {
      caseId,
      organizationId: orgId,
      status,
      updated: true,
    };
  }

  /**
   * Optional: escalate a case
   */
  async escalate(caseId: string, orgId: string) {
    return this.updateStatus(caseId, orgId, 'ESCALATED');
  }

  /**
   * Optional: close a case
   */
  async close(caseId: string, orgId: string) {
    return this.updateStatus(caseId, orgId, 'CLOSED');
  }

  /**
   * Optional: reopen a case
   */
  async reopen(caseId: string, orgId: string) {
    return this.updateStatus(caseId, orgId, 'OPEN');
  }
}

