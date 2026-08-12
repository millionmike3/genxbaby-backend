import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IdentityResolutionService } from './identity-resolution.service';
import { IdentityController } from './identity.controller';

@Module({
  imports: [PrismaModule],
  providers: [IdentityResolutionService],
  controllers: [IdentityController],
  exports: [IdentityResolutionService],
})
export class IdentityModule {}
