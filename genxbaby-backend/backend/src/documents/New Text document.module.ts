import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OCRService } from './ocr.service';
import { DocumentParserService } from './document-parser.service';
import { DocumentAuthenticityService } from './document-authenticity.service';
import { DocumentFraudService } from './document-fraud.service';
import { DocumentConsistencyService } from './document-consistency.service';
import { DocumentVerificationService } from './document-verification.service';
import { DocumentController } from './document.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    OCRService,
    DocumentParserService,
    DocumentAuthenticityService,
    DocumentFraudService,
    DocumentConsistencyService,
    DocumentVerificationService,
  ],
  controllers: [DocumentController],
  exports: [DocumentVerificationService],
})
export class DocumentModule {}
