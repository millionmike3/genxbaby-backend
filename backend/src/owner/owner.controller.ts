import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { OwnerService } from './owner.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Controller('owners')
export class OwnerController {
  constructor(private ownerService: OwnerService) {}

  @Post()
  create(@Body() dto: CreateOwnerDto) {
    return this.ownerService.create(dto);
  }

  @Get()
  findAll() {
    return this.ownerService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ownerService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateOwnerDto) {
    return this.ownerService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ownerService.remove(id);
  }
}
