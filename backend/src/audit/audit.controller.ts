import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditAnchorService } from './audit.anchor.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('audit')
@UseGuards(JwtAuthGuard)
export class AuditController {
  constructor(
    private audit: AuditService,
    private anchor: AuditAnchorService,
  ) {}

  @Get('recent')
  @UseGuards(new PermissionsGuard(['AUDIT:READ']))
  recent(@Req() req) {
    return this.audit.getRecent(req.user.ownerId);
  }

  @Post('anchor')
  @UseGuards(new PermissionsGuard(['AUDIT:ANCHOR']))
  anchorLogs(@Req() req) {
    return this.anchor.anchor(req.user.ownerId);
  }

  @Get('verify')
  @UseGuards(new PermissionsGuard(['AUDIT:VERIFY']))
  verify(@Req() req) {
    return this.anchor.verify(req.user.ownerId);
  }
}
