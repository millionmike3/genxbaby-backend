import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FraudIntelligenceService } from '../fraud/fraud-intelligence.service';
import { SyntheticIntelligenceService } from '../synthetic/synthetic-intelligence.service';
import { UnderwritingIntelligenceService } from '../underwriting/underwriting-intelligence.service';

@Injectable()
export class CaseIntelligenceService {
  constructor(
    private prisma: PrismaService,
    private fraudIntel: FraudIntelligenceService,
    private syntheticIntel: SyntheticIntelligenceService,
    private underwritingIntel: UnderwritingIntelligenceService,
  ) {}

  // ────────────────────────────────────────────────
  // ⭐ GET CASE (Tenant‑Aware)
  // ────────────────────────────────────────────────
  async getCase(caseId: string, orgId: string) {
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId: orgId },
      include: {
        owner: {
          include: {
            accounts: true,
            devices: true,
            documents: { include: { fraudResults: true } },
            checks: { include: { fraudFlags: true, sarReports: true } },
            fraudFlags: true,
            sarReports: true,
            identityEvents: true,
          },
        },
        alerts: true,
        notes: true,
        attachments: true,
      },
    });

    if (!caseRecord) {
      throw new Error('Case not found in this organization');
    }

    const ownerId = caseRecord.ownerId;

    // ────────────────────────────────────────────────
    // ⭐ FRAUD INTELLIGENCE
    // ────────────────────────────────────────────────
    const fraud = await this.fraudIntel.analyzeOwner(ownerId, orgId);

    // ────────────────────────────────────────────────
    // ⭐ SYNTHETIC INTELLIGENCE
    // ────────────────────────────────────────────────
    const synthetic = await this.syntheticIntel.analyze(ownerId, orgId);

    // ────────────────────────────────────────────────
    // ⭐ UNDERWRITING INTELLIGENCE
    // ────────────────────────────────────────────────
    const underwriting = await this.underwritingIntel.underwrite(ownerId, orgId);

    // ────────────────────────────────────────────────
    // ⭐ CASE SUMMARY (Enterprise‑Grade)
    // ────────────────────────────────────────────────
    const summary = {
      caseId: caseRecord.id,
      ownerId,
      organizationId: orgId,
      status: caseRecord.status,
      createdAt: caseRecord.createdAt,
      updatedAt: caseRecord.updatedAt,

      alerts: caseRecord.alerts,
      notes: caseRecord.notes,
      attachments: caseRecord.attachments,

      fraudIntel: {
        score: fraud.score,
        routingClusters: fraud.routingClusters,
        deviceClusters: fraud.deviceClusters,
        graph: fraud.graph,
      },

      syntheticIntel: {
        syntheticScore: synthetic.syntheticScore,
        signals: synthetic.signals,
        deviceClusters: synthetic.deviceClusters,
      },

      underwritingIntel: {
        fraudIntel: underwriting.fraudIntel,
        syntheticIntel: underwriting.syntheticIntel,
      },
    };

    return summary;
  }

  // ────────────────────────────────────────────────
  // ⭐ GET ALL CASES FOR AN ORGANIZATION
  // ────────────────────────────────────────────────
  async listCases(orgId: string) {
    return this.prisma.case.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: true,
        alerts: true,
      },
    });
  }

  // ────────────────────────────────────────────────
  // ⭐ GET CASE RISK SNAPSHOT (For dashboards)
  // ────────────────────────────────────────────────
  async getCaseRiskSnapshot(caseId: string, orgId: string) {
    const caseRecord = await this.prisma.case.findFirst({
      where: { id: caseId, organizationId: orgId },
      include: {
        owner: {
          include: {
            fraudFlags: true,
            sarReports: true,
            checks: true,
          },
        },
        alerts: true,
      },
    });

    if (!caseRecord) {
      throw new Error('Case not found in this organization');
    }

    const ownerId = caseRecord.ownerId;

    const fraud = await this.fraudIntel.analyzeOwner(ownerId, orgId);
    const synthetic = await this.syntheticIntel.analyze(ownerId, orgId);

    return {
      caseId,
      ownerId,
      fraudScore: fraud.score,
      syntheticScore: synthetic.syntheticScore,
      alertCount: caseRecord.alerts.length,
      fraudFlagCount: caseRecord.owner.fraudFlags.length,
      sarCount: caseRecord.owner.sarReports.length,
      checkCount: caseRecord.owner.checks.length,
    };
  }
}

