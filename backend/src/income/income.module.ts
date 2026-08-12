import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IncomeService } from './income.service';
import { IncomeEngine } from './income.engine';
import { IncomeController } from './income.controller';

@Module({
  imports: [PrismaModule],
  controllers: [IncomeController],
  providers: [IncomeService, IncomeEngine],
  exports: [IncomeService],
})
export class IncomeModule {}
