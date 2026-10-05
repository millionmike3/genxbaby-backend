import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CaseCreateService } from './case-create.service';
import { CaseWorkflowService } from './case-workflow.service';
import { CaseNotesService } from './case-notes.service';
import { CaseAttachmentsService } from './case-attachments.service';
import { CaseIntelligenceService } from './case-intelligence.service';
import { CaseController } from './case.controller';

@Module({
  imports: [PrismaModule],
  providers: [
    CaseCreateService,
    CaseWorkflowService,
    CaseNotesService,
    CaseAttachmentsService,
    CaseIntelligenceService,
  ],
  controllers: [CaseController],
  exports: [CaseIntelligenceService],
})
export class CaseModule {}
