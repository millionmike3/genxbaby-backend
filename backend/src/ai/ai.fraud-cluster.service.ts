import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiFraudClusterService {
  constructor(private prisma: PrismaService) {}

  /**
   * AI Fraud Cluster Map
   * Groups fraud alerts into clusters based on:
   * - time proximity
   * - shared check/document IDs
   * - shared owner
   * - severity patterns
   */
  async getFraudClusters(ownerId: string) {
    const alerts = await this.prisma.fraudAlert.findMany({
      where: { ownerId },
      orderBy: { timestamp: 'asc' },
    });

    const clusters = [];
    let currentCluster = [];

    const TIME_WINDOW = 1000 * 60 * 60 * 2; // 2 hours

    alerts.forEach((alert, i) => {
      if (i === 0) {
        currentCluster.push(alert);
        return;
      }

      const prev = alerts[i - 1];
      const timeDiff = new Date(alert.timestamp) - new Date(prev.timestamp);

      const related =
        alert.checkId === prev.checkId ||
        alert.documentId === prev.documentId ||
        alert.severity === prev.severity ||
        timeDiff <= TIME_WINDOW;

      if (related) {
        currentCluster.push(alert);
      } else {
        clusters.push(currentCluster);
        currentCluster = [alert];
      }
    });

    if (currentCluster.length) clusters.push(currentCluster);

    return clusters.map((cluster, index) => ({
      id: index + 1,
      size: cluster.length,
      severity: this.getClusterSeverity(cluster),
      alerts: cluster,
    }));
  }

  getClusterSeverity(cluster) {
    const score = cluster.reduce((acc, a) => {
      return acc +
        (a.severity === "HIGH" ? 3 :
         a.severity === "MEDIUM" ? 2 : 1);
    }, 0);

    if (score >= 12) return "HIGH";
    if (score >= 6) return "MEDIUM";
    return "LOW";
  }
}
