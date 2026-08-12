import { Controller, Post, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.create(dto);
  }

  @Get()
  findAll(@Query('ownerId') ownerId: string) {
    return this.roleService.findAll(ownerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.roleService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }

  @Post(':id/permissions/:permissionId')
  assignPermission(
    @Param('id') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return this.roleService.assignPermission(roleId, permissionId);
  }

  @Delete('permission-link/:id')
  removePermission(@Param('id') id: string) {
    return this.roleService.removePermission(id);
  }
}
