import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private admin: AdminService) {}

  @Get('owner/:ownerId')
  getOwnerDashboard(@Param('ownerId') ownerId: string) {
    return this.admin.getOwnerDashboard(ownerId);
  }

  @Get('document/:docId')
  getDocumentDashboard(@Param('docId') docId: string) {
    return this.admin.getDocumentDashboard(docId);
  }

  @Post('pipeline/run')
  runPipeline(
    @Body() body: { docId: string; ownerId: string; filePath: string },
  ) {
    return this.admin.runPipeline(body.docId, body.ownerId, body.filePath);
  }
}
