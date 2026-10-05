import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FraudGraphService {
  constructor(private prisma: PrismaService) {}

  async buildOwnerGraph(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        accounts: true,
        devices: true,
        documents: {
          include: { ocrExtractions: true, fraudResults: true },
        },
        checks: {
          include: { fraudFlags: true, sarReports: true },
        },
        fraudFlags: true,
        sarReports: true,
      },
    });

    return {
      owner,
      nodes: this.buildNodes(owner),
      edges: this.buildEdges(owner),
    };
  }

  buildNodes(owner) {
    const nodes = [];

    nodes.push({ id: owner.id, type: 'OWNER', label: owner.fullName });

    owner.accounts.forEach(a =>
      nodes.push({ id: a.id, type: 'ACCOUNT', label: a.routingNumber })
    );

    owner.devices.forEach(d =>
      nodes.push({ id: d.id, type: 'DEVICE', label: d.deviceId })
    );

    owner.documents.forEach(doc =>
      nodes.push({ id: doc.id, type: 'DOCUMENT', label: doc.fileName })
    );

    owner.checks.forEach(c =>
      nodes.push({ id: c.id, type: 'CHECK', label: `#${c.checkNumber}` })
    );

    owner.fraudFlags.forEach(f =>
      nodes.push({ id: f.id, type: 'FRAUD_FLAG', label: f.type })
    );

    owner.sarReports.forEach(s =>
      nodes.push({ id: s.id, type: 'SAR', label: s.type })
    );

    return nodes;
  }

  buildEdges(owner) {
    const edges = [];

    owner.accounts.forEach(a =>
      edges.push({ from: owner.id, to: a.id, type: 'OWNS_ACCOUNT' })
    );

    owner.devices.forEach(d =>
      edges.push({ from: owner.id, to: d.id, type: 'OWNS_DEVICE' })
    );

    owner.documents.forEach(doc =>
      edges.push({ from: owner.id, to: doc.id, type: 'OWNS_DOCUMENT' })
    );

    owner.checks.forEach(c =>
      edges.push({ from: owner.id, to: c.id, type: 'OWNS_CHECK' })
    );

    owner.fraudFlags.forEach(f =>
      edges.push({ from: owner.id, to: f.id, type: 'HAS_FRAUD_FLAG' })
    );

    owner.sarReports.forEach(s =>
      edges.push({ from: owner.id, to: s.id, type: 'HAS_SAR' })
    );

    return edges;
  }
}
