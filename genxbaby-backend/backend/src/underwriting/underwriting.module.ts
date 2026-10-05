import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UnderwritingScoringService } from './underwriting-scoring.service';
import { UnderwritingDecisionService } from './underwriting-decision.service';
import { UnderwritingIntelligenceService } from './underwriting-intelligence.service';
import { UnderwritingController } from './underwriting.controller';
import { FraudIntelligenceService } from '../fraud/fraud-intelligence.service';
import { SyntheticIntelligenceService } from '../synthetic/synthetic-intelligence.service';

@Module({
  imports: [PrismaModule],
  providers: [
    UnderwritingScoringService,
    UnderwritingDecisionService,
    UnderwritingIntelligenceService,
    FraudIntelligenceService,
    SyntheticIntelligenceService,
  ],
  controllers: [UnderwritingController],
  exports: [UnderwritingIntelligenceService],
})
export class UnderwritingModule {}
