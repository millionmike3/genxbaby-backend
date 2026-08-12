import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';

@Module({
  imports: [PrismaModule],
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
})
export class BankModule {}
