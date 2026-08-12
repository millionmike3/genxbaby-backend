import { Controller, Get, Post, Param } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private riskService: RiskService) {}

  @Post(':ownerId/compute')
  compute(@Param('ownerId') ownerId: string) {
    return this.riskService.computeAndLogRisk(ownerId);
  }

  @Get(':ownerId/history')
  history(@Param('ownerId') ownerId: string) {
    return this.riskService.getHistory(ownerId);
  }
}
