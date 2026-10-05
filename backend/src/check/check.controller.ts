import { Controller, Post, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { CheckService } from './check.service';
import { CreateCheckDto } from './dto/create-check.dto';
import { UpdateCheckDto } from './dto/update-check.dto';
import { FlagFraudDto } from './dto/flag-fraud.dto';
import { CreateSarDto } from './dto/create-sar.dto';
import { CheckUnderwritingService } from './check-underwriting.service';
import { OrgId } from '../tenant/tenant.decorator';

@Controller('checks')
export class CheckController {
  constructor(
    private checkService: CheckService,
    private underwriting: CheckUnderwritingService,   // ⭐ NEW
  ) {}

  @Post()
  create(@Body() dto: CreateCheckDto) {
    return this.checkService.create(dto);
  }

  @Get()
  listByBankProfile(@Query('bankProfileId') bankProfileId: string) {
    return this.checkService.listByBankProfile(bankProfileId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.checkService.get(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCheckDto) {
    return this.checkService.update(id, dto);
  }

  @Post(':id/fraud-flags')
  flagFraud(@Param('id') checkId: string, @Body() dto: Omit<FlagFraudDto, 'checkId'>) {
    return this.checkService.flagFraud({ ...dto, checkId });
  }

  @Post(':id/sar')
  createSar(@Param('id') checkId: string, @Body() dto: Omit<CreateSarDto, 'checkId'>) {
    return this.checkService.createSar({ ...dto, checkId });
  }

  @Post(':id/reissue')
  reissue(@Param('id') originalCheckId: string, @Body() body: { newCheckNumber: number }) {
    return this.checkService.reissueCheck(originalCheckId, body.newCheckNumber);
  }

  // ────────────────────────────────────────────────
  // ⭐ NEW: Tenant‑Aware Check Underwriting Endpoint
  // ────────────────────────────────────────────────
  @Get(':id/underwrite')
  async underwrite(
    @OrgId() orgId: string,
    @Param('id') checkId: string,
  ) {
    return this.underwriting.underwrite(checkId, orgId);
  }
}
