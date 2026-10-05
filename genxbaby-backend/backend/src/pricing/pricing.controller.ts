import { Controller, Post, Get, Param } from '@nestjs/common';
import { PricingService } from './pricing.service';

@Controller('pricing')
export class PricingController {
  constructor(private pricingService: PricingService) {}

  @Post(':ownerId/compute')
  compute(@Param('ownerId') ownerId: string) {
    return this.pricingService.priceOwner(ownerId);
  }

  @Get(':ownerId/history')
  history(@Param('ownerId') ownerId: string) {
    return this.pricingService.getPricingHistory(ownerId);
  }
}
