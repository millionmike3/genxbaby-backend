import { Controller, Post, Param, Body } from '@nestjs/common';
import { IncomeService } from './income.service';

@Controller('income')
export class IncomeController {
  constructor(private income: IncomeService) {}

  @Post(':docId/verify')
  verify(@Param('docId') docId: string, @Body() body: { ownerId: string }) {
    return this.income.verify(docId, body.ownerId);
  }
}
