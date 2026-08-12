import { Controller, Get, Param } from '@nestjs/common';
import { SyntheticIntelligenceService } from './synthetic-intelligence.service';
import { OrgId } from '../tenant/tenant.decorator';

@Controller('synthetic')
export class SyntheticController {
  constructor(private synthetic: SyntheticIntelligenceService) {}

  @Get('owner/:id')
  async analyze(
    @OrgId() orgId: string,
    @Param('id') ownerId: string,
  ) {
    return this.synthetic.analyze(ownerId, orgId);
  }
}
