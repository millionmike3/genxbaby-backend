import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CheckSignalsService } from './check-signals.service';
import { CheckFraudService } from './check-fraud.service';
import { CheckSyntheticService } from './check-synthetic.service';
import { CheckVelocityService } from './check-velocity.service';
import { CheckScoringService } from './check-scoring.service';
import { CheckDecisionService } from './check-decision.service';
import { CheckUnderwritingService } from './check-underwriting.service';
import { CheckController } from './check.controller';
import { SyntheticIntelligenceService } from '../synthetic/synthetic-intelligence.service';

@Module({
  imports: [PrismaModule],
  providers: [
    CheckSignalsService,
    CheckFraudService,
    CheckSyntheticService,
    CheckVelocityService,
    CheckScoringService,
    CheckDecisionService,
    CheckUnderwritingService,
    SyntheticIntelligenceService,
  ],
  controllers: [CheckController],
  exports: [CheckUnderwritingService],
})
export class CheckModule {}
