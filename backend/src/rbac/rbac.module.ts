import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RoleService } from './role.service';
import { PermissionService } from './permission.service';
import { RoleController } from './role.controller';
import { PermissionController } from './permission.controller';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController, PermissionController],
  providers: [RoleService, PermissionService],
  exports: [RoleService, PermissionService],
})
export class RbacModule {}
