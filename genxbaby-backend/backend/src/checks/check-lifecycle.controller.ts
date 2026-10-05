import {
  Controller,
  Post,
  Param,
  Body,
  BadRequestException,
} from '@nestjs/common';

import { CheckLifecycleService } from './check-lifecycle.service';

@Controller('checks')
export class CheckLifecycleController {
  constructor(private lifecycle: CheckLifecycleService) {}

  // ⭐ ISSUE CHECK
  @Post(':id/issue')
  async issue(@Param('id') id: string) {
    return this.lifecycle.issueCheck(id);
  }

  // ⭐ CLEAR CHECK
  @Post(':id/clear')
  async clear(@Param('id') id: string) {
    return this.lifecycle.clearCheck(id);
  }

  // ⭐ RETURN CHECK
  @Post(':id/return')
  async returnCheck(@Param('id') id: string) {
    return this.lifecycle.returnCheck(id);
  }

  // ⭐ VOID CHECK
  @Post(':id/void')
  async void(@Param('id') id: string) {
    return this.lifecycle.voidCheck(id);
  }

  // ⭐ ARCHIVE CHECK
  @Post(':id/archive')
  async archive(@Param('id') id: string) {
    return this.lifecycle.archiveCheck(id);
  }

  // ⭐ REISSUE CHECK (old → new)
  @Post(':id/reissue')
  async reissue(
    @Param('id') oldCheckId: string,
    @Body() body: { newCheckId?: string },
  ) {
    if (!body.newCheckId) {
      throw new BadRequestException('newCheckId is required for reissue');
    }

    return this.lifecycle.reissueCheck(oldCheckId, body.newCheckId);
  }

  // ⭐ GENERIC TRANSITION (optional)
  @Post(':id/transition')
  async transition(
    @Param('id') id: string,
    @Body() body: { type: string; metadata?: any },
  ) {
    if (!body.type) {
      throw new BadRequestException('Lifecycle type is required');
    }

    return this.lifecycle.transition(id, body.type as any, body.metadata || {});
  }
}
