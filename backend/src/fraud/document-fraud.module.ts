import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DocumentFraudService } from './document-fraud.service';

@Module({
  imports: [PrismaModule],
  providers: [DocumentFraudService],
  exports: [DocumentFraudService],
})
export class DocumentFraudModule {}
