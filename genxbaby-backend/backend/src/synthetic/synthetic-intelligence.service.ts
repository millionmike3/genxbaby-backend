import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SyntheticSignalsService } from './synthetic-signals.service';
import { SyntheticCollisionService } from './synthetic-collision.service';
import { SyntheticDocumentsService } from './synthetic-documents.service';
import { SyntheticDevicesService } from './synthetic-devices.service';
import { SyntheticBehaviorService } from './synthetic-behavior.service';
import { SyntheticScoringService } from './synthetic-scoring.service';
import { FraudClusterService } from '../fraud/fraud-cluster.service';

@Injectable()
export class SyntheticIntelligenceService {
  constructor(
    private prisma: PrismaService,
    private signals: SyntheticSignalsService,
    private collisions: SyntheticCollisionService,
    private documents: SyntheticDocumentsService,
    private devices: SyntheticDevicesService,
    private behavior: SyntheticBehaviorService,
    private scoring: SyntheticScoringService,
    private fraudClusters: FraudClusterService,
  ) {}

async analyze(ownerId: string, orgId: string) {
  const owner = await this.prisma.owner.findFirst({
    where: { id: ownerId, organizationId: orgId },
    include: {
      accounts: true,
      devices: true,
      documents: { include: { fraudResults: true } },
      checks: true,
      identityEvents: true,
    },
  });

  if (!owner) throw new Error('Owner not found in this organization');

  const deviceClusters = await this.fraudClusters.detectDeviceClusters(ownerId, orgId);

  const signals = [
    ...this.signals.extract(owner),
    ...await this.collisions.detect(owner, orgId),
    ...this.documents.detect(owner),
    ...this.devices.detect(owner, deviceClusters),
    ...this.behavior.detect(owner),
  ];

  const syntheticScore = this.scoring.score(signals);

  return { syntheticScore, signals, deviceClusters };
}

}
