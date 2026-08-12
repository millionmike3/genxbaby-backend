import { Controller, Post, Get, Param, Body, Req, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private ai: AiService) {}

  @Post('ocr/:id')
  @UseGuards(new PermissionsGuard(['AI:OCR']))
  extractOCR(@Param('id') id: string, @Body() body: { text: string }) {
    return this.ai.extractOCR(id, body.text);
  }

  @Get('check/:id/fraud')
  @UseGuards(new PermissionsGuard(['AI:FRAUD']))
  scoreCheck(@Param('id') id: string) {
    return this.ai.scoreCheck(id);
  }

  @Get('document/:id/fraud')
  @UseGuards(new PermissionsGuard(['AI:FRAUD']))
  scoreDocument(@Param('id') id: string) {
    return this.ai.scoreDocument(id);
  }

  @Get('owner/:id/risk')
  @UseGuards(new PermissionsGuard(['AI:RISK']))
  predictOwnerRisk(@Param('id') id: string) {
    return this.ai.predictOwnerRisk(id);
  }
}
