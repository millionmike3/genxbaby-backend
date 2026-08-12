import { Controller, Get, Param } from '@nestjs/common';
import { OwnerPortalService } from './owner-portal.service';

@Controller('owner-portal')
export class OwnerPortalController {
  constructor(private portal: OwnerPortalService) {}

  @Get(':ownerId/overview')
  overview(@Param('ownerId') ownerId: string) {
    return this.portal.getOwnerOverview(ownerId);
  }

  @Get(':ownerId/documents')
  documents(@Param('ownerId') ownerId: string) {
    return this.portal.getDocuments(ownerId);
  }

  @Get('document/:docId')
  documentDetails(@Param('docId') docId: string) {
    return this.portal.getDocumentDetails(docId);
  }

  @Get(':ownerId/checks')
  checks(@Param('ownerId') ownerId: string) {
    return this.portal.getChecks(ownerId);
  }

  @Get(':ownerId/financial-health')
  financialHealth(@Param('ownerId') ownerId: string) {
    return this.portal.getFinancialHealth(ownerId);
  }

  @Get(':ownerId/income')
  income(@Param('ownerId') ownerId: string) {
    return this.portal.getIncomeVerification(ownerId);
  }

  @Get(':ownerId/risk')
  risk(@Param('ownerId') ownerId: string) {
    return this.portal.getRisk(ownerId);
  }

  @Get(':ownerId/pricing')
  pricing(@Param('ownerId') ownerId: string) {
    return this.portal.getPricing(ownerId);
  }
}
