import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { FlagFraudDto } from './dto/flag-fraud.dto';
import { CreateSarDto } from './dto/create-sar.dto';

@Injectable()
export class CheckService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCheckDto) {
    const check = await this.prisma.check.create({
      data: {
        checkNumber: dto.checkNumber,
        payee: dto.payee,
        amount: dto.amount,
        memo: dto.memo,
        date: dto.date,
        bankProfileId: dto.bankProfileId,
        signerId: dto.signerId,
      },
    });

    await this.prisma.bankProfile.update({
      where: { id: dto.bankProfileId },
      data: { nextCheckNumber: dto.checkNumber + 1 },
    });

    return check;
  }

  async update(id: string, dto: UpdateCheckDto) {
    return this.prisma.check.update({
      where: { id },
      data: dto,
    });
  }

  async get(id: string) {
    const check = await this.prisma.check.findUnique({
      where: { id },
      include: {
        bankProfile: true,
        signer: true,
        fraudFlags: true,
        sarReports: true,
      },
    });

    if (!check) throw new NotFoundException('Check not found');
    return check;
  }

  async listByBankProfile(bankProfileId: string) {
    return this.prisma.check.findMany({
      where: { bankProfileId },
      include: {
        fraudFlags: true,
        sarReports: true,
      },
    });
  }

  async flagFraud(dto: FlagFraudDto) {
    return this.prisma.fraudFlag.create({
      data: {
        type: dto.type,
        severity: dto.severity,
        message: dto.message,
        checkId: dto.checkId,
      },
    });
  }

  async createSar(dto: CreateSarDto) {
    return this.prisma.suspiciousActivityReport.create({
      data: {
        flagId: dto.flagId,
        checkId: dto.checkId,
        severity: dto.severity,
        type: dto.type,
        summary: dto.summary,
      },
    });
  }

  async reissueCheck(originalCheckId: string, newCheckNumber: number) {
    const original = await this.prisma.check.findUnique({ where: { id: originalCheckId } });
    if (!original) throw new NotFoundException('Original check not found');

    const reissued = await this.prisma.check.create({
      data: {
        checkNumber: newCheckNumber,
        payee: original.payee,
        amount: original.amount,
        memo: original.memo,
        date: new Date(),
        bankProfileId: original.bankProfileId,
        signerId: original.signerId,
        reissuedToId: original.id,
      },
    });

    await this.prisma.bankProfile.update({
      where: { id: original.bankProfileId },
      data: { nextCheckNumber: newCheckNumber + 1 },
    });

    return reissued;
  }
}
