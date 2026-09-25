import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AlertRulesService } from './alert-rules.service';

@Injectable()
export class AlertTriggerService {
  constructor(
    private prisma: PrismaService,
    private rules: AlertRulesService,
  ) {}

  async run(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        accounts: true,
        devices: true,
        documents: { include: { fraudResults: true } },
        checks: { include: { fraudFlags: true } },
        fraudFlags: true,
        sarReports: true,
      },
    });

    const alerts = this.rules.evaluate(owner);

    // Store alerts
    const stored = await Promise.all(
      alerts.map(alert =>
        this.prisma.fraudAlert.create({
          data: {
            ownerId,
            type: alert.type,
            severity: alert.severity,
            message: alert.message,
          },
        })
      )
    );

    return stored;
  }
}
