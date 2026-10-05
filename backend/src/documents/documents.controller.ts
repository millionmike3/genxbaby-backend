import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { UploadDocumentDto } from './dto/upload-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documents: DocumentsService) {}

  @Post('upload')
  @UseGuards(new PermissionsGuard(['DOC:UPLOAD']))
  upload(@Req() req, @Body() dto: UploadDocumentDto) {
    return this.documents.upload(dto, req.user.sub);
  }

  @Post(':id/ocr')
  @UseGuards(new PermissionsGuard(['DOC:OCR']))
  extractOCR(@Req() req, @Param('id') id: string, @Body() body: { text: string }) {
    return this.documents.extractOCR(id, body.text, req.user.sub);
  }

  @Post(':id/fraud')
  @UseGuards(new PermissionsGuard(['DOC:FRAUD']))
  addFraud(@Req() req, @Param('id') id: string, @Body() body: { result: string }) {
    return this.documents.addFraudResult(id, body.result, req.user.sub);
  }

  @Patch(':id/status')
  @UseGuards(new PermissionsGuard(['DOC:STATUS']))
  updateStatus(@Req() req, @Param('id') id: string, @Body() body: { status: string }) {
    return this.documents.updateStatus(id, body.status, req.user.sub);
  }

  @Get(':id')
  @UseGuards(new PermissionsGuard(['DOC:READ']))
  get(@Param('id') id: string) {
    return this.documents.get(id);
  }
}
