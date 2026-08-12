import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';

@Module({
  imports: [PrismaModule],
  controllers: [OcrController],
  providers: [OcrService],
  exports: [OcrService],
})
export class OcrModule {}
