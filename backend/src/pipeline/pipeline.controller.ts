import { Controller, Post, Body } from '@nestjs/common';
import { PipelineService } from './pipeline.service';

@Controller('pipeline')
export class PipelineController {
  constructor(private pipeline: PipelineService) {}

  @Post('run')
  run(@Body() body: { docId: string; ownerId: string; filePath: string }) {
    return this.pipeline.runFullPipeline(body.docId, body.ownerId, body.filePath);
  }
}
