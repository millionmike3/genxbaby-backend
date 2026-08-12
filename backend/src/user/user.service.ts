import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ownerId: dto.ownerId,
        email: dto.email,
        name: dto.name,
        password: dto.password, // in practice: hash before saving
      },
    });
  }

  async findAllByOwner(ownerId: string) {
    return this.prisma.user.findMany({
      where: { ownerId },
      include: {
        roles: true,
        behaviorProfiles: true,
        behaviorSessions: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
        behaviorProfiles: true,
        behaviorSessions: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
