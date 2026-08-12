import { Controller, Get, Patch, Post, Param, Body, Req, UseGuards } from '@nestjs/common';
import { OwnersService } from './owners.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('owners')
@UseGuards(JwtAuthGuard)
export class OwnersController {
  constructor(private owners: OwnersService) {}

  @Get(':id')
  @UseGuards(new PermissionsGuard(['OWNER:READ']))
  async getOwner(@Param('id') id: string) {
    return this.owners.getOwner(id);
  }

  @Patch(':id')
  @UseGuards(new PermissionsGuard(['OWNER:WRITE']))
  async updateOwner(@Req() req, @Param('id') id: string, @Body() body) {
    return this.owners.updateOwner(id, body, req.user.sub);
  }

  @Post(':id/risk')
  @UseGuards(new PermissionsGuard(['OWNER:RISK']))
  async addRiskEvent(@Req() req, @Param('id') id: string, @Body() body) {
    return this.owners.addRiskEvent(id, body.type, req.user.sub);
  }

  @Post(':id/pricing')
  @UseGuards(new PermissionsGuard(['OWNER:PRICING']))
  async addPricingDecision(@Req() req, @Param('id') id: string, @Body() body) {
    return this.owners.addPricingDecision(id, body.decision, req.user.sub);
  }

  @Post(':id/sar')
  @UseGuards(new PermissionsGuard(['OWNER:SAR']))
  async fileSAR(@Req() req, @Param('id') id: string, @Body() body) {
    return this.owners.fileSAR(id, body.reason, req.user.sub);
  }
}
