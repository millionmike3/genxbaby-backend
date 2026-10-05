import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { SyntheticSignalsService } from './synthetic-signals.service';
import { SyntheticCollisionService } from './synthetic-collision.service';
import { SyntheticDocumentsService } from './synthetic-documents.service';
import { SyntheticDevicesService } from './synthetic-devices.service';
import { SyntheticBehaviorService } from './synthetic-behavior.service';
import { SyntheticScoringService } from './synthetic-scoring.service';
import { SyntheticIntelligenceService } from './synthetic-intelligence.service';
import { SyntheticController } from './synthetic.controller';
import { FraudClusterService } from '../fraud/fraud-cluster.service';

@Module({
  imports: [PrismaModule],
  providers: [
    SyntheticSignalsService,
    SyntheticCollisionService,
    SyntheticDocumentsService,
    SyntheticDevicesService,
    SyntheticBehaviorService,
    SyntheticScoringService,
    SyntheticIntelligenceService,
    FraudClusterService,
  ],
  controllers: [SyntheticController],
  exports: [SyntheticIntelligenceService],
})
export class SyntheticModule {}
