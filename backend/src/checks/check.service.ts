import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { FlagFraudDto } from './dto/flag-fraud.dto';
import { CreateSarDto } from './dto/create-sar.dto';

@Injectable()
export class CheckService {
  constructor(private prisma: PrismaService) {}

  // ────────────────────────────────────────────────
  // CREATE CHECK (Tenant‑Aware)
  // ────────────────────────────────────────────────
  async create(dto: CreateCheckDto) {
    return this.prisma.check.create({
      data: {
        ...dto,
        organizationId: dto.organizationId, // ⭐ tenant required
      },
    });
  }

  // ────────────────────────────────────────────────
  // GET CHECK (Tenant‑Aware)
  // ────────────────────────────────────────────────
  async get(id: string, orgId: string) {
    return this.prisma.check.findFirst({
      where: { id, organizationId: orgId },
      include: {
        fraudFlags: true,
        sarReports: true,
        lifecycleEvents: true,
        auditLogs: true,
        bankProfile: true,
        signer: true,
        owner: true,
      },
    });
  }

  // ────────────────────────────────────────────────
  // UPDATE CHECK (Tenant‑Aware)
  // ────────────────────────────────────────────────
  async update(id: string, dto: UpdateCheckDto, orgId: string) {
    return this.prisma.check.updateMany({
      where: { id, organizationId: orgId },
      data: dto,
    });
  }

  // ────────────────────────────────────────────────
  // FLAG FRAUD (Tenant‑Aware)
  // ────────────────────────────────────────────────
  async flagFraud(dto: FlagFraudDto) {
    return this.prisma.fraudFlag.create({
      data: {
        ...dto,
        organizationId: dto.organizationId, // ⭐ required
      },
    });
  }

  // ────────────────────────────────────────────────
  // CREATE SAR (Tenant‑Aware)
  // ────────────────────────────────────────────────
  async createSar(dto: CreateSarDto) {
    return this.prisma.suspiciousActivityReport.create({
      data: {
        ...dto,
        organizationId: dto.organizationId, // ⭐ required
      },
    });
  }

  // ────────────────────────────────────────────────
  // REISSUE CHECK (Tenant‑Aware)
  // ────────────────────────────────────────────────
  async reissueCheck(originalCheckId: string, newCheckNumber: number, orgId: string) {
    // Ensure original check belongs to this org
    const original = await this.prisma.check.findFirst({
      where: { id: originalCheckId, organizationId: orgId },
    });

    if (!original) {
      throw new Error('Check not found in this organization');
    }

    // Create new check
    const newCheck = await this.prisma.check.create({
      data: {
        checkNumber: newCheckNumber,
        payee: original.payee,
        amount: original.amount,
        memo: original.memo,
        date: new Date(),
        bankProfileId: original.bankProfileId,
        signerId: original.signerId,
        ownerId: original.ownerId,
        organizationId: orgId, // ⭐ tenant inheritance
        status: 'REISSUED',
      },
    });

    // Update original check
    await this.prisma.check.update({
      where: { id: originalCheckId },
      data: {
        reissuedToId: newCheck.id,
        status: 'REISSUED',
      },
    });

    return newCheck;
  }
}
