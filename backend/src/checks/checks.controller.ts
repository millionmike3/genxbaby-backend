import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChecksService } from './checks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('checks')
@UseGuards(JwtAuthGuard)
export class ChecksController {
  constructor(private checks: ChecksService) {}

  /**
   * Create a new check + AI fraud scoring
   */
  @Post('create')
  @UseGuards(new PermissionsGuard(['CHECK:WRITE']))
  async createCheck(@Req() req, @Body() body) {
    return this.checks.createCheck(req.user.ownerId, body, req.user.sub);
  }

  /**
   * Verify a check + AI fraud scoring
   */
  @Post(':id/verify')
  @UseGuards(new PermissionsGuard(['CHECK:VERIFY']))
  async verifyCheck(@Req() req, @Param('id') id: string) {
    return this.checks.verifyCheck(id, req.user.sub);
  }

  /**
   * Flag fraud + AI fraud scoring
   */
  @Post(':id/fraud')
  @UseGuards(new PermissionsGuard(['CHECK:FLAG_FRAUD']))
  async flagFraud(
    @Req() req,
    @Param('id') id: string,
    @Body() body: { type: string },
  ) {
    return this.checks.flagFraud(id, body.type, req.user.sub);
  }

  /**
   * Get check with AI insights, fraud flags, timeline, signer, bank profile
   */
  @Get(':id')
  @UseGuards(new PermissionsGuard(['CHECK:READ']))
  async getCheck(@Param('id') id: string) {
    return this.checks.getCheck(id);
  }

  /**
   * Get timeline events for a check
   */
  @Get(':id/timeline')
  @UseGuards(new PermissionsGuard(['CHECK:READ']))
  async getTimeline(@Param('id') id: string) {
    const check = await this.checks.getCheck(id);
    return check.timeline;
  }
}
