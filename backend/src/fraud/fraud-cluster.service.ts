import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FraudClusterService {
  constructor(private prisma: PrismaService) {}

  async detectRoutingClusters(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: { accounts: true },
    });

    const routingNumbers = owner.accounts.map(a => a.routingNumber);

    return this.prisma.owner.findMany({
      where: {
        accounts: {
          some: {
            routingNumber: { in: routingNumbers },
          },
        },
        NOT: { id: ownerId },
      },
      include: { accounts: true },
    });
  }

  async detectDeviceClusters(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: { devices: true },
    });

    const deviceIds = owner.devices.map(d => d.deviceId);

    return this.prisma.owner.findMany({
      where: {
        devices: {
          some: {
            deviceId: { in: deviceIds },
          },
        },
        NOT: { id: ownerId },
      },
      include: { devices: true },
    });
  }
}
