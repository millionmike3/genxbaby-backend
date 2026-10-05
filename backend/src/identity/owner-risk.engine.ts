@Injectable()
export class OwnerRiskEngine {
  constructor(private prisma: PrismaService) {}

  async calculateRisk(ownerId: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id: ownerId },
      include: {
        fraudFlags: true,
        sarReports: true,
        identityEvents: true,
      },
    });

    let score = 0;

    score += owner.fraudFlags.length * 10;
    score += owner.sarReports.length * 20;

    if (owner.verificationStatus === 'HIGH_RISK') score += 30;
    if (owner.verificationStatus === 'SYNTHETIC_SUSPECT') score += 50;

    const riskLevel =
      score > 100 ? 'CRITICAL' :
      score > 60 ? 'HIGH' :
      score > 30 ? 'MEDIUM' : 'LOW';

    await this.prisma.owner.update({
      where: { id: ownerId },
      data: { riskScore: score, riskLevel },
    });

    return { score, riskLevel };
  }
}
