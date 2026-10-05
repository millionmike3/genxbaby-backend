import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiFraudInvestigatorService {
  constructor(private prisma: PrismaService) {}

  async investigate(ownerId: string, question: string) {
    const alerts = await this.prisma.fraudAlert.findMany({
      where: { ownerId },
      include: { check: true, document: true },
      orderBy: { timestamp: 'desc' },
    });

    const clusters = await this.prisma.fraudCluster.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });

    const risk = await this.prisma.ownerRisk.findUnique({
      where: { ownerId },
    });

    const insights = await this.prisma.aiCheckInsight.findMany({
      where: { check: { ownerId } },
      include: { check: true },
      orderBy: { score: 'desc' },
    });

    // Simple AI-style reasoning engine
    const response = this.generateResponse({
      question,
      alerts,
      clusters,
      risk,
      insights,
    });

    return { answer: response };
  }

  generateResponse({ question, alerts, clusters, risk, insights }) {
    question = question.toLowerCase();

    if (question.includes("highest risk") || question.includes("most dangerous")) {
      const top = insights[0];
      return `The highest-risk item is check #${top.check.id} with a fraud score of ${top.score}.`;
    }

    if (question.includes("recent alerts") || question.includes("latest alerts")) {
      const latest = alerts.slice(0, 3).map(a => a.type.replace(/_/g, " "));
      return `Recent alerts include: ${latest.join(", ")}.`;
    }

    if (question.includes("clusters") || question.includes("fraud ring")) {
      return `There are ${clusters.length} fraud clusters. The largest cluster contains ${clusters[0]?.size || 0} events.`;
    }

    if (question.includes("risk level") || question.includes("owner risk")) {
      return `The owner’s current risk level is ${risk.riskLevel}.`;
    }

    if (question.includes("summary") || question.includes("overview")) {
      return `The owner has ${alerts.length} fraud alerts, ${clusters.length} clusters, and a risk level of ${risk.riskLevel}.`;
    }

    return `I analyzed the fraud data. The owner has ${alerts.length} alerts, ${clusters.length} clusters, and a risk level of ${risk.riskLevel}. Ask about alerts, clusters, risk, or high-risk checks for more detail.`;
  }
}
