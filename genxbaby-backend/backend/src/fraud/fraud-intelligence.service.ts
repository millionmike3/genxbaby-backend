import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FraudGraphService } from './fraud-graph.service';
import { FraudScoringService } from './fraud-scoring.service';
import { FraudClusterService } from './fraud-cluster.service';

@Injectable()
export class FraudIntelligenceService {
  constructor(
    private prisma: PrismaService,               // ✅ REQUIRED
    private graph: FraudGraphService,
    private scoring: FraudScoringService,
    private clusters: FraudClusterService,
  ) {}

  async analyzeOwner(ownerId: string, orgId: string) {
  const owner = await this.prisma.owner.findFirst({
    where: { id: ownerId, organizationId: orgId },
    include: {
      accounts: true,
      devices: true,
      documents: { include: { fraudResults: true } },
      checks: { include: { fraudFlags: true, sarReports: true } },
      fraudFlags: true,
      sarReports: true,
    },
  });

  if (!owner) throw new Error('Owner not found in this organization');

  const graph = await this.graph.buildOwnerGraph(ownerId, orgId);
  const score = this.scoring.computeScore(graph);

  const routingClusters = await this.clusters.detectRoutingClusters(ownerId, orgId);
  const deviceClusters = await this.clusters.detectDeviceClusters(ownerId, orgId);

  return { graph, score, routingClusters, deviceClusters };
}

}
