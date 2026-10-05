import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiFraudTimelineService {
  constructor(private prisma: PrismaService) {}

  async getFraudTimeline(ownerId: string) {
    const alerts = await this.prisma.fraudAlert.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'asc' },
    });

    const checkInsights = await this.prisma.aiCheckInsight.findMany({
      where: { check: { ownerId } },
      orderBy: { createdAt: 'asc' },
      include: { check: true },
    });

    const docInsights = await this.prisma.aiDocumentInsight.findMany({
      where: { document: { ownerId } },
      orderBy: { createdAt: 'asc' },
      include: { document: true },
    });

    const timeline = [];

    alerts.forEach(a => {
      timeline.push({
        type: "ALERT",
        severity: a.severity,
        timestamp: a.timestamp,
        label: a.type.replace(/_/g, " "),
      });
    });

    checkInsights.forEach(c => {
      timeline.push({
        type: "CHECK",
        severity: c.riskLevel,
        timestamp: c.createdAt,
        label: `Check #${c.check.id} — Score ${c.score}`,
      });
    });

    docInsights.forEach(d => {
      timeline.push({
        type: "DOCUMENT",
        severity: d.riskLevel,
        timestamp: d.createdAt,
        label: `Document #${d.document.id} — Score ${d.score}`,
      });
    });

    timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return timeline;
  }
}
