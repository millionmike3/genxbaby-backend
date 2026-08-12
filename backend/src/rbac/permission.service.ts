import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePermissionDto) {
    return this.prisma.permission.create({
      data: {
        key: dto.key,
        name: dto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.permission.findMany({
      include: {
        roles: true,
      },
    });
  }
}
