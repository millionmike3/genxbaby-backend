import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FraudGraphService } from './fraud-graph.service';
import { FraudScoringService } from './fraud-scoring.service';
import { FraudClusterService } from './fraud-cluster.service';
import { FraudIntelligenceService } from './fraud-intelligence.service';
import { FraudController } from './fraud.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    FraudGraphService,
    FraudScoringService,
    FraudClusterService,
    FraudIntelligenceService,
  ],
  controllers: [FraudController],
  exports: [FraudIntelligenceService],
})
export class FraudModule {}
