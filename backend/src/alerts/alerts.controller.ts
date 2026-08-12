import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('alerts')
@UseGuards(JwtAuthGuard)
export class AlertsController {
  constructor(private alerts: AlertsService) {}

  @Get()
  @UseGuards(new PermissionsGuard(['ALERTS:READ']))
  getAlerts(@Req() req) {
    return this.alerts.getAlerts(req.user.ownerId);
  }

  @Get('high-risk')
  @UseGuards(new PermissionsGuard(['ALERTS:READ']))
  getHighRiskAlerts(@Req() req) {
    return this.alerts.getHighRiskAlerts(req.user.ownerId);
  }
}
