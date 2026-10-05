import { Controller, Post, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankProfileDto } from './dto/create-bank-profile.dto';
import { UpdateBankProfileDto } from './dto/update-bank-profile.dto';
import { CreateSignerDto } from './dto/create-signer.dto';

@Controller('bank-profiles')
export class BankController {
  constructor(private bankService: BankService) {}

  @Post()
  create(@Body() dto: CreateBankProfileDto) {
    return this.bankService.createBankProfile(dto);
  }

  @Get()
  list(@Query('ownerId') ownerId: string) {
    return this.bankService.listBankProfiles(ownerId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.bankService.getBankProfile(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBankProfileDto) {
    return this.bankService.updateBankProfile(id, dto);
  }

  @Post(':id/signers')
  addSigner(@Param('id') bankProfileId: string, @Body() dto: Omit<CreateSignerDto, 'bankProfileId'>) {
    return this.bankService.addSigner({ ...dto, bankProfileId });
  }
}
