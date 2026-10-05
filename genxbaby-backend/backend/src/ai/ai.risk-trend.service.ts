import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiRiskTrendService {
  constructor(private prisma: PrismaService) {}

  /**
   * Returns risk trend: IMPROVING, STABLE, WORSENING
   */
  async getRiskTrend(ownerId: string) {
    const history = await this.prisma.riskHistoryLog.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'desc' },
      take: 10, // last 10 entries
    });

    if (history.length < 2) {
      return { trend: 'STABLE', delta: 0 };
    }

    const latest = history[0].score;
    const previous = history[1].score;

    const delta = latest - previous;

    let trend = 'STABLE';
    if (delta > 10) trend = 'WORSENING';
    if (delta < -10) trend = 'IMPROVING';

    return { trend, delta, latest, previous };
  }
}
