import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RiskService } from './risk.service';
import { RiskController } from './risk.controller';
import { RiskScoringEngine } from './risk-scoring.engine';

@Module({
  imports: [PrismaModule],
  controllers: [RiskController],
  providers: [RiskService, RiskScoringEngine],
  exports: [RiskService],
})
export class RiskModule {}
