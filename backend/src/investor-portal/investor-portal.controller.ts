import { Controller, Get, Param } from '@nestjs/common';
import { InvestorPortalService } from './investor-portal.service';

@Controller('investor-portal')
export class InvestorPortalController {
  constructor(private investor: InvestorPortalService) {}

  @Get('portfolio')
  portfolioOverview() {
    return this.investor.getPortfolioOverview();
  }

  @Get('owner/:ownerId')
  ownerAnalytics(@Param('ownerId') ownerId: string) {
    return this.investor.getOwnerAnalytics(ownerId);
  }

  @Get('risk-curve')
  riskCurve() {
    return this.investor.getPortfolioRiskCurve();
  }

  @Get('yield-curve')
  yieldCurve() {
    return this.investor.getPortfolioYieldCurve();
  }
}
