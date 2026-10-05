import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnerService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOwnerDto) {
    return this.prisma.owner.create({
      data: {
        name: dto.name,
        email: dto.email,
      },
    });
  }

  async findAll() {
    return this.prisma.owner.findMany({
      include: {
        users: true,
        roles: true,
        bankProfiles: true,
      },
    });
  }

  async findOne(id: string) {
    const owner = await this.prisma.owner.findUnique({
      where: { id },
      include: {
        users: true,
        roles: true,
        bankProfiles: true,
      },
    });

    if (!owner) throw new NotFoundException('Owner not found');
    return owner;
  }

  async update(id: string, dto: UpdateOwnerDto) {
    return this.prisma.owner.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.owner.delete({
      where: { id },
    });
  }
}
