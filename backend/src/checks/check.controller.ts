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
    private underwriting: CheckUnderwritingService,
  ) {}

  @Post()
  create(@OrgId() orgId: string, @Body() dto: CreateCheckDto) {
    return this.checkService.create({ ...dto, organizationId: orgId });
  }

  @Get()
  listByBankProfile(@OrgId() orgId: string, @Query('bankProfileId') bankProfileId: string) {
    return this.checkService.listByBankProfile(bankProfileId, orgId);
  }

  @Get(':id')
  get(@OrgId() orgId: string, @Param('id') id: string) {
    return this.checkService.get(id, orgId);
  }

  @Patch(':id')
  update(@OrgId() orgId: string, @Param('id') id: string, @Body() dto: UpdateCheckDto) {
    return this.checkService.update(id, dto, orgId);
  }

  @Post(':id/fraud-flags')
  flagFraud(@OrgId() orgId: string, @Param('id') checkId: string, @Body() dto: Omit<FlagFraudDto, 'checkId'>) {
    return this.checkService.flagFraud({ ...dto, checkId, organizationId: orgId });
  }

  @Post(':id/sar')
  createSar(@OrgId() orgId: string, @Param('id') checkId: string, @Body() dto: Omit<CreateSarDto, 'checkId'>) {
    return this.checkService.createSar({ ...dto, checkId, organizationId: orgId });
  }

  @Post(':id/reissue')
  reissue(@OrgId() orgId: string, @Param('id') originalCheckId: string, @Body() body: { newCheckNumber: number }) {
    return this.checkService.reissueCheck(originalCheckId, body.newCheckNumber, orgId);
  }

  @Get(':id/underwrite')
  underwrite(@OrgId() orgId: string, @Param('id') checkId: string) {
    return this.underwriting.underwrite(checkId, orgId);
  }
}
