import { Controller, Get, Param } from '@nestjs/common';
import { UnderwritingIntelligenceService } from './underwriting-intelligence.service';
import { OrgId } from '../tenant/tenant.decorator';

@Controller('underwriting')
export class UnderwritingController {
  constructor(private uw: UnderwritingIntelligenceService) {}

  @Get('owner/:id')
  async underwrite(
    @OrgId() orgId: string,
    @Param('id') ownerId: string,
  ) {
    return this.uw.underwrite(ownerId, orgId);
  }
}
