import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { CaseCreateService } from './case-create.service';
import { CaseWorkflowService } from './case-workflow.service';
import { CaseNotesService } from './case-notes.service';
import { CaseIntelligenceService } from './case-intelligence.service';
import { OrgId } from '../tenant/tenant.decorator';

@Controller('cases')
export class CaseController {
  constructor(
    private create: CaseCreateService,
    private workflow: CaseWorkflowService,
    private notes: CaseNotesService,
    private intel: CaseIntelligenceService,
  ) {}

  @Post('owner/:id')
  async createCase(
    @OrgId() orgId: string,
    @Param('id') ownerId: string,
    @Body() body: { alertId?: string },
  ) {
    return this.create.createCase(ownerId, orgId, body.alertId);
  }

  @Post(':id/status')
  async updateStatus(
    @OrgId() orgId: string,
    @Param('id') caseId: string,
    @Body() body: { status: string },
  ) {
    return this.workflow.updateStatus(caseId, orgId, body.status);
  }

  @Post(':id/note')
  async addNote(
    @OrgId() orgId: string,
    @Param('id') caseId: string,
    @Body() body: { message: string },
  ) {
    return this.notes.addNote(caseId, orgId, body.message);
  }

  @Get(':id')
  async getCase(
    @OrgId() orgId: string,
    @Param('id') caseId: string,
  ) {
    return this.intel.getCase(caseId, orgId);
  }
}
