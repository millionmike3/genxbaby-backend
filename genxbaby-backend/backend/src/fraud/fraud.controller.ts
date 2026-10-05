import { Controller, Get, Param } from '@nestjs/common';
import { FraudIntelligenceService } from './fraud-intelligence.service';
import { OrgId } from '../tenant/tenant.decorator';

@Controller('fraud')
export class FraudController {
  constructor(private fraud: FraudIntelligenceService) {}

  @Get('owner/:id')
  async analyzeOwner(
    @OrgId() orgId: string,
    @Param('id') ownerId: string,
  ) {
    return this.fraud.analyzeOwner(ownerId, orgId);
  }
}
