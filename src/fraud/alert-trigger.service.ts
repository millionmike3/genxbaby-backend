import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertRulesService } from './alert-rules.service';
import { AlertDispatcherService } from './alert-dispatcher.service';

@Injectable()
export class AlertTriggerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly rules: AlertRulesService,
    private readonly dispatcher: AlertDispatcherService,
  ) {}

  async generateAlertsForOwner(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
  where: { id: ownerId },
  include: {
    accounts: true,      // was ownerAccount
    devices: true,       // if you had ownerDevice
    documents: {
      include: {
        fraudResults: true, // or documentFraudResult if that’s the actual field
      },
    },
    sarReports: true,
  },
});


    if (!owner) return [];

    const alerts = this.rules.evaluate(owner);

    for (const alert of alerts) {
      await this.prisma.fraudAlert.create({
        data: {
          ownerId,
          organizationId: owner.organizationId,
          type: alert.type,
          severity: alert.severity,
          meta: alert.message,
        },
      });
    }

    return alerts;
  }
}
