@Injectable()
export class IdentityResolutionService {
  constructor(private prisma: PrismaService) {}

  async resolveOwnerIdentity(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        accounts: true,
        devices: true,
        documents: true,
        checks: true,
      },
    });

    const duplicates = await this.findDuplicates(owner);
    const clusters = await this.findFraudClusters(owner);

    return { owner, duplicates, clusters };
  }

  async findDuplicates(owner) {
    return this.prisma.owner.findMany({
      where: {
        OR: [
          { email: owner.email },
          { phone: owner.phone },
          { primaryAddress: owner.primaryAddress },
        ],
        NOT: { id: owner.id },
      },
    });
  }

  async findFraudClusters(owner) {
    return this.prisma.owner.findMany({
      where: {
        accounts: {
          some: {
            routingNumber: { in: owner.accounts.map(a => a.routingNumber) },
          },
        },
      },
    });
  }
}
