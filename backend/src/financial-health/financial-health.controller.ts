import { Controller, Post, Param, Body } from '@nestjs/common';
import { FinancialHealthService } from './financial-health.service';

@Controller('financial-health')
export class FinancialHealthController {
  constructor(private health: FinancialHealthService) {}

  @Post(':docId/compute')
  compute(@Param('docId') docId: string, @Body() body: { ownerId: string }) {
    return this.health.compute(docId, body.ownerId);
  }
}
