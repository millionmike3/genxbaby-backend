import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UnderwritingScoringService } from './underwriting-scoring.service';
import { UnderwritingDecisionService } from './underwriting-decision.service';
import { FraudIntelligenceService } from '../fraud/fraud-intelligence.service';
import { SyntheticIntelligenceService } from '../synthetic/synthetic-intelligence.service';

@Injectable()
export class UnderwritingIntelligenceService {
  constructor(
    private prisma: PrismaService,
    private scoring: UnderwritingScoringService,
    private decision: UnderwritingDecisionService,
    private fraud: FraudIntelligenceService,
    private synthetic: SyntheticIntelligenceService,
  ) {}

  async underwrite(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        incomeSnapshots: true,
        financialHealthSnapshots: true,
        documents: { include: { fraudResults: true } },
      },
    });

    const fraudIntel = await this.fraud.analyzeOwner(ownerId);
    const syntheticIntel = await this.synthetic.analyze(ownerId);

    const incomeScore = owner.incomeSnapshots.length
      ? owner.incomeSnapshots[0].incomeStabilityScore
      : 50;

    const documentScore = owner.documents.length
      ? Math.max(...owner.documents.flatMap(d => d.fraudResults.map(r => 100 - r.fraudScore)))
      : 50;

    const behaviorScore = owner.financialHealthSnapshots.length
      ? owner.financialHealthSnapshots[0].behaviorScore
      : 50;

    const inputs = {
      identityRisk: owner.riskScore || 50,
      fraudScore: fraudIntel.score.score,
      syntheticScore: syntheticIntel.syntheticScore,
      incomeScore,
      documentScore,
      behaviorScore,
    };

    const scoreResult = this.scoring.computeScore(inputs);
    const decisionResult = this.decision.decide(scoreResult.score, scoreResult.reasons);

    return {
      ownerId,
      underwritingScore: scoreResult.score,
      decision: decisionResult.decision,
      reasons: decisionResult.reasons,
      fraudIntel,
      syntheticIntel,
      incomeScore,
      documentScore,
      behaviorScore,
    };
  }
}
