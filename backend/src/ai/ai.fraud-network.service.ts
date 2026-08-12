import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiFraudNetworkService {
  constructor(private prisma: PrismaService) {}

  async getFraudNetwork(ownerId: string) {
    const alerts = await this.prisma.fraudAlert.findMany({
      where: { ownerId },
      include: {
        check: true,
        document: true,
      },
    });

    const nodes = [];
    const links = [];

    const addNode = (id, type) => {
      if (!nodes.find(n => n.id === id)) {
        nodes.push({ id, type });
      }
    };

    alerts.forEach(alert => {
      const alertNode = `alert-${alert.id}`;
      addNode(alertNode, "ALERT");

      if (alert.check) {
        const checkNode = `check-${alert.check.id}`;
        addNode(checkNode, "CHECK");

        links.push({
          source: alertNode,
          target: checkNode,
          severity: alert.severity,
        });

        if (alert.check.routingNumber) {
          const routingNode = `routing-${alert.check.routingNumber}`;
          addNode(routingNode, "ROUTING");

          links.push({
            source: checkNode,
            target: routingNode,
            severity: alert.severity,
          });
        }

        if (alert.check.accountNumber) {
          const accountNode = `account-${alert.check.accountNumber}`;
          addNode(accountNode, "ACCOUNT");

          links.push({
            source: checkNode,
            target: accountNode,
            severity: alert.severity,
          });
        }
      }

      if (alert.document) {
        const docNode = `doc-${alert.document.id}`;
        addNode(docNode, "DOCUMENT");

        links.push({
          source: alertNode,
          target: docNode,
          severity: alert.severity,
        });
      }
    });

    return { nodes, links };
  }
}
