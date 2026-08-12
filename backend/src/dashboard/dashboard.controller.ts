import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

import { AiRiskTrendService } from '../ai/ai.risk-trend.service';
import { AiFraudClusterService } from '../ai/ai.fraud-cluster.service';
import { AiRiskProfileService } from '../ai/ai.risk-profile.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AiFraudTimelineService } from '../ai/ai.fraud-timeline.service';
import { AiFraudNetworkService } from '../ai/ai.fraud-network.service';
import { AiFraudInvestigatorService } from '../ai/ai.fraud-investigator.service';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(
    private dashboard: DashboardService,
    private riskTrend: AiRiskTrendService,          // ⭐ AI Risk Trend Engine
    private fraudCluster: AiFraudClusterService,    // ⭐ Fraud Cluster Engine
    private riskProfile: AiRiskProfileService, 
    private fraudTimeline: AiFraudTimelineService,
    private fraudNetwork: AiFraudNetworkService,
    private investigator: AiFraudInvestigatorService,



     // ⭐ Owner Risk Profile Engine
  ) {}

  @Get('summary')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getSummary(@Req() req) {
    return this.dashboard.getSummary(req.user.ownerId);
  }

  @Get('activity')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getActivity(@Req() req) {
    return this.dashboard.getRecentActivity(req.user.ownerId);
  }

  @Get('ai/checks')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getCheckAiInsights(@Req() req) {
    return this.dashboard.getCheckAiInsights(req.user.ownerId);
  }

  @Get('ai/documents')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getDocumentAiInsights(@Req() req) {
    return this.dashboard.getDocumentAiInsights(req.user.ownerId);
  }

  @Get('ai/alerts')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getAiAlerts(@Req() req) {
    return this.dashboard.getAiAlerts(req.user.ownerId);
  }

  @Get('ai/risk-trend')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getRiskTrend(@Req() req) {
    return this.riskTrend.getRiskTrend(req.user.ownerId);
  }

  @Get('ai/fraud-heatmap')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getFraudHeatmap(@Req() req) {
    return this.dashboard.getFraudHeatmap(req.user.ownerId);
  }

  @Get('ai/fraud-clusters')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getFraudClusters(@Req() req) {
    return this.fraudCluster.getFraudClusters(req.user.ownerId);
  }

  @Get('ai/risk-profile')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getRiskProfile(@Req() req) {
    return this.riskProfile.getOwnerRiskProfile(req.user.ownerId);
  }
  @Get('ai/fraud-timeline')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
   async getFraudTimeline(@Req() req) {
   return this.fraudTimeline.getFraudTimeline(req.user.ownerId);
  }
  @Get('ai/fraud-network')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async getFraudNetwork(@Req() req) {
  return this.fraudNetwork.getFraudNetwork(req.user.ownerId);
  }
  @Post('ai/investigator')
  @UseGuards(new PermissionsGuard(['DASHBOARD:READ']))
  async askInvestigator(@Req() req, @Body() body) {
  return this.investigator.investigate(req.user.ownerId, body.question);
  }


}
