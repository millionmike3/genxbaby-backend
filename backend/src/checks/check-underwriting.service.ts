import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CheckSignalsService } from './check-signals.service';
import { CheckFraudService } from './check-fraud.service';
import { CheckSyntheticService } from './check-synthetic.service';
import { CheckVelocityService } from './check-velocity.service';
import { CheckScoringService } from './check-scoring.service';
import { CheckDecisionService } from './check-decision.service';
import { SyntheticIntelligenceService } from '../synthetic/synthetic-intelligence.service';

@Injectable()
export class CheckUnderwritingService {
  constructor(
    private prisma: PrismaService,
    private signals: CheckSignalsService,
    private fraud: CheckFraudService,
    private synthetic: CheckSyntheticService,
    private velocity: CheckVelocityService,
    private scoring: CheckScoringService,
    private decision: CheckDecisionService,
    private syntheticIntel: SyntheticIntelligenceService,
  ) {}

  async underwrite(checkId: string, orgId: string) {
    const check = await this.prisma.check.findFirst({
      where: { id: checkId, organizationId: orgId },
      include: {
        fraudFlags: true,
        sarReports: true,
        bankProfile: true,
        signer: true,
        owner: {
          include: {
            checks: true,
            accounts: true,
            devices: true,
            documents: { include: { fraudResults: true } },
            identityEvents: true,
            fraudFlags: true,
            sarReports: true,
          },
        },
      },
    });

    if (!check) throw new Error('Check not found in this organization');

    const syntheticResult = await this.syntheticIntel.analyze(check.ownerId, orgId);
    const syntheticScore = syntheticResult.syntheticScore;

    const signals = [
      ...this.signals.extract(check),
      ...this.fraud.extract(check),
      ...this.synthetic.extract(check, syntheticScore),
      ...this.velocity.extract(check, check.owner),
    ];

    const score = this.scoring.score(signals);
    const decision = this.decision.decide(score, signals);

    return {
      checkId,
      organizationId: orgId,
      score,
      decision: decision.decision,
      signals,
      syntheticScore,
    };
  }
}
