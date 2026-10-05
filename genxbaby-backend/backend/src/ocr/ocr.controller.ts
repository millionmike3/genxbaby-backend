import { Controller, Post, Param, Body } from '@nestjs/common';
import { OcrService } from './ocr.service';

@Controller('ocr')
export class OcrController {
  constructor(private ocr: OcrService) {}

  @Post(':docId/extract')
  extract(@Param('docId') docId: string, @Body() body: { filePath: string }) {
    return this.ocr.extract(docId, body.filePath);
  }
}
