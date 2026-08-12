import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBankProfileDto } from './dto/create-bank-profile.dto';
import { UpdateBankProfileDto } from './dto/update-bank-profile.dto';
import { CreateSignerDto } from './dto/create-signer.dto';

@Injectable()
export class BankService {
  constructor(private prisma: PrismaService) {}

  async createBankProfile(dto: CreateBankProfileDto) {
    return this.prisma.bankProfile.create({
      data: {
        ownerId: dto.ownerId,
        bankName: dto.bankName,
        routingNumber: dto.routingNumber,
        accountNumber: dto.accountNumber,
        accountType: dto.accountType,
        signerName: dto.signerName,
        signatureImage: dto.signatureImage,
      },
    });
  }

  async updateBankProfile(id: string, dto: UpdateBankProfileDto) {
    return this.prisma.bankProfile.update({
      where: { id },
      data: dto,
    });
  }

  async getBankProfile(id: string) {
    const profile = await this.prisma.bankProfile.findUnique({
      where: { id },
      include: {
        signers: true,
        checks: true,
      },
    });

    if (!profile) throw new NotFoundException('Bank profile not found');
    return profile;
  }

  async listBankProfiles(ownerId: string) {
    return this.prisma.bankProfile.findMany({
      where: { ownerId },
      include: {
        signers: true,
        checks: true,
      },
    });
  }

  async addSigner(dto: CreateSignerDto) {
    return this.prisma.signer.create({
      data: {
        bankProfileId: dto.bankProfileId,
        name: dto.name,
        title: dto.title,
        signatureImage: dto.signatureImage,
      },
    });
  }
}
