import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyntheticCollisionService {
  constructor(private prisma: PrismaService) {}

  async detect(owner) {
    const collisions = [];

    // Email collision
    const emailMatches = await this.prisma.owner.findMany({
      where: { email: owner.email, NOT: { id: owner.id } },
    });
    if (emailMatches.length) collisions.push('EMAIL_COLLISION');

    // Phone collision
    const phoneMatches = await this.prisma.owner.findMany({
      where: { phone: owner.phone, NOT: { id: owner.id } },
    });
    if (phoneMatches.length) collisions.push('PHONE_COLLISION');

    // Address collision
    const addressMatches = await this.prisma.owner.findMany({
      where: { primaryAddress: owner.primaryAddress, NOT: { id: owner.id } },
    });
    if (addressMatches.length) collisions.push('ADDRESS_COLLISION');

    return collisions;
  }
}
