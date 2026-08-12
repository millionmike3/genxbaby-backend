import { Module } from '@nestjs/common';

import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';

import { AiRiskService } from '../ai/ai.risk.service';
import { AiFraudService } from '../ai/ai.fraud.service';
import { AiRiskTrendService } from '../ai/ai.risk-trend.service';
import { AiFraudClusterService } from '../ai/ai.fraud-cluster.service';
import { AiRiskProfileService } from '../ai/ai.risk-profile.service';
import { AiFraudTimelineService } from '../ai/ai.fraud-timeline.service';
import { AiFraudNetworkService } from '../ai/ai.fraud-network.service';
import { AiFraudInvestigatorService } from '../ai/ai.fraud-investigator.service';   // ⭐ REQUIRED

@Module({
  controllers: [DashboardController],
  providers: [
    // Core services
    PrismaService,
    AuditService,
    DashboardService,

    // AI engines used by dashboard
    AiRiskService,
    AiFraudService,
    AiRiskTrendService,
    AiFraudClusterService,
    AiRiskProfileService,
    AiFraudTimelineService,
    AiFraudNetworkService,
    AiFraudInvestigatorService,   // ⭐ Now valid
  ],
  exports: [
    DashboardService,
    AiRiskTrendService,
    AiFraudClusterService,
    AiRiskProfileService,
    AiFraudTimelineService,
    AiFraudNetworkService,
    AiFraudInvestigatorService,
  ],
})
export class DashboardModule {}
