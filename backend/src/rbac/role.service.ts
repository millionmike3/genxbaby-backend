import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        ownerId: dto.ownerId,
        name: dto.name,
      },
    });
  }

  async findAll(ownerId: string) {
    return this.prisma.role.findMany({
      where: { ownerId },
      include: {
        permissions: true,
        users: true,
      },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        permissions: true,
        users: true,
      },
    });

    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    return this.prisma.role.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: string) {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async assignPermission(roleId: string, permissionId: string) {
    return this.prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async removePermission(rolePermissionId: string) {
    return this.prisma.rolePermission.delete({
      where: { id: rolePermissionId },
    });
  }
}
