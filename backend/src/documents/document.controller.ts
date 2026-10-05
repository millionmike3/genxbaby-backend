import { Controller, Post, Param, Body } from '@nestjs/common';
import { DocumentVerificationService } from './document-verification.service';

@Controller('documents')
export class DocumentController {
  constructor(private verifier: DocumentVerificationService) {}

  @Post(':id/verify')
  async verify(@Param('id') id: string, @Body() body: { text: string }) {
    return this.verifier.verifyDocument(id, body.text);
  }
}
