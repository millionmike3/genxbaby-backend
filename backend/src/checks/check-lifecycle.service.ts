import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { CheckStatus, LifecycleType } from '@prisma/client';

@Injectable()
export class CheckLifecycleService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
  ) {}

  // ⭐ MAIN ENTRY POINT
  async transition(checkId: string, type: LifecycleType, metadata: any = {}) {
    const check = await this.prisma.check.findUnique({
      where: { id: checkId },
    });

    if (!check) throw new NotFoundException('Check not found');

    // Validate transition
    const nextStatus = this.mapLifecycleToStatus(type);
    this.validateTransition(check.status, nextStatus);

    // Update check status + timestamps
    const timestampField = this.mapStatusToTimestampField(nextStatus);

    await this.prisma.check.update({
      where: { id: checkId },
      data: {
        status: nextStatus,
        ...(timestampField ? { [timestampField]: new Date() } : {}),
      },
    });

    // Record lifecycle event
    await this.prisma.checkLifecycleEvent.create({
      data: {
        checkId,
        type,
        metadata,
      },
    });

    // Record audit log
    await this.audit.logCheck(checkId, `Lifecycle: ${type}`, metadata);

    return {
      checkId,
      status: nextStatus,
      lifecycleEvent: type,
    };
  }

  // ⭐ MAP LIFECYCLE → STATUS
  mapLifecycleToStatus(type: LifecycleType): CheckStatus {
    switch (type) {
      case 'ISSUED': return 'ISSUED';
      case 'CLEARED': return 'CLEARED';
      case 'RETURNED': return 'RETURNED';
      case 'VOIDED': return 'VOIDED';
      case 'REISSUED': return 'REISSUED';
      case 'ARCHIVED': return 'ARCHIVED';
      default: return 'PENDING';
    }
  }

  // ⭐ VALIDATION RULES (Enterprise-grade)
  validateTransition(current: CheckStatus, next: CheckStatus) {
    const validTransitions = {
      PENDING: ['CLEARED', 'RETURNED'],
      ISSUED: ['PENDING', 'VOIDED'],
      VOIDED: ['REISSUED'],
      REISSUED: ['PENDING'],
      CLEARED: ['ARCHIVED'],
      RETURNED: ['ARCHIVED'],
    };

    const allowed = validTransitions[current] || [];

    if (!allowed.includes(next)) {
      throw new BadRequestException(
        `Invalid lifecycle transition: ${current} → ${next}`
      );
    }
  }

  // ⭐ MAP STATUS → TIMESTAMP FIELD
  mapStatusToTimestampField(status: CheckStatus): string | null {
    switch (status) {
      case 'ISSUED': return 'issuedAt';
      case 'CLEARED': return 'clearedAt';
      case 'RETURNED': return 'returnedAt';
      case 'VOIDED': return 'voidedAt';
      case 'ARCHIVED': return 'archivedAt';
      default: return null;
    }
  }

  // ⭐ SPECIAL OPERATIONS

  async voidCheck(checkId: string) {
    return this.transition(checkId, 'VOIDED');
  }

  async clearCheck(checkId: string) {
    return this.transition(checkId, 'CLEARED');
  }

  async returnCheck(checkId: string) {
    return this.transition(checkId, 'RETURNED');
  }

  async archiveCheck(checkId: string) {
    return this.transition(checkId, 'ARCHIVED');
  }

  async issueCheck(checkId: string) {
    return this.transition(checkId, 'ISSUED');
  }

  async reissueCheck(oldCheckId: string, newCheckId: string) {
    // Link old → new
    await this.prisma.check.update({
      where: { id: oldCheckId },
      data: { reissuedToId: newCheckId },
    });

    return this.transition(oldCheckId, 'REISSUED', { newCheckId });
  }
}
