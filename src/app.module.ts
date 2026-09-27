import { Module } from '@nestjs/common';
import { AlertsModule } from './fraud/alerts.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AlertsModule],
})
export class AppModule {}
