import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FinancialHealthService } from './financial-health.service';
import { FinancialHealthEngine } from './financial-health.engine';
import { FinancialHealthController } from './financial-health.controller';

@Module({
  imports: [PrismaModule],
  controllers: [FinancialHealthController],
  providers: [FinancialHealthService, FinancialHealthEngine],
  exports: [FinancialHealthService],
})
export class FinancialHealthModule {}
